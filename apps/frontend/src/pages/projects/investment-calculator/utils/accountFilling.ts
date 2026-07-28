/**
 * TFSA/RRSP/FHSA/taxable contribution routing with room tracking — the
 * pure allocator behind investment and combined modes.
 *
 * Room model: the user's entered room is what's available today. New
 * room lands at each 12-month anniversary k (approximating January 1),
 * using the projected TFSA limit for calendar year `startYear + k` and
 * the user's flat RRSP annual-new-room estimate. The FHSA is a
 * lifetime pool (user-entered remaining room, max $40k) drawn at up to
 * $8,000/yr. Unused room carries forward. Contributions consume room;
 * growth does not (real rules).
 *
 * Fill order: FHSA first (deductible in AND tax-free out for a first
 * home — it dominates), then TFSA/RRSP per the user's priority, then
 * overflow (caller decides its destination).
 */

import { AccountConfig } from "../types";
import { projectTfsaLimits } from "./tfsaLimits";

/** FHSA annual contribution cap. */
export const FHSA_ANNUAL_CAP = 8000;
/** FHSA lifetime contribution cap. */
export const FHSA_LIFETIME_CAP = 40000;
/** Home Buyers' Plan maximum RRSP withdrawal. */
export const HBP_MAX_WITHDRAWAL = 60000;
/** HBP repayment period in years (starting the 2nd year after withdrawal). */
export const HBP_REPAYMENT_YEARS = 15;

/** How one contribution split across destinations. */
export interface ContributionSplit {
  fhsa: number;
  tfsa: number;
  rrsp: number;
  /** Amount that didn't fit in any registered account. */
  overflow: number;
}

export type WithdrawableAccount = "fhsa" | "tfsa" | "rrsp" | "taxable";

export interface AccountPortfolio {
  /** One period of growth on all balances. */
  grow(): void;
  /** Grant the January-1 room for projection year k (k ≥ 1). */
  grantAnnualRoom(yearIndex: number): void;
  /**
   * Route a contribution through FHSA → TFSA/RRSP room (per priority).
   * Overflow is NOT deposited — the caller decides its destination
   * (taxable account, or extra mortgage principal in combined mode).
   */
  contribute(amount: number): ContributionSplit;
  /** Deposit into the taxable account. */
  depositTaxable(amount: number): void;
  /** Take up to `amount` from an account; returns what was taken. */
  withdraw(account: WithdrawableAccount, amount: number): number;
  /** Re-credit TFSA room (withdrawals return room the next January). */
  addTfsaRoom(amount: number): void;
  /** HBP repayment: deposit into the RRSP without consuming room. */
  repayRrsp(amount: number): void;
  /**
   * Close the FHSA (required after buying a first home): the remaining
   * balance transfers tax-free into the RRSP (no room needed — real
   * rule), and no further FHSA contributions are possible.
   */
  closeFhsa(): void;
  readonly fhsa: number;
  readonly tfsa: number;
  readonly rrsp: number;
  readonly taxable: number;
  readonly total: number;
}

export const createAccountPortfolio = (options: {
  accounts: AccountConfig;
  /** Effective per-period growth rate inside TFSA/RRSP/FHSA. */
  registeredRate: number;
  /** Effective per-period growth rate in the taxable account (tax drag applied). */
  taxableRate: number;
  /** Inflation (%) for projecting future TFSA limits. */
  inflationPct: number;
  /** Projection horizon in years (bounds the limit table). */
  horizonYears: number;
}): AccountPortfolio => {
  const { accounts, registeredRate, taxableRate } = options;
  const tfsaLimits = projectTfsaLimits(
    accounts.startYear + 1,
    accounts.startYear + Math.ceil(options.horizonYears) + 1,
    options.inflationPct
  );

  // Starting balances go straight in — money already inside an account
  // consumed its room when originally contributed, so the user's entered
  // room stays fully available for new contributions. An FHSA that
  // hasn't been opened yet can't hold a balance.
  const fhsaOpenAtStart = accounts.fhsaOpeningYear <= accounts.startYear;
  let fhsa = fhsaOpenAtStart ? accounts.fhsaBalance : 0;
  let tfsa = accounts.tfsaBalance;
  let rrsp = accounts.rrspBalance;
  let taxable = accounts.taxableBalance;
  let tfsaRoom = accounts.tfsaRoom;
  let rrspRoom = accounts.rrspRoom;
  let fhsaLifetimeRoom = Math.min(accounts.fhsaRoom, FHSA_LIFETIME_CAP);
  let fhsaContributedThisYear = 0;
  let fhsaClosed = false;
  let currentYear = accounts.startYear;

  return {
    grow() {
      fhsa *= 1 + registeredRate;
      tfsa *= 1 + registeredRate;
      rrsp *= 1 + registeredRate;
      taxable *= 1 + taxableRate;
    },
    grantAnnualRoom(yearIndex: number) {
      currentYear = accounts.startYear + yearIndex;
      tfsaRoom += tfsaLimits.get(currentYear) ?? 0;
      rrspRoom += accounts.rrspAnnualNewRoom;
      fhsaContributedThisYear = 0;
    },
    contribute(amount: number): ContributionSplit {
      const split: ContributionSplit = { fhsa: 0, tfsa: 0, rrsp: 0, overflow: 0 };
      let remaining = amount;

      const fhsaOpen = !fhsaClosed && currentYear >= accounts.fhsaOpeningYear;
      if (fhsaOpen && remaining > 0) {
        const take = Math.min(
          remaining,
          fhsaLifetimeRoom,
          FHSA_ANNUAL_CAP - fhsaContributedThisYear
        );
        if (take > 0) {
          fhsa += take;
          fhsaLifetimeRoom -= take;
          fhsaContributedThisYear += take;
          split.fhsa = take;
          remaining -= take;
        }
      }

      const order =
        accounts.priority === "tfsa-first"
          ? (["tfsa", "rrsp"] as const)
          : (["rrsp", "tfsa"] as const);
      for (const account of order) {
        if (remaining <= 0) break;
        if (account === "tfsa") {
          const take = Math.min(remaining, tfsaRoom);
          tfsa += take;
          tfsaRoom -= take;
          split.tfsa += take;
          remaining -= take;
        } else {
          const take = Math.min(remaining, rrspRoom);
          rrsp += take;
          rrspRoom -= take;
          split.rrsp += take;
          remaining -= take;
        }
      }
      split.overflow = remaining;
      return split;
    },
    depositTaxable(amount: number) {
      taxable += amount;
    },
    withdraw(account: WithdrawableAccount, amount: number): number {
      if (account === "fhsa") {
        const take = Math.min(amount, fhsa);
        fhsa -= take;
        return take;
      }
      if (account === "tfsa") {
        const take = Math.min(amount, tfsa);
        tfsa -= take;
        return take;
      }
      if (account === "rrsp") {
        const take = Math.min(amount, rrsp);
        rrsp -= take;
        return take;
      }
      const take = Math.min(amount, taxable);
      taxable -= take;
      return take;
    },
    addTfsaRoom(amount: number) {
      tfsaRoom += amount;
    },
    repayRrsp(amount: number) {
      rrsp += amount;
    },
    closeFhsa() {
      rrsp += fhsa;
      fhsa = 0;
      fhsaLifetimeRoom = 0;
      fhsaClosed = true;
    },
    get fhsa() {
      return fhsa;
    },
    get tfsa() {
      return tfsa;
    },
    get rrsp() {
      return rrsp;
    },
    get taxable() {
      return taxable;
    },
    get total() {
      return fhsa + tfsa + rrsp + taxable;
    },
  };
};
