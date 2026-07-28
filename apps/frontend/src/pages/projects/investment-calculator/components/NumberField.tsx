import { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: "$" | "%";
  step?: number;
  fullWidth?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
}

/**
 * Numeric text field that tolerates a transient empty state while
 * typing: the draft string lives locally and only valid numbers are
 * committed upward, so clearing the field doesn't snap back to 0.
 * Blur restores the display to the committed value.
 */
const NumberField = ({
  value,
  onChange,
  label,
  unit,
  step = 1,
  fullWidth,
  helperText,
  sx,
}: NumberFieldProps) => {
  const [draft, setDraft] = useState<string | null>(null);

  // Drop the draft when the value changes from elsewhere (e.g. the
  // slider) so the field never shows stale text.
  useEffect(() => {
    setDraft((d) => (d !== null && Number(d) !== value ? null : d));
  }, [value]);

  return (
    <TextField
      value={draft ?? String(value)}
      onChange={(e) => {
        const text = e.target.value;
        setDraft(text);
        if (text !== "") {
          const parsed = Number(text);
          if (!Number.isNaN(parsed)) onChange(parsed);
        }
      }}
      onBlur={() => setDraft(null)}
      label={label}
      size="small"
      type="number"
      fullWidth={fullWidth}
      helperText={helperText}
      slotProps={{
        htmlInput: { min: 0, step },
        input: {
          startAdornment:
            unit === "$" ? (
              <InputAdornment position="start">$</InputAdornment>
            ) : undefined,
          endAdornment:
            unit === "%" ? (
              <InputAdornment position="end">%</InputAdornment>
            ) : undefined,
        },
      }}
      sx={sx}
    />
  );
};

export default NumberField;
