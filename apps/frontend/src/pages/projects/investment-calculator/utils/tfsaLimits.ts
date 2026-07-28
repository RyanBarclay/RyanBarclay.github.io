/**
 * TFSA dollar limits — CRA historical table plus inflation-indexed
 * projection.
 *
 * CRA methodology: the limit is indexed to inflation and rounded to the
 * NEAREST $500. To time future bumps correctly, the unrounded indexed
 * value is carried forward internally and only the granted amount is
 * rounded.
 */

/** Published CRA limits, per canada.ca. */
export const TFSA_HISTORICAL_LIMITS: Record<number, number> = {
  2009: 5000,
  2010: 5000,
  2011: 5000,
  2012: 5000,
  2013: 5500,
  2014: 5500,
  2015: 10000,
  2016: 5500,
  2017: 5500,
  2018: 5500,
  2019: 6000,
  2020: 6000,
  2021: 6000,
  2022: 6000,
  2023: 6500,
  2024: 7000,
  2025: 7000,
  2026: 7000,
};

export const TFSA_FIRST_YEAR = 2009;
export const TFSA_LAST_KNOWN_YEAR = 2026;

const roundToNearest500 = (value: number) => Math.round(value / 500) * 500;

/**
 * TFSA dollar limit for each year in [startYear, endYear].
 *
 * Years in the historical table use published values (years before 2009
 * are 0 — the TFSA didn't exist). Later years compound the unrounded
 * amount forward from the $7,000 base by `inflationPct`, rounding each
 * year's granted limit to the nearest $500.
 */
export const projectTfsaLimits = (
  startYear: number,
  endYear: number,
  inflationPct: number
): Map<number, number> => {
  const factor = 1 + inflationPct / 100;
  const projected = new Map<number, number>();
  let unrounded = TFSA_HISTORICAL_LIMITS[TFSA_LAST_KNOWN_YEAR];
  for (let year = TFSA_LAST_KNOWN_YEAR + 1; year <= endYear; year++) {
    unrounded *= factor;
    projected.set(year, roundToNearest500(unrounded));
  }

  const limits = new Map<number, number>();
  for (let year = startYear; year <= endYear; year++) {
    if (year < TFSA_FIRST_YEAR) {
      limits.set(year, 0);
    } else if (year <= TFSA_LAST_KNOWN_YEAR) {
      limits.set(year, TFSA_HISTORICAL_LIMITS[year]);
    } else {
      limits.set(year, projected.get(year) ?? 0);
    }
  }
  return limits;
};
