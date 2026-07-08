/**
 * Default configurations for each calculator mode. These seed the
 * controls on first load; every value is user-editable.
 *
 * Market defaults reflect NORTH VANCOUVER, BC as of mid-2026 (sources
 * in _lore.md): ~$800k condo benchmark vs ~$3,350 two-bedroom rent,
 * BC's 2026 rent-increase cap of 2.3%, ~4.3% conventional 5-year
 * fixed, ~5%/yr long-run appreciation (Metro Van 20-yr CAGR ≈ 5.5%),
 * and ~1.5%/yr ownership costs (~0.32% property tax + strata/
 * maintenance + insurance).
 */

import {
  AccountConfig,
  CombinedSettings,
  InvestmentConfig,
  MortgageConfig,
} from "../types";

export const DEFAULT_INFLATION_PCT = 2;

export const DEFAULT_ACCOUNTS: AccountConfig = {
  tfsaBalance: 10000,
  rrspBalance: 0,
  fhsaBalance: 0,
  taxableBalance: 0,
  tfsaRoom: 7000,
  rrspRoom: 10000,
  fhsaRoom: 40000,
  annualIncome: 0,
  rrspAnnualNewRoom: 10000,
  priority: "tfsa-first",
  taxableTaxRatePct: 25,
  startYear: new Date().getFullYear(),
};

export const DEFAULT_INVESTMENT: InvestmentConfig = {
  contributionAmount: 1500,
  contributionFrequency: "monthly",
  annualReturnPct: 7,
  merPct: 0.25,
  years: 25,
  inflationPct: DEFAULT_INFLATION_PCT,
  accounts: DEFAULT_ACCOUNTS,
};

export const DEFAULT_MORTGAGE: MortgageConfig = {
  // North Vancouver condo benchmark, mid-2026.
  homePrice: 800000,
  downPaymentMode: "percent",
  downPaymentValue: 20,
  // Achievable conventional 5-year fixed, mid-2026.
  annualRatePct: 4.3,
  amortizationYears: 25,
  termYears: 5,
  paymentFrequency: "biweekly-accelerated",
};

export const DEFAULT_COMBINED_SETTINGS: CombinedSettings = {
  // Metro Vancouver 20-yr CAGR ≈ 5.5%/yr; 5% is a mild haircut.
  homeAppreciationPct: 5,
  overflowDestination: "taxable",
  // North Vancouver two-bedroom, mid-2026.
  monthlyRent: 3350,
  // BC's 2026 maximum allowable rent increase.
  rentGrowthPct: 2.3,
  // ~0.32% property tax + strata/maintenance + insurance.
  ownershipCostPct: 1.5,
  downPaymentFromFhsa: 0,
  downPaymentFromTfsa: 0,
  downPaymentFromRrsp: 0,
  downPaymentFromTaxable: 0,
};
