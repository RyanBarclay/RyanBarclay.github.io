import { useMemo } from "react";
import { InvestmentConfig, InvestmentResult } from "../types";
import { runInvestmentProjection } from "../utils/calculations";

/**
 * Memoized wrapper over the pure investment projection engine.
 * Account-level filling (TFSA/RRSP/taxable split) lands in the
 * implementation phase — see runInvestmentProjection.
 */
export const useInvestmentCalc = (config: InvestmentConfig): InvestmentResult =>
  useMemo(() => runInvestmentProjection(config), [config]);
