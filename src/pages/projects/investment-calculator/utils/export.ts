/**
 * CSV export — reuses the Blob download pattern from the Randomizer
 * project (`Randomizer/fileUtils.ts`).
 */

/** Serialise timeline rows to CSV text. */
export const toCsv = (
  headers: string[],
  rows: (number | string)[][]
): string => [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

/** Trigger a browser download of CSV content. */
export const downloadCsv = (filename: string, csvContent: string): void => {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// TODO(implementation phase): per-mode adapters that flatten
// InvestmentResult / MortgageResult / CombinedResult timelines into
// (headers, rows) for toCsv.
