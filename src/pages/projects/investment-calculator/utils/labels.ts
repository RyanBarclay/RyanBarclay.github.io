/** UI copy shared between controls and results. */

import { ContributionFrequency, PaymentFrequency } from "../types";

export const CONTRIBUTION_FREQUENCY_LABELS: Record<
  ContributionFrequency,
  string
> = {
  monthly: "Monthly",
  biweekly: "Bi-weekly",
  weekly: "Weekly",
};

export const PAYMENT_FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  monthly: "Monthly",
  "biweekly-accelerated": "Bi-weekly (accelerated)",
  biweekly: "Bi-weekly",
  "weekly-accelerated": "Weekly (accelerated)",
  weekly: "Weekly",
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);

export const formatCurrencyCompact = (value: number): string =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const formatMonths = (months: number): string => {
  const years = Math.floor(months / 12);
  const rest = Math.round(months % 12);
  if (years === 0) return `${rest} mo`;
  return rest === 0 ? `${years} yrs` : `${years} yrs ${rest} mo`;
};
