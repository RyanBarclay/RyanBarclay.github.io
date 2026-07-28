import { Box, Slider, Typography } from "@mui/material";
import NumberField from "./NumberField";

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** "$" renders a start adornment, "%" an end adornment. */
  unit?: "$" | "%";
  helperText?: string;
}

/**
 * The core input primitive: slider for feel, adjacent text field for
 * precision. The slider is clamped to [min, max] but the text field is
 * not — typed values may exceed the slider range on purpose.
 */
const SliderField = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  helperText,
}: SliderFieldProps) => (
  <Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography variant="body2" sx={{ flex: 1 }}>
        {label}
      </Typography>
      <NumberField
        value={value}
        onChange={onChange}
        unit={unit}
        step={step}
        sx={{ width: 130 }}
      />
    </Box>
    <Slider
      value={Math.min(Math.max(value, min), max)}
      onChange={(_, v) => onChange(v as number)}
      min={min}
      max={max}
      step={step}
      size="small"
    />
    {helperText && (
      <Typography variant="caption" color="text.secondary" display="block">
        {helperText}
      </Typography>
    )}
  </Box>
);

export default SliderField;
