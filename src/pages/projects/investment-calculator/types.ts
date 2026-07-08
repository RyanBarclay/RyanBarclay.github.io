/**
 * Investment & Mortgage Calculator — type definitions
 *
 * All configuration and result shapes for the three calculator modes.
 * Rates are expressed as percentages (6.5 means 6.5%), never decimals,
 * matching what the user types into the controls. Conversion to decimal
 * happens inside utils/calculations.ts.
 */

// ─── Modes ───────────────────────────────────────────────────────────────

export type CalculatorMode = "investment" | "mortgage" | "combined";

// ─── Frequencies ─────────────────────────────────────────────────────────

/** How often investment contributions are made. */
export type ContributionFrequency = "monthly" | "biweekly" | "weekly";

/**
 * Mortgage payment frequency. Accelerated variants pay the monthly
 * payment ÷ 2 (or ÷ 4) on a 26 (or 52) payment/year schedule — roughly
 * one extra monthly payment per year, shortening the effective
 * amortization. Non-accelerated variants are recalculated to match the
 * amortization exactly.
 */
export type PaymentFrequency =
  | "monthly"
  | "biweekly-accelerated"
  | "biweekly"
  | "weekly-accelerated"
  | "weekly";

// ─── Accounts (TFSA / RRSP / taxable) ────────────────────────────────────

export type AccountPriority = "tfsa-first" | "rrsp-first";

/** Where contributions go once TFSA and RRSP room are both exhausted. */
export type OverflowDestination = "taxable" | "mortgage";

export interface AccountConfig {
  /**
   * What's already inside each account today ($). Existing balances are
   * placed directly — they do NOT consume contribution room, since that
   * room was used when the money originally went in (and growth never
   * consumes room).
   */
  tfsaBalance: number;
  rrspBalance: number;
  fhsaBalance: number;
  taxableBalance: number;
  /** TFSA contribution room available today ($) — net remaining. */
  tfsaRoom: number;
  /** RRSP contribution room available today ($) — net remaining. */
  rrspRoom: number;
  /**
   * FHSA lifetime contribution room left ($, max $40,000). Modeled as a
   * lifetime pool drawn at up to $8,000/yr; the real carry-forward
   * subtlety (max $16k in one year) is deliberately ignored. FHSA fills
   * FIRST — deductible in and tax-free out for a first home, it
   * dominates both TFSA and RRSP.
   */
  fhsaRoom: number;
  /**
   * Yearly earned income ($) — optional UI convenience: editing it
   * auto-fills `rrspAnnualNewRoom` as 18% of income capped at the CRA
   * dollar limit. The engine never reads this field.
   */
  annualIncome: number;
  /**
   * New RRSP room granted each January 1 ($) — auto-filled from
   * `annualIncome` or entered directly.
   */
  rrspAnnualNewRoom: number;
  /** Which registered account fills first. */
  priority: AccountPriority;
  /**
   * Effective tax rate (%) applied as drag on the taxable account's
   * returns once registered room is exhausted.
   */
  taxableTaxRatePct: number;
  /**
   * Calendar year the projection starts in — anchors future room
   * grants: the limit for `startYear + k` is granted at anniversary k.
   */
  startYear: number;
}

// ─── Investment mode ─────────────────────────────────────────────────────

export interface InvestmentConfig {
  /** Contribution per period ($), at `contributionFrequency`. */
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  /** Expected nominal annual return (CAGR, %). */
  annualReturnPct: number;
  /** Management expense ratio (%), subtracted from annual return. */
  merPct: number;
  /** Time horizon in years. */
  years: number;
  /**
   * Annual inflation (%). Dual purpose: present-value display and
   * TFSA/RRSP contribution-limit projection.
   */
  inflationPct: number;
  accounts: AccountConfig;
}

// ─── Mortgage mode ───────────────────────────────────────────────────────

export type DownPaymentMode = "amount" | "percent";

export interface MortgageConfig {
  homePrice: number;
  downPaymentMode: DownPaymentMode;
  /** Dollars when mode is "amount", percentage when mode is "percent". */
  downPaymentValue: number;
  /** Quoted annual rate (%), compounded semi-annually (Canadian standard). */
  annualRatePct: number;
  amortizationYears: number;
  /** Term length in years (Canadian standard: 5). */
  termYears: number;
  paymentFrequency: PaymentFrequency;
  /**
   * CMHC premium override ($). `undefined` = auto-calculate from the LTV
   * tier table when down payment < 20%; 0 disables. Ignored at ≥ 20% down.
   */
  cmhcPremiumOverride?: number;
}

// ─── Combined mode (rent vs buy) ─────────────────────────────────────────

/**
 * Combined mode compares two universes sharing one monthly budget
 * (= rent + monthly-ized investment contribution, stepping up annually
 * with inflation like a salary):
 * - RENT: pay rent (growing at rentGrowthPct), invest the rest; the
 *   down-payment cash stays invested from day one.
 * - BUY: pay the mortgage + ownership costs first, invest the rest;
 *   the down payment goes into the house.
 */
export interface CombinedConfig {
  investment: InvestmentConfig;
  mortgage: MortgageConfig;
  /** Nominal home appreciation (%/yr). Defaults to the inflation rate. */
  homeAppreciationPct: number;
  /** Where buyer contributions go once TFSA & RRSP room are full. */
  overflowDestination: OverflowDestination;
  /** Current monthly rent ($) in the rent scenario. */
  monthlyRent: number;
  /** Annual rent increase (%). Defaults to the inflation rate. */
  rentGrowthPct: number;
  /**
   * Owner-only costs (property tax + maintenance + insurance) as % of
   * current home value per year, paid from the buyer's budget.
   */
  ownershipCostPct: number;
  /**
   * How much of the down payment the buyer pulls from investments at
   * purchase ($ per source). Clamped to balances (and the $60k HBP cap
   * for RRSP); anything not covered is external cash — which the renter
   * invests instead. FHSA closes after purchase (remainder → RRSP);
   * withdrawn TFSA room comes back at the next anniversary; HBP repays
   * 1/15th per year (years 2–16) out of the buyer's budget.
   */
  downPaymentFromFhsa: number;
  downPaymentFromTfsa: number;
  downPaymentFromRrsp: number;
  downPaymentFromTaxable: number;
}

/** The combined-only settings (everything but the shared configs). */
export type CombinedSettings = Omit<CombinedConfig, "investment" | "mortgage">;

// ─── Results ─────────────────────────────────────────────────────────────

/** One point on the investment timeline (one per month). */
export interface InvestmentPoint {
  /** Months since start (0 = today). */
  month: number;
  tfsaBalance: number;
  rrspBalance: number;
  fhsaBalance: number;
  taxableBalance: number;
  totalValue: number;
  totalContributions: number;
  /** Cumulative dollars lost to the MER. */
  cumulativeFees: number;
  /** totalValue discounted to present dollars. */
  realTotalValue: number;
}

export interface InvestmentResult {
  timeline: InvestmentPoint[];
  futureValue: number;
  futureValueReal: number;
  totalContributions: number;
  totalGrowth: number;
  /** What the MER cost over the horizon versus a fee-free run. */
  totalFees: number;
}

/** One row of the amortization schedule (one per payment). */
export interface AmortizationRow {
  paymentNumber: number;
  /** Months since start; fractional for sub-monthly frequencies. */
  month: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

export interface MortgageResult {
  /** Payment per period at the selected frequency. */
  paymentAmount: number;
  /** Principal borrowed, including any CMHC premium. */
  loanAmount: number;
  cmhcPremium: number;
  schedule: AmortizationRow[];
  totalInterest: number;
  /** Balance at the end of each term — the renewal decision points. */
  termRenewals: { year: number; balance: number }[];
  /** Actual months to payoff (< amortization for accelerated schedules). */
  payoffMonths: number;
}

/** One point on the combined timeline (one per month). */
export interface CombinedPoint {
  month: number;
  /** Buyer's investment portfolio. */
  investmentsTotal: number;
  mortgageBalance: number;
  homeValue: number;
  homeEquity: number;
  /** Buy scenario: investments + home value − mortgage balance. */
  netWorth: number;
  realNetWorth: number;
  /** Rent scenario: investments only. */
  rentNetWorth: number;
  realRentNetWorth: number;
}

/** Where the down payment actually came from, after clamping. */
export interface DownPaymentFunding {
  fhsa: number;
  tfsa: number;
  rrsp: number;
  taxable: number;
  /** External cash — the portion the renter invests instead. */
  cash: number;
}

export interface CombinedResult {
  investment: InvestmentResult;
  mortgage: MortgageResult;
  timeline: CombinedPoint[];
  downPaymentFunding: DownPaymentFunding;
  /** Shared monthly budget in today's dollars: rent + monthly-ized contribution. */
  monthlyBudget: number;
  /**
   * First month from which buying stays ahead of renting through the
   * horizon. 0 = ahead the whole time; null = behind at the horizon.
   */
  breakevenMonth: number | null;
  /** First month the buyer's budget can't cover mortgage + ownership costs. */
  buyShortfallMonth: number | null;
  /** First month rent alone exceeds the budget. */
  rentShortfallMonth: number | null;
}

// ─── Chart ───────────────────────────────────────────────────────────────

/** Every line the chart can draw; visibility is user-toggleable. */
export type ChartSeriesKey =
  | "totalValue"
  | "tfsaBalance"
  | "rrspBalance"
  | "fhsaBalance"
  | "taxableBalance"
  | "totalContributions"
  | "mortgageBalance"
  | "homeEquity"
  | "netWorth"
  | "rentNetWorth"
  | "realTotalValue"
  | "realNetWorth"
  | "realRentNetWorth";

export type SeriesVisibility = Record<ChartSeriesKey, boolean>;
