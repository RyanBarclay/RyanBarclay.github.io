import { useMemo } from "react";
import { CombinedConfig, CombinedResult } from "../types";
import { runCombinedProjection } from "../utils/calculations";
import { useInvestmentCalc } from "./useInvestmentCalc";
import { useMortgageCalc } from "./useMortgageCalc";

/**
 * Combined projection: runs both engines and merges their timelines
 * into net worth (investments + home equity − mortgage balance).
 * Overflow routing (taxable vs extra mortgage principal) lands with
 * the account-filling engine — see runCombinedProjection.
 */
export const useCombinedCalc = (config: CombinedConfig): CombinedResult => {
  const investment = useInvestmentCalc(config.investment);
  const mortgage = useMortgageCalc(config.mortgage);
  return useMemo(
    () => runCombinedProjection(config, investment, mortgage),
    [config, investment, mortgage]
  );
};
