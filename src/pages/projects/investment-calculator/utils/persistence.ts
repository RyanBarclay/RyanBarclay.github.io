/**
 * localStorage persistence for the calculator's inputs.
 *
 * The payload carries a schema version: bump `STORAGE_VERSION` when a
 * config shape changes incompatibly and stale saves are discarded
 * instead of half-loading. New fields added compatibly don't need a
 * bump — `load` deep-merges stored values over the current defaults,
 * so missing fields pick up their default.
 */

import {
  CalculatorMode,
  CombinedSettings,
  InvestmentConfig,
  MortgageConfig,
} from "../types";
import {
  DEFAULT_ACCOUNTS,
  DEFAULT_COMBINED_SETTINGS,
  DEFAULT_INVESTMENT,
  DEFAULT_MORTGAGE,
} from "./defaults";

const STORAGE_KEY = "investment-calculator-state";
// v2: replaced InvestmentConfig.initialAmount with per-account starting
// balances in AccountConfig (balances don't consume room).
const STORAGE_VERSION = 2;

export interface CalculatorState {
  mode: CalculatorMode;
  investment: InvestmentConfig;
  mortgage: MortgageConfig;
  combinedSettings: CombinedSettings;
}

export const DEFAULT_STATE: CalculatorState = {
  mode: "investment",
  investment: DEFAULT_INVESTMENT,
  mortgage: DEFAULT_MORTGAGE,
  combinedSettings: DEFAULT_COMBINED_SETTINGS,
};

export const loadCalculatorState = (): CalculatorState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== STORAGE_VERSION) return DEFAULT_STATE;
    return {
      mode: parsed.mode ?? DEFAULT_STATE.mode,
      investment: {
        ...DEFAULT_INVESTMENT,
        ...parsed.investment,
        accounts: { ...DEFAULT_ACCOUNTS, ...parsed.investment?.accounts },
      },
      mortgage: { ...DEFAULT_MORTGAGE, ...parsed.mortgage },
      combinedSettings: {
        ...DEFAULT_COMBINED_SETTINGS,
        ...parsed.combinedSettings,
      },
    };
  } catch {
    return DEFAULT_STATE;
  }
};

export const saveCalculatorState = (state: CalculatorState): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: STORAGE_VERSION, ...state })
    );
  } catch {
    // Storage full or unavailable (private mode) — persistence is
    // best-effort; the calculator keeps working from memory.
  }
};

export const clearCalculatorState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Same best-effort stance as save.
  }
};
