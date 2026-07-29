/**
 * Structured JSON logging shaped for GCP Cloud Logging: one JSON object
 * per line with a `severity` field, which Cloud Run's log agent parses
 * into leveled, filterable entries automatically (and Error Reporting
 * picks up ERROR-severity stack traces for free).
 */

type Severity = "DEBUG" | "INFO" | "WARNING" | "ERROR";

const emit = (
  severity: Severity,
  message: string,
  extra?: Record<string, unknown>
): void => {
  // Cloud Logging reads structured logs from stdout/stderr.
  console.log(JSON.stringify({ severity, message, ...extra }));
};

export const logger = {
  debug: (message: string, extra?: Record<string, unknown>) =>
    emit("DEBUG", message, extra),
  info: (message: string, extra?: Record<string, unknown>) =>
    emit("INFO", message, extra),
  warn: (message: string, extra?: Record<string, unknown>) =>
    emit("WARNING", message, extra),
  error: (message: string, extra?: Record<string, unknown>) =>
    emit("ERROR", message, extra),
};
