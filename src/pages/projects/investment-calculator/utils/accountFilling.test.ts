import { describe, expect, it } from "vitest";
import { AccountConfig } from "../types";
import { createAccountPortfolio } from "./accountFilling";

const accounts = (overrides: Partial<AccountConfig> = {}): AccountConfig => ({
  tfsaBalance: 0,
  rrspBalance: 0,
  fhsaBalance: 0,
  taxableBalance: 0,
  tfsaRoom: 0,
  rrspRoom: 0,
  fhsaRoom: 0,
  fhsaOpeningYear: 2026,
  annualIncome: 0,
  rrspAnnualNewRoom: 0,
  priority: "tfsa-first",
  taxableTaxRatePct: 0,
  startYear: 2026,
  ...overrides,
});

const portfolio = (overrides: Partial<AccountConfig> = {}) =>
  createAccountPortfolio({
    accounts: accounts(overrides),
    registeredRate: 0,
    taxableRate: 0,
    inflationPct: 0,
    horizonYears: 30,
  });

describe("createAccountPortfolio", () => {
  it("fills FHSA first, capped at $8k/yr, then TFSA, then RRSP", () => {
    const p = portfolio({ fhsaRoom: 40000, tfsaRoom: 5000, rrspRoom: 3000 });
    const split = p.contribute(20000);
    expect(split.fhsa).toBe(8000); // annual cap, not room
    expect(split.tfsa).toBe(5000);
    expect(split.rrsp).toBe(3000);
    expect(split.overflow).toBe(4000);
  });

  it("resets the FHSA annual cap each year but drains the lifetime pool", () => {
    const p = portfolio({ fhsaRoom: 10000 });
    expect(p.contribute(8000).fhsa).toBe(8000);
    expect(p.contribute(1000).fhsa).toBe(0); // annual cap hit
    p.grantAnnualRoom(1); // new year
    expect(p.contribute(8000).fhsa).toBe(2000); // lifetime pool exhausted
    expect(p.fhsa).toBe(10000);
  });

  it("blocks FHSA contributions until the opening year", () => {
    // Not a first-time buyer until Jan 1, 2028 — contributions fall
    // through to TFSA until then.
    const p = portfolio({
      fhsaRoom: 40000,
      fhsaOpeningYear: 2028,
      tfsaRoom: 100000,
    });
    expect(p.contribute(8000).fhsa).toBe(0); // 2026
    p.grantAnnualRoom(1); // 2027
    expect(p.contribute(8000).fhsa).toBe(0);
    p.grantAnnualRoom(2); // 2028 — eligible now
    expect(p.contribute(8000).fhsa).toBe(8000);
  });

  it("ignores a balance entered for an unopened FHSA", () => {
    const p = portfolio({ fhsaBalance: 5000, fhsaOpeningYear: 2027 });
    expect(p.fhsa).toBe(0);
  });

  it("withdraw clamps to the balance and reduces it", () => {
    const p = portfolio({ tfsaBalance: 5000 });
    expect(p.withdraw("tfsa", 8000)).toBe(5000);
    expect(p.tfsa).toBe(0);
  });

  it("closeFhsa moves the remainder into the RRSP and blocks contributions", () => {
    const p = portfolio({ fhsaBalance: 12000, fhsaRoom: 40000 });
    p.closeFhsa();
    expect(p.fhsa).toBe(0);
    expect(p.rrsp).toBe(12000);
    expect(p.contribute(1000).fhsa).toBe(0);
  });

  it("repayRrsp deposits without consuming room", () => {
    const p = portfolio({ rrspRoom: 500 });
    p.repayRrsp(2000);
    expect(p.rrsp).toBe(2000);
    // Room untouched: a contribution can still use the full $500.
    expect(p.contribute(1000).rrsp).toBe(500);
  });

  it("addTfsaRoom re-credits withdrawn room", () => {
    const p = portfolio({ tfsaBalance: 30000, tfsaRoom: 0 });
    const taken = p.withdraw("tfsa", 20000);
    expect(p.contribute(5000).tfsa).toBe(0); // no room yet
    p.addTfsaRoom(taken); // next January
    expect(p.contribute(5000).tfsa).toBe(5000);
  });
});
