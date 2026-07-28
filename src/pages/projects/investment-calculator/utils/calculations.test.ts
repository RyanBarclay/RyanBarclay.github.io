import { describe, expect, it } from "vitest";
import {
  AccountConfig,
  CombinedConfig,
  InvestmentConfig,
  MortgageConfig,
} from "../types";
import {
  RRSP_DOLLAR_LIMIT,
  cmhcPremiumRate,
  effectivePeriodicRate,
  mortgagePeriodicRate,
  resolveDownPayment,
  rrspNewRoomFromIncome,
  runCombinedProjection,
  runInvestmentProjection,
  runMortgageProjection,
  toPresentValue,
} from "./calculations";

/**
 * Effectively-infinite TFSA room and empty balances, so the compounding
 * anchors below stay pure compound-interest checks (everything lands in
 * the untaxed TFSA).
 */
const UNLIMITED_ACCOUNTS: AccountConfig = {
  tfsaBalance: 0,
  rrspBalance: 0,
  fhsaBalance: 0,
  taxableBalance: 0,
  tfsaRoom: 1e12,
  rrspRoom: 0,
  fhsaRoom: 0,
  fhsaOpeningYear: 2026,
  annualIncome: 0,
  rrspAnnualNewRoom: 0,
  priority: "tfsa-first",
  taxableTaxRatePct: 25,
  startYear: 2026,
};

/** Default test shape: $10k already sitting in the TFSA. */
const investmentConfig = (
  overrides: Partial<InvestmentConfig> = {}
): InvestmentConfig => ({
  contributionAmount: 0,
  contributionFrequency: "monthly",
  annualReturnPct: 7,
  merPct: 0,
  years: 10,
  inflationPct: 0,
  accounts: { ...UNLIMITED_ACCOUNTS, tfsaBalance: 10000 },
  ...overrides,
});

const mortgageConfig = (
  overrides: Partial<MortgageConfig> = {}
): MortgageConfig => ({
  homePrice: 125000,
  downPaymentMode: "amount",
  downPaymentValue: 25000,
  annualRatePct: 6,
  amortizationYears: 25,
  termYears: 5,
  paymentFrequency: "monthly",
  ...overrides,
});

describe("rate helpers", () => {
  it("effectivePeriodicRate compounds back to the annual rate", () => {
    const monthly = effectivePeriodicRate(7, 12);
    expect(Math.pow(1 + monthly, 12)).toBeCloseTo(1.07, 10);
  });

  it("mortgagePeriodicRate converts semi-annual to per-payment", () => {
    // Canadian standard: 6% quoted → (1.03)^(2/12) − 1 monthly
    expect(mortgagePeriodicRate(6, 12)).toBeCloseTo(
      Math.pow(1.03, 1 / 6) - 1,
      12
    );
  });

  it("toPresentValue discounts by inflation", () => {
    expect(toPresentValue(100, 2, 10)).toBeCloseTo(100 / Math.pow(1.02, 10), 8);
  });
});

describe("rrspNewRoomFromIncome", () => {
  it("is 18% of income below the cap, clamped at the CRA limit", () => {
    expect(rrspNewRoomFromIncome(100000)).toBe(18000);
    expect(rrspNewRoomFromIncome(50000)).toBe(9000);
    expect(rrspNewRoomFromIncome(300000)).toBe(RRSP_DOLLAR_LIMIT);
    // 18% crosses the cap at $187,833
    expect(rrspNewRoomFromIncome(187833)).toBe(33810);
    expect(rrspNewRoomFromIncome(0)).toBe(0);
  });
});

describe("cmhcPremiumRate", () => {
  it("matches the CMHC LTV tiers", () => {
    expect(cmhcPremiumRate(5)).toBe(0.04);
    expect(cmhcPremiumRate(9.99)).toBe(0.04);
    expect(cmhcPremiumRate(10)).toBe(0.031);
    expect(cmhcPremiumRate(14.99)).toBe(0.031);
    expect(cmhcPremiumRate(15)).toBe(0.028);
    expect(cmhcPremiumRate(19.99)).toBe(0.028);
    expect(cmhcPremiumRate(20)).toBe(0);
    expect(cmhcPremiumRate(50)).toBe(0);
  });
});

describe("runInvestmentProjection — compounding anchors", () => {
  it("matches closed-form compound growth for a lump sum", () => {
    const result = runInvestmentProjection(investmentConfig());
    expect(result.futureValue).toBeCloseTo(10000 * Math.pow(1.07, 10), 6);
  });

  it("is frequency-invariant for a lump sum", () => {
    const monthly = runInvestmentProjection(investmentConfig());
    const weekly = runInvestmentProjection(
      investmentConfig({ contributionFrequency: "weekly" })
    );
    expect(weekly.futureValue).toBeCloseTo(monthly.futureValue, 6);
  });

  it("sums contributions exactly at 0% return", () => {
    const result = runInvestmentProjection(
      investmentConfig({
        contributionAmount: 100,
        annualReturnPct: 0,
        accounts: UNLIMITED_ACCOUNTS,
      })
    );
    expect(result.futureValue).toBeCloseTo(100 * 12 * 10, 6);
    expect(result.totalGrowth).toBeCloseTo(0, 6);
  });

  it("treats MER as a straight reduction of the annual return", () => {
    const withMer = runInvestmentProjection(
      investmentConfig({ annualReturnPct: 7, merPct: 2 })
    );
    const netEquivalent = runInvestmentProjection(
      investmentConfig({ annualReturnPct: 5, merPct: 0 })
    );
    expect(withMer.futureValue).toBeCloseTo(netEquivalent.futureValue, 6);
  });

  it("reports the fee cost as the delta vs a fee-free run", () => {
    const gross = runInvestmentProjection(
      investmentConfig({ annualReturnPct: 7, merPct: 0 })
    );
    const withMer = runInvestmentProjection(
      investmentConfig({ annualReturnPct: 7, merPct: 2 })
    );
    expect(withMer.totalFees).toBeCloseTo(
      gross.futureValue - withMer.futureValue,
      6
    );
  });

  it("real value cancels growth when inflation equals the return", () => {
    const result = runInvestmentProjection(
      investmentConfig({ annualReturnPct: 7, inflationPct: 7 })
    );
    expect(result.futureValueReal).toBeCloseTo(10000, 4);
  });
});

describe("runInvestmentProjection — account filling", () => {
  it("places starting balances WITHOUT consuming contribution room", () => {
    // $11k already in the TFSA (10k contributed + 1k growth) with $7k
    // room remaining: the balance must not eat the room — a year of new
    // contributions still fits $7k into the TFSA.
    const result = runInvestmentProjection(
      investmentConfig({
        contributionAmount: 1000,
        annualReturnPct: 0,
        years: 1,
        accounts: {
          ...UNLIMITED_ACCOUNTS,
          tfsaBalance: 11000,
          tfsaRoom: 7000,
        },
      })
    );
    expect(result.timeline[0].tfsaBalance).toBe(11000);
    const end = result.timeline[12];
    expect(end.tfsaBalance).toBeCloseTo(11000 + 7000, 6);
    expect(end.taxableBalance).toBeCloseTo(5000, 6);
  });

  it("routes contributions through TFSA → RRSP → taxable", () => {
    const result = runInvestmentProjection(
      investmentConfig({
        contributionAmount: 1000,
        annualReturnPct: 0,
        years: 1,
        accounts: {
          ...UNLIMITED_ACCOUNTS,
          tfsaRoom: 7000,
          rrspRoom: 2000,
        },
      })
    );
    const end = result.timeline[12];
    expect(end.tfsaBalance).toBeCloseTo(7000, 6);
    expect(end.rrspBalance).toBeCloseTo(2000, 6);
    expect(end.taxableBalance).toBeCloseTo(3000, 6);
  });

  it("respects the RRSP-first priority", () => {
    const result = runInvestmentProjection(
      investmentConfig({
        contributionAmount: 500,
        annualReturnPct: 0,
        years: 1,
        accounts: {
          ...UNLIMITED_ACCOUNTS,
          tfsaRoom: 7000,
          rrspRoom: 2000,
          priority: "rrsp-first",
        },
      })
    );
    const end = result.timeline[12];
    expect(end.rrspBalance).toBeCloseTo(2000, 6);
    expect(end.tfsaBalance).toBeCloseTo(4000, 6);
    expect(end.taxableBalance).toBeCloseTo(0, 6);
  });

  it("grants new TFSA room at each anniversary", () => {
    // $1,000/mo at 0% return, 0% inflation, TFSA room $7,000 today.
    // Year 1: 7,000 → TFSA, 5,000 → taxable. Anniversary grants the
    // 2027 limit ($7,000 at 0% inflation). Year 2: another 7,000 →
    // TFSA, 5,000 → taxable.
    const result = runInvestmentProjection(
      investmentConfig({
        contributionAmount: 1000,
        annualReturnPct: 0,
        years: 2,
        accounts: { ...UNLIMITED_ACCOUNTS, tfsaRoom: 7000 },
      })
    );
    const end = result.timeline[24];
    expect(end.tfsaBalance).toBeCloseTo(14000, 6);
    expect(end.taxableBalance).toBeCloseTo(10000, 6);
  });

  it("applies the tax drag to the taxable account only", () => {
    // Balance sits in the taxable account: 8% at 25% tax drag grows
    // like 6%.
    const result = runInvestmentProjection(
      investmentConfig({
        annualReturnPct: 8,
        accounts: {
          ...UNLIMITED_ACCOUNTS,
          taxableBalance: 10000,
          tfsaRoom: 0,
          taxableTaxRatePct: 25,
        },
      })
    );
    expect(result.futureValue).toBeCloseTo(10000 * Math.pow(1.06, 10), 4);
  });
});

describe("runMortgageProjection", () => {
  it("matches the classic Canadian benchmark payment", () => {
    // $100k at 6% (semi-annual), 25-year amortization, monthly → $639.81
    const result = runMortgageProjection(mortgageConfig());
    expect(result.loanAmount).toBe(100000);
    expect(result.cmhcPremium).toBe(0);
    expect(result.paymentAmount).toBeCloseTo(639.81, 1);
  });

  it("amortizes to exactly zero over the full term", () => {
    const result = runMortgageProjection(mortgageConfig());
    expect(result.payoffMonths).toBe(300);
    expect(result.schedule[result.schedule.length - 1].balance).toBeCloseTo(
      0,
      6
    );
  });

  it("conserves money: payments = principal + interest", () => {
    const result = runMortgageProjection(mortgageConfig());
    const totalPaid = result.schedule.reduce(
      (sum, row) => sum + row.principalPaid + row.interestPaid,
      0
    );
    expect(totalPaid).toBeCloseTo(result.loanAmount + result.totalInterest, 4);
  });

  it("accelerated bi-weekly pays off early; regular bi-weekly does not", () => {
    const accelerated = runMortgageProjection(
      mortgageConfig({ paymentFrequency: "biweekly-accelerated" })
    );
    const regular = runMortgageProjection(
      mortgageConfig({ paymentFrequency: "biweekly" })
    );
    expect(accelerated.payoffMonths).toBeLessThan(280); // years shaved off
    expect(regular.payoffMonths).toBeCloseTo(300, 0);
    expect(accelerated.totalInterest).toBeLessThan(regular.totalInterest);
  });

  it("adds the CMHC premium to principal below 20% down", () => {
    const result = runMortgageProjection(
      mortgageConfig({
        homePrice: 500000,
        downPaymentMode: "percent",
        downPaymentValue: 10,
      })
    );
    // base loan 450k × 3.1% tier
    expect(result.cmhcPremium).toBeCloseTo(13950, 6);
    expect(result.loanAmount).toBeCloseTo(463950, 6);
  });

  it("respects a CMHC override, and ignores it at ≥20% down", () => {
    const overridden = runMortgageProjection(
      mortgageConfig({
        homePrice: 500000,
        downPaymentMode: "percent",
        downPaymentValue: 10,
        cmhcPremiumOverride: 0,
      })
    );
    expect(overridden.cmhcPremium).toBe(0);
    expect(overridden.loanAmount).toBe(450000);

    const atTwenty = runMortgageProjection(
      mortgageConfig({ cmhcPremiumOverride: 9999 })
    );
    expect(atTwenty.cmhcPremium).toBe(0);
  });

  it("reports term renewal balances at each term boundary", () => {
    const result = runMortgageProjection(mortgageConfig());
    expect(result.termRenewals.map((t) => t.year)).toEqual([5, 10, 15, 20]);
    const balances = result.termRenewals.map((t) => t.balance);
    expect([...balances].sort((a, b) => b - a)).toEqual(balances);
    expect(balances[0]).toBeLessThan(100000);
  });

  it("resolveDownPayment converts between $ and %", () => {
    expect(
      resolveDownPayment(
        mortgageConfig({ downPaymentMode: "amount", downPaymentValue: 25000 })
      )
    ).toEqual({ dollars: 25000, percent: 20 });
    expect(
      resolveDownPayment(
        mortgageConfig({ downPaymentMode: "percent", downPaymentValue: 20 })
      ).dollars
    ).toBe(25000);
  });
});

describe("runCombinedProjection — rent vs buy", () => {
  const run = (
    settings: Partial<
      Omit<CombinedConfig, "investment" | "mortgage">
    > = {},
    investmentOverrides: Partial<InvestmentConfig> = {},
    mortgageOverrides: Partial<MortgageConfig> = {}
  ) => {
    const config: CombinedConfig = {
      investment: investmentConfig({
        years: 25,
        contributionAmount: 500,
        ...investmentOverrides,
      }),
      mortgage: mortgageConfig(mortgageOverrides),
      homeAppreciationPct: 0,
      overflowDestination: "taxable",
      monthlyRent: 2500,
      rentGrowthPct: 0,
      ownershipCostPct: 0,
      purchaseYears: 0,
      downPaymentGift: 0,
      downPaymentFromFhsa: 0,
      downPaymentFromTfsa: 0,
      downPaymentFromRrsp: 0,
      downPaymentFromTaxable: 0,
      ...settings,
    };
    return runCombinedProjection(
      config,
      runInvestmentProjection(config.investment),
      runMortgageProjection(config.mortgage)
    );
  };

  it("shares one budget: rent + monthly-ized contribution", () => {
    expect(run().monthlyBudget).toBe(3000);
    // bi-weekly $500 → 500 × 26 / 12 monthly
    expect(
      run({}, { contributionFrequency: "biweekly" }).monthlyBudget
    ).toBeCloseTo(2500 + (500 * 26) / 12, 8);
  });

  it("starts both universes at the same net worth (no CMHC)", () => {
    // Buyer: initial + (home − loan) = initial + down.
    // Renter: initial + down-payment cash invested.
    const start = run().timeline[0];
    expect(start.netWorth).toBeCloseTo(10000 + 25000, 6);
    expect(start.rentNetWorth).toBeCloseTo(10000 + 25000, 6);
  });

  it("holds home value flat at 0% appreciation", () => {
    const result = run();
    const last = result.timeline[result.timeline.length - 1];
    expect(last.homeValue).toBeCloseTo(125000, 6);
    expect(last.mortgageBalance).toBeCloseTo(0, 2);
    expect(last.homeEquity).toBeCloseTo(125000, 2);
  });

  it("compounds home value at the appreciation rate", () => {
    const result = run({ homeAppreciationPct: 3 });
    const last = result.timeline[result.timeline.length - 1];
    expect(last.homeValue).toBeCloseTo(125000 * Math.pow(1.03, 25), 4);
  });

  it("free rent + ownership costs → renting stays ahead", () => {
    const result = run({ monthlyRent: 0, ownershipCostPct: 1.5 });
    const last = result.timeline[result.timeline.length - 1];
    expect(result.breakevenMonth).toBeNull();
    expect(last.rentNetWorth).toBeGreaterThan(last.netWorth);
  });

  it("exorbitant rent → buying pulls ahead early", () => {
    const result = run({ monthlyRent: 10000 });
    const last = result.timeline[result.timeline.length - 1];
    expect(result.breakevenMonth).not.toBeNull();
    expect(result.breakevenMonth as number).toBeLessThanOrEqual(12);
    expect(last.netWorth).toBeGreaterThan(last.rentNetWorth);
  });

  it("overflow to mortgage principal pays the mortgage off faster", () => {
    const noRoom: AccountConfig = {
      ...UNLIMITED_ACCOUNTS,
      tfsaRoom: 0,
      taxableTaxRatePct: 0,
    };
    const payoffMonth = (result: ReturnType<typeof run>) =>
      result.timeline.find((p) => p.mortgageBalance <= 0.005)?.month ??
      Infinity;
    const toMortgage = run(
      { overflowDestination: "mortgage" },
      { accounts: noRoom }
    );
    const toTaxable = run(
      { overflowDestination: "taxable" },
      { accounts: noRoom }
    );
    expect(payoffMonth(toMortgage)).toBeLessThan(payoffMonth(toTaxable));
  });

  it("flags a buyer budget shortfall when payments exceed the budget", () => {
    const result = run({ monthlyRent: 100 }, { contributionAmount: 0 });
    expect(result.buyShortfallMonth).toBe(1);
    expect(result.rentShortfallMonth).toBeNull();
  });

  it("funding the down payment from investments keeps t0 fair", () => {
    // Buyer pulls $20k of the $25k down payment from their TFSA; the
    // renter keeps that $20k invested and only invests the $5k cash.
    // Both universes must still start at the same net worth.
    const result = run(
      { downPaymentFromTfsa: 20000 },
      { accounts: { ...UNLIMITED_ACCOUNTS, tfsaBalance: 30000 } }
    );
    expect(result.downPaymentFunding).toEqual({
      gift: 0,
      fhsa: 0,
      tfsa: 20000,
      rrsp: 0,
      taxable: 0,
      cash: 5000,
    });
    const start = result.timeline[0];
    // buyer: 30k − 20k investments + 25k equity = 35k; renter: 30k + 5k cash
    expect(start.netWorth).toBeCloseTo(35000, 6);
    expect(start.rentNetWorth).toBeCloseTo(35000, 6);
    expect(start.investmentsTotal).toBeCloseTo(10000, 6);
  });

  it("a gift funds the buyer only — the renter never sees it", () => {
    const result = run({ downPaymentGift: 10000 });
    expect(result.downPaymentFunding.gift).toBe(10000);
    expect(result.downPaymentFunding.cash).toBe(15000);
    // Buyer's net worth leads by exactly the gift at purchase.
    const start = result.timeline[0];
    expect(start.netWorth - start.rentNetWorth).toBeCloseTo(10000, 6);
  });

  it("clamps the gift to the down payment and applies it before accounts", () => {
    const result = run(
      { downPaymentGift: 999999, downPaymentFromTfsa: 999999 },
      { accounts: { ...UNLIMITED_ACCOUNTS, tfsaBalance: 50000 } }
    );
    expect(result.downPaymentFunding.gift).toBe(25000);
    expect(result.downPaymentFunding.tfsa).toBe(0);
    expect(result.downPaymentFunding.cash).toBe(0);
  });

  it("extends the timeline by the saving-up phase", () => {
    const result = run({ purchaseYears: 3 });
    // 25-year horizon of ownership analysis + 3 years of waiting
    expect(result.timeline.length).toBe((25 + 3) * 12 + 1);
  });

  it("delayed purchase: both universes rent identically until buying", () => {
    const result = run({ purchaseYears: 3 });
    expect(result.purchaseMonth).toBe(36);
    const before = result.timeline[35];
    expect(before.mortgageBalance).toBe(0);
    expect(before.homeEquity).toBe(0);
    expect(before.netWorth).toBeCloseTo(before.rentNetWorth, 6);
    // At purchase (20% down, no CMHC) the conversion is net-worth
    // neutral — the universes diverge only from the cash flows after.
    const at = result.timeline[36];
    expect(at.mortgageBalance).toBeGreaterThan(0);
    expect(at.homeEquity).toBeCloseTo(25000, 4);
    expect(at.netWorth).toBeCloseTo(at.rentNetWorth, 4);
  });

  it("delayed purchase pays the THEN-price for the house", () => {
    const result = run(
      { purchaseYears: 5, homeAppreciationPct: 3 },
      {},
      { downPaymentMode: "percent", downPaymentValue: 20 }
    );
    const at = result.timeline[60];
    const priceThen = 125000 * Math.pow(1.03, 5);
    // Percent-mode down payment scales to 20% of the appreciated price
    expect(at.homeEquity).toBeCloseTo(0.2 * priceThen, 2);
    expect(at.mortgageBalance).toBeCloseTo(0.8 * priceThen, 2);
  });

  it("saves into the FHSA while waiting, then uses it at purchase", () => {
    // $1,000/mo surplus flows FHSA-first at $8k/yr; after 3 years of
    // saving the buyer pulls the accumulated $24k for the down payment.
    const result = run(
      { purchaseYears: 3, downPaymentFromFhsa: 40000 },
      {
        annualReturnPct: 0,
        contributionAmount: 1000,
        accounts: { ...UNLIMITED_ACCOUNTS, fhsaRoom: 40000 },
      }
    );
    expect(result.downPaymentFunding.fhsa).toBeCloseTo(24000, 6);
    expect(result.downPaymentFunding.cash).toBeCloseTo(1000, 6);
  });

  it("FHSA opening mid-wait: saves from eligibility, funds at purchase", () => {
    // Not a first-time buyer until 2028 (start 2026), buying in 2030:
    // the FHSA fills only during 2028–2029 → 2 years × $8k available.
    const result = run(
      { purchaseYears: 4, downPaymentFromFhsa: 40000 },
      {
        annualReturnPct: 0,
        contributionAmount: 1000,
        accounts: {
          ...UNLIMITED_ACCOUNTS,
          fhsaRoom: 40000,
          fhsaOpeningYear: 2028,
        },
      }
    );
    expect(result.downPaymentFunding.fhsa).toBeCloseTo(16000, 6);
  });

  it("can't fund the down payment from an FHSA that isn't open yet", () => {
    const result = run(
      { downPaymentFromFhsa: 10000 },
      {
        accounts: {
          ...UNLIMITED_ACCOUNTS,
          fhsaBalance: 10000,
          fhsaOpeningYear: 2028, // startYear is 2026 — not eligible yet
        },
      }
    );
    expect(result.downPaymentFunding.fhsa).toBe(0);
    expect(result.downPaymentFunding.cash).toBe(25000);
    // Fairness invariant holds: both universes start equal.
    const start = result.timeline[0];
    expect(start.netWorth).toBeCloseTo(start.rentNetWorth, 6);
  });

  it("clamps HBP withdrawals to $60k and requests to balances", () => {
    const result = run(
      { downPaymentFromRrsp: 80000, downPaymentFromFhsa: 5000 },
      {
        accounts: {
          ...UNLIMITED_ACCOUNTS,
          rrspBalance: 100000,
          fhsaBalance: 2000,
        },
      }
    );
    expect(result.downPaymentFunding.fhsa).toBe(2000); // balance-limited
    // HBP capped at 60k, but the down payment only needs 25k − 2k = 23k
    expect(result.downPaymentFunding.rrsp).toBe(23000);
    expect(result.downPaymentFunding.cash).toBe(0);

    // With a bigger down payment the $60k cap itself binds.
    const bigDown = run(
      { downPaymentFromRrsp: 80000 },
      { accounts: { ...UNLIMITED_ACCOUNTS, rrspBalance: 100000 } },
      { downPaymentValue: 90000 }
    );
    expect(bigDown.downPaymentFunding.rrsp).toBe(60000);
    expect(bigDown.downPaymentFunding.cash).toBe(30000);
  });

  it("rising rent eventually outgrows a fixed budget", () => {
    // inflation 0 → budget stays fixed; rent grows 5%/yr
    const result = run({ monthlyRent: 2900, rentGrowthPct: 5 });
    expect(result.rentShortfallMonth).not.toBeNull();
  });

  it("grows the budget with inflation (salary keeps pace)", () => {
    // Same scenario, 0% return so balances are pure cash flow sums.
    // With inflation the budget steps up annually, so the renter
    // invests more over time than with a flat budget.
    const flat = run(
      { monthlyRent: 1000, rentGrowthPct: 0 },
      { annualReturnPct: 0, inflationPct: 0 }
    );
    const growing = run(
      { monthlyRent: 1000, rentGrowthPct: 0 },
      { annualReturnPct: 0, inflationPct: 5 }
    );
    const last = (r: typeof flat) => r.timeline[r.timeline.length - 1];
    expect(last(growing).rentNetWorth).toBeGreaterThan(
      last(flat).rentNetWorth
    );
  });
});
