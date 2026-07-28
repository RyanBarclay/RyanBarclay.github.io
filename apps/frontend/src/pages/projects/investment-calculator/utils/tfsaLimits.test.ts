import { describe, expect, it } from "vitest";
import { projectTfsaLimits } from "./tfsaLimits";

describe("projectTfsaLimits", () => {
  it("returns the published CRA limits for historical years", () => {
    const limits = projectTfsaLimits(2009, 2026, 2);
    expect(limits.get(2009)).toBe(5000);
    expect(limits.get(2013)).toBe(5500);
    expect(limits.get(2015)).toBe(10000);
    expect(limits.get(2016)).toBe(5500);
    expect(limits.get(2019)).toBe(6000);
    expect(limits.get(2023)).toBe(6500);
    expect(limits.get(2024)).toBe(7000);
    expect(limits.get(2026)).toBe(7000);
  });

  it("returns 0 before the TFSA existed", () => {
    const limits = projectTfsaLimits(2007, 2010, 2);
    expect(limits.get(2007)).toBe(0);
    expect(limits.get(2008)).toBe(0);
    expect(limits.get(2009)).toBe(5000);
  });

  it("holds at $7,000 forever with 0% inflation", () => {
    const limits = projectTfsaLimits(2027, 2060, 0);
    expect(limits.get(2027)).toBe(7000);
    expect(limits.get(2060)).toBe(7000);
  });

  it("rounds each projected year to the NEAREST $500 (CRA methodology)", () => {
    const limits = projectTfsaLimits(2027, 2028, 2);
    // 2027: 7000 × 1.02 = 7140 → nearest 500 is 7000 (floor would also
    // give 7000, but 2028 distinguishes the two)
    expect(limits.get(2027)).toBe(7000);
    // 2028: 7000 × 1.02² = 7282.80 → nearest 500 is 7500; flooring
    // would incorrectly give 7000
    expect(limits.get(2028)).toBe(7500);
  });

  it("compounds the unrounded value, not the rounded grants", () => {
    const limits = projectTfsaLimits(2040, 2040, 2);
    // 7000 × 1.02^14 = 9236.28 → nearest 500 is 9000. Compounding the
    // rounded values year over year would drift from this.
    expect(limits.get(2040)).toBe(9000);
  });
});
