/**
 * Pure financial math shared across the three calculator modes.
 * Rates come in as percentages (6.5 means 6.5%) and are converted here.
 */

import {
  AmortizationRow,
  CombinedConfig,
  CombinedPoint,
  CombinedResult,
  ContributionFrequency,
  DownPaymentFunding,
  InvestmentConfig,
  InvestmentPoint,
  InvestmentResult,
  MortgageConfig,
  MortgageResult,
  PaymentFrequency,
} from "../types";
import {
  AccountPortfolio,
  HBP_MAX_WITHDRAWAL,
  HBP_REPAYMENT_YEARS,
  createAccountPortfolio,
} from "./accountFilling";

/** Contribution periods per year. */
export const PERIODS_PER_YEAR: Record<ContributionFrequency, number> = {
  monthly: 12,
  biweekly: 26,
  weekly: 52,
};

/** Mortgage payments per year (accelerated variants share the count). */
export const PAYMENTS_PER_YEAR: Record<PaymentFrequency, number> = {
  monthly: 12,
  "biweekly-accelerated": 26,
  biweekly: 26,
  "weekly-accelerated": 52,
  weekly: 52,
};

/**
 * Effective per-period rate that compounds to exactly `annualRatePct`
 * over `periodsPerYear` periods: (1 + r)^(1/n) − 1.
 *
 * Keeps annual growth identical across contribution frequencies — the
 * frequency input only changes contribution *timing*, never the annual
 * return. (Naively dividing the annual rate would inflate weekly returns.)
 */
export const effectivePeriodicRate = (
  annualRatePct: number,
  periodsPerYear: number
): number => Math.pow(1 + annualRatePct / 100, 1 / periodsPerYear) - 1;

/**
 * Canadian mortgages compound semi-annually regardless of payment
 * frequency. Converts the quoted annual rate to the effective
 * per-payment rate: (1 + r/2)^(2/n) − 1.
 */
export const mortgagePeriodicRate = (
  annualRatePct: number,
  paymentsPerYear: number
): number => Math.pow(1 + annualRatePct / 200, 2 / paymentsPerYear) - 1;

/**
 * CMHC default-insurance premium rate by down-payment percentage.
 * Mandatory below 20% down; the premium (rate × loan amount) is added to
 * the mortgage principal. Returns 0 at ≥ 20%.
 */
export const cmhcPremiumRate = (downPaymentPct: number): number => {
  if (downPaymentPct >= 20) return 0;
  if (downPaymentPct >= 15) return 0.028;
  if (downPaymentPct >= 10) return 0.031;
  return 0.04; // 5–9.99% down (5% is the legal minimum)
};

/** CRA RRSP dollar limit for 2026 — the cap on new room per year. */
export const RRSP_DOLLAR_LIMIT = 33810;

/** New RRSP room from earned income: 18%, capped at the CRA limit. */
export const rrspNewRoomFromIncome = (annualIncome: number): number =>
  Math.round(Math.min(annualIncome * 0.18, RRSP_DOLLAR_LIMIT));

/** Discount a nominal future value to present dollars. */
export const toPresentValue = (
  nominal: number,
  inflationPct: number,
  years: number
): number => nominal / Math.pow(1 + inflationPct / 100, years);

/** Standard annuity payment: P·r / (1 − (1+r)^−n). */
const annuityPayment = (principal: number, rate: number, n: number): number =>
  rate === 0 ? principal / n : (principal * rate) / (1 - Math.pow(1 + rate, -n));

export interface ResolvedDownPayment {
  dollars: number;
  percent: number;
}

export const resolveDownPayment = (
  config: MortgageConfig
): ResolvedDownPayment => {
  const dollars =
    config.downPaymentMode === "percent"
      ? (config.homePrice * config.downPaymentValue) / 100
      : config.downPaymentValue;
  return {
    dollars,
    percent: config.homePrice > 0 ? (dollars / config.homePrice) * 100 : 0,
  };
};

/** Portfolio at the given MER, with tax drag on the taxable account. */
const makePortfolio = (config: InvestmentConfig, merPct: number, periodsPerYear: number) =>
  createAccountPortfolio({
    accounts: config.accounts,
    registeredRate: effectivePeriodicRate(
      config.annualReturnPct - merPct,
      periodsPerYear
    ),
    taxableRate: effectivePeriodicRate(
      (config.annualReturnPct - merPct) *
        (1 - config.accounts.taxableTaxRatePct / 100),
      periodsPerYear
    ),
    inflationPct: config.inflationPct,
    horizonYears: config.years,
  });

/** Route a lump sum through the room-filling logic; overflow → taxable. */
const seedPortfolio = (portfolio: AccountPortfolio, amount: number) => {
  const split = portfolio.contribute(amount);
  portfolio.depositTaxable(split.overflow);
};

/**
 * Investment projection: starting balances sit in their accounts
 * without consuming room; every new contribution routes through
 * TFSA → RRSP room per the fill priority, spilling to the taxable
 * account, which grows at the tax-dragged rate. Room grants land at
 * each 12-month anniversary. Fee impact is the delta vs an
 * identically-routed MER-free run.
 */
export const runInvestmentProjection = (
  config: InvestmentConfig
): InvestmentResult => {
  const periodsPerYear = PERIODS_PER_YEAR[config.contributionFrequency];
  const totalPeriods = Math.round(config.years * periodsPerYear);

  const portfolio = makePortfolio(config, config.merPct, periodsPerYear);
  const feeFree = makePortfolio(config, 0, periodsPerYear);
  const startingBalance =
    config.accounts.tfsaBalance +
    config.accounts.rrspBalance +
    config.accounts.fhsaBalance +
    config.accounts.taxableBalance;

  const snapshot = (contributions: number) => ({
    tfsa: portfolio.tfsa,
    rrsp: portfolio.rrsp,
    fhsa: portfolio.fhsa,
    taxable: portfolio.taxable,
    total: portfolio.total,
    contributions,
    feeFreeTotal: feeFree.total,
  });

  const snapshots = [snapshot(startingBalance)];
  for (let i = 1; i <= totalPeriods; i++) {
    if ((i - 1) % periodsPerYear === 0 && i > 1) {
      const yearIndex = (i - 1) / periodsPerYear;
      portfolio.grantAnnualRoom(yearIndex);
      feeFree.grantAnnualRoom(yearIndex);
    }
    portfolio.grow();
    seedPortfolio(portfolio, config.contributionAmount);
    feeFree.grow();
    seedPortfolio(feeFree, config.contributionAmount);
    snapshots.push(
      snapshot(snapshots[i - 1].contributions + config.contributionAmount)
    );
  }

  const months = Math.round(config.years * 12);
  const timeline: InvestmentPoint[] = [];
  for (let month = 0; month <= months; month++) {
    const idx = Math.min(
      totalPeriods,
      Math.round((month / 12) * periodsPerYear)
    );
    const snap = snapshots[idx];
    timeline.push({
      month,
      tfsaBalance: snap.tfsa,
      rrspBalance: snap.rrsp,
      fhsaBalance: snap.fhsa,
      taxableBalance: snap.taxable,
      totalValue: snap.total,
      totalContributions: snap.contributions,
      cumulativeFees: snap.feeFreeTotal - snap.total,
      realTotalValue: toPresentValue(
        snap.total,
        config.inflationPct,
        month / 12
      ),
    });
  }

  const last = timeline[timeline.length - 1];
  return {
    timeline,
    futureValue: last.totalValue,
    futureValueReal: last.realTotalValue,
    totalContributions: last.totalContributions,
    totalGrowth: last.totalValue - last.totalContributions,
    totalFees: last.cumulativeFees,
  };
};

/**
 * Full amortization schedule. Accelerated frequencies pay the monthly
 * payment ÷ 2 (or ÷ 4) and fall out of the loop early; non-accelerated
 * payments are solved to match the amortization exactly. Rate is
 * assumed constant across term renewals.
 */
export const runMortgageProjection = (
  config: MortgageConfig
): MortgageResult => {
  const { dollars: down, percent: downPct } = resolveDownPayment(config);
  const baseLoan = Math.max(0, config.homePrice - down);
  const cmhcPremium =
    downPct >= 20
      ? 0
      : config.cmhcPremiumOverride ?? baseLoan * cmhcPremiumRate(downPct);
  const loanAmount = baseLoan + cmhcPremium;

  const paymentsPerYear = PAYMENTS_PER_YEAR[config.paymentFrequency];
  const rate = mortgagePeriodicRate(config.annualRatePct, paymentsPerYear);

  let paymentAmount: number;
  if (
    config.paymentFrequency === "biweekly-accelerated" ||
    config.paymentFrequency === "weekly-accelerated"
  ) {
    const monthlyPayment = annuityPayment(
      loanAmount,
      mortgagePeriodicRate(config.annualRatePct, 12),
      config.amortizationYears * 12
    );
    paymentAmount =
      config.paymentFrequency === "biweekly-accelerated"
        ? monthlyPayment / 2
        : monthlyPayment / 4;
  } else {
    paymentAmount = annuityPayment(
      loanAmount,
      rate,
      config.amortizationYears * paymentsPerYear
    );
  }

  const schedule: AmortizationRow[] = [];
  let balance = loanAmount;
  let totalInterest = 0;
  const maxPayments = (config.amortizationYears + 1) * paymentsPerYear;
  for (let i = 1; balance > 0.005 && i <= maxPayments; i++) {
    const interest = balance * rate;
    const principal = Math.min(paymentAmount - interest, balance);
    if (principal <= 0) break; // payment doesn't cover interest — stop rather than diverge
    balance = Math.max(0, balance - principal);
    totalInterest += interest;
    schedule.push({
      paymentNumber: i,
      month: (i * 12) / paymentsPerYear,
      principalPaid: principal,
      interestPaid: interest,
      balance,
    });
  }

  const payoffMonths = schedule.length
    ? schedule[schedule.length - 1].month
    : 0;

  const termRenewals: { year: number; balance: number }[] = [];
  for (
    let year = config.termYears;
    year < config.amortizationYears && config.termYears > 0;
    year += config.termYears
  ) {
    const row = schedule.filter((r) => r.month <= year * 12).pop();
    if (!row || row.balance <= 0) break;
    termRenewals.push({ year, balance: row.balance });
  }

  return {
    paymentAmount,
    loanAmount,
    cmhcPremium,
    schedule,
    totalInterest,
    termRenewals,
    payoffMonths,
  };
};

/** Monthly sample of a mortgage schedule, for charting. */
export const sampleMortgageMonthly = (
  result: MortgageResult
): { month: number; balance: number; cumulativeInterest: number }[] => {
  const months = Math.ceil(result.payoffMonths);
  const samples = [];
  let idx = 0;
  let cumulativeInterest = 0;
  let balance = result.loanAmount;
  for (let month = 0; month <= months; month++) {
    while (
      idx < result.schedule.length &&
      result.schedule[idx].month <= month
    ) {
      cumulativeInterest += result.schedule[idx].interestPaid;
      balance = result.schedule[idx].balance;
      idx++;
    }
    samples.push({ month, balance, cumulativeInterest });
  }
  return samples;
};

/**
 * How the down payment is funded, clamped to reality: each requested
 * source is limited by its balance (RRSP additionally by the $60k HBP
 * cap) and by what the down payment still needs, in FHSA → TFSA →
 * RRSP → taxable order. The unfunded remainder is external cash.
 */
export const resolveDownPaymentFunding = (
  config: CombinedConfig,
  downPaymentDollars: number
): DownPaymentFunding => {
  const { accounts } = config.investment;
  let need = downPaymentDollars;
  const take = (requested: number, available: number) => {
    const taken = Math.max(0, Math.min(requested, available, need));
    need -= taken;
    return taken;
  };
  const fhsa = take(config.downPaymentFromFhsa, accounts.fhsaBalance);
  const tfsa = take(config.downPaymentFromTfsa, accounts.tfsaBalance);
  const rrsp = take(
    Math.min(config.downPaymentFromRrsp, HBP_MAX_WITHDRAWAL),
    accounts.rrspBalance
  );
  const taxable = take(
    config.downPaymentFromTaxable,
    accounts.taxableBalance
  );
  return { fhsa, tfsa, rrsp, taxable, cash: need };
};

/**
 * Rent-vs-buy projection: two universes sharing one monthly budget
 * (rent + monthly-ized contribution).
 *
 * The budget steps up annually with inflation (income keeps pace);
 * `monthlyBudget` in the result is today's value.
 * RENT: pays rent (stepping up annually at rentGrowthPct), invests the
 * remainder; the down-payment cash is invested from day one.
 * BUY: pays the mortgage (monthly-equivalent of the chosen frequency's
 * payment, fixed in nominal terms) and ownership costs (scaling with
 * home value), invests the remainder; overflow beyond registered room
 * goes to taxable or extra mortgage principal per
 * `overflowDestination`. After payoff the whole budget (minus
 * ownership costs) invests.
 *
 * The buy scenario walks the mortgage monthly (so prepayments can
 * change its path) — its balance can differ slightly from the mortgage
 * tab's exact per-payment schedule for sub-monthly frequencies.
 */
export const runCombinedProjection = (
  config: CombinedConfig,
  investment: InvestmentResult,
  mortgage: MortgageResult
): CombinedResult => {
  const inv = config.investment;
  const months = Math.round(inv.years * 12);
  const monthlyContribution =
    (inv.contributionAmount * PERIODS_PER_YEAR[inv.contributionFrequency]) /
    12;
  const monthlyBudget = config.monthlyRent + monthlyContribution;
  const { dollars: downDollars } = resolveDownPayment(config.mortgage);

  // Both universes start with the existing account balances (placed
  // without consuming room). The buyer pulls the investment-funded part
  // of the down payment out at purchase and closes the FHSA (home
  // bought — remainder transfers to the RRSP). The renter keeps those
  // investments untouched and instead invests the CASH portion the
  // buyer would have spent — new money, so it routes through room.
  const funding = resolveDownPaymentFunding(config, downDollars);
  const renter = makePortfolio(inv, inv.merPct, 12);
  seedPortfolio(renter, funding.cash);
  const buyer = makePortfolio(inv, inv.merPct, 12);
  buyer.withdraw("fhsa", funding.fhsa);
  buyer.withdraw("tfsa", funding.tfsa);
  buyer.withdraw("rrsp", funding.rrsp);
  buyer.withdraw("taxable", funding.taxable);
  buyer.closeFhsa();

  // HBP: repay 1/15th per year over 15 years, starting the 2nd year
  // after withdrawal (years 2–16). Comes out of the buyer's budget and
  // goes back into the RRSP without consuming room.
  const hbpMonthlyRepayment = funding.rrsp / HBP_REPAYMENT_YEARS / 12;

  const monthlyRate = mortgagePeriodicRate(config.mortgage.annualRatePct, 12);
  const monthlyMortgageOutflow =
    (mortgage.paymentAmount *
      PAYMENTS_PER_YEAR[config.mortgage.paymentFrequency]) /
    12;
  let balance = mortgage.loanAmount;

  let buyShortfallMonth: number | null = null;
  let rentShortfallMonth: number | null = null;

  const point = (month: number): CombinedPoint => {
    const homeValue =
      config.mortgage.homePrice *
      Math.pow(1 + config.homeAppreciationPct / 100, month / 12);
    const homeEquity = homeValue - balance;
    const netWorth = buyer.total + homeEquity;
    const rentNetWorth = renter.total;
    return {
      month,
      investmentsTotal: buyer.total,
      mortgageBalance: balance,
      homeValue,
      homeEquity,
      netWorth,
      realNetWorth: toPresentValue(netWorth, inv.inflationPct, month / 12),
      rentNetWorth,
      realRentNetWorth: toPresentValue(
        rentNetWorth,
        inv.inflationPct,
        month / 12
      ),
    };
  };

  const timeline: CombinedPoint[] = [point(0)];
  for (let month = 1; month <= months; month++) {
    if ((month - 1) % 12 === 0 && month > 1) {
      const yearIndex = (month - 1) / 12;
      renter.grantAnnualRoom(yearIndex);
      buyer.grantAnnualRoom(yearIndex);
      // TFSA room withdrawn for the down payment comes back the
      // following January.
      if (yearIndex === 1) buyer.addTfsaRoom(funding.tfsa);
    }

    const yearIndex = Math.floor((month - 1) / 12);
    // The budget tracks income: it steps up annually with inflation.
    // Rent steps up at its own rate; the mortgage payment stays fixed —
    // which is exactly the inflation-hedge property of a mortgage.
    const budget =
      monthlyBudget * Math.pow(1 + inv.inflationPct / 100, yearIndex);
    const rent =
      config.monthlyRent * Math.pow(1 + config.rentGrowthPct / 100, yearIndex);
    const homeValue =
      config.mortgage.homePrice *
      Math.pow(1 + config.homeAppreciationPct / 100, month / 12);
    const ownershipCost = (homeValue * config.ownershipCostPct) / 100 / 12;

    // Rent universe
    renter.grow();
    const renterInvest = budget - rent;
    if (renterInvest < 0 && rentShortfallMonth === null) {
      rentShortfallMonth = month;
    }
    if (renterInvest > 0) seedPortfolio(renter, renterInvest);

    // Buy universe
    buyer.grow();
    let outflow = 0;
    if (balance > 0) {
      const interest = balance * monthlyRate;
      const principal = Math.min(monthlyMortgageOutflow - interest, balance);
      balance = Math.max(0, balance - principal);
      outflow = interest + principal;
    }
    const hbpRepayment =
      yearIndex >= 2 && yearIndex < 2 + HBP_REPAYMENT_YEARS
        ? hbpMonthlyRepayment
        : 0;
    if (hbpRepayment > 0) buyer.repayRrsp(hbpRepayment);
    const buyerInvest = budget - outflow - ownershipCost - hbpRepayment;
    if (buyerInvest < 0 && buyShortfallMonth === null) {
      buyShortfallMonth = month;
    }
    if (buyerInvest > 0) {
      const split = buyer.contribute(buyerInvest);
      if (split.overflow > 0) {
        if (config.overflowDestination === "mortgage" && balance > 0) {
          const prepay = Math.min(split.overflow, balance);
          balance -= prepay;
          buyer.depositTaxable(split.overflow - prepay);
        } else {
          buyer.depositTaxable(split.overflow);
        }
      }
    }

    timeline.push(point(month));
  }

  // Breakeven: the month from which buying stays ahead through the horizon.
  let lastBehind = -1;
  for (let i = 0; i < timeline.length; i++) {
    if (timeline[i].netWorth < timeline[i].rentNetWorth) lastBehind = i;
  }
  const breakevenMonth =
    lastBehind === -1
      ? 0
      : lastBehind === timeline.length - 1
        ? null
        : timeline[lastBehind + 1].month;

  return {
    investment,
    mortgage,
    timeline,
    downPaymentFunding: funding,
    monthlyBudget,
    breakevenMonth,
    buyShortfallMonth,
    rentShortfallMonth,
  };
};
