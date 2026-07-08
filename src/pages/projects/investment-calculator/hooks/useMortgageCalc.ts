import { useMemo } from "react";
import { MortgageConfig, MortgageResult } from "../types";
import { runMortgageProjection } from "../utils/calculations";

/** Memoized wrapper over the pure mortgage amortization engine. */
export const useMortgageCalc = (config: MortgageConfig): MortgageResult =>
  useMemo(() => runMortgageProjection(config), [config]);
