import {
  Alert,
  Box,
  MenuItem,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DownPaymentMode, MortgageConfig, PaymentFrequency } from "../types";
import { cmhcPremiumRate, resolveDownPayment } from "../utils/calculations";
import { PAYMENT_FREQUENCY_LABELS, formatCurrency } from "../utils/labels";
import NumberField from "./NumberField";
import SliderField from "./SliderField";

interface MortgageControlsProps {
  config: MortgageConfig;
  onChange: (config: MortgageConfig) => void;
}

/** Mortgage mode inputs. */
const MortgageControls = ({ config, onChange }: MortgageControlsProps) => {
  const { dollars: downDollars, percent: downPct } = resolveDownPayment(config);
  const baseLoan = Math.max(0, config.homePrice - downDollars);
  const autoCmhc = downPct >= 20 ? 0 : baseLoan * cmhcPremiumRate(downPct);
  const cmhcValue = config.cmhcPremiumOverride ?? autoCmhc;

  const switchDownPaymentMode = (mode: DownPaymentMode | null) => {
    if (!mode || mode === config.downPaymentMode) return;
    // Convert the value so switching modes keeps the same down payment.
    const converted =
      mode === "percent"
        ? Math.round(downPct * 10) / 10
        : Math.round(downDollars);
    onChange({ ...config, downPaymentMode: mode, downPaymentValue: converted });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <SliderField
        label="Home price"
        value={config.homePrice}
        onChange={(homePrice) => onChange({ ...config, homePrice })}
        min={100000}
        max={3000000}
        step={10000}
        unit="$"
      />

      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0.5,
          }}
        >
          <Typography variant="body2">Down payment</Typography>
          <ToggleButtonGroup
            value={config.downPaymentMode}
            exclusive
            onChange={(_, mode: DownPaymentMode | null) =>
              switchDownPaymentMode(mode)
            }
            size="small"
          >
            <ToggleButton value="amount" sx={{ px: 1.5 }}>
              $
            </ToggleButton>
            <ToggleButton value="percent" sx={{ px: 1.5 }}>
              %
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <SliderField
          label=""
          value={config.downPaymentValue}
          onChange={(downPaymentValue) =>
            onChange({ ...config, downPaymentValue })
          }
          min={config.downPaymentMode === "percent" ? 5 : 0}
          max={
            config.downPaymentMode === "percent" ? 100 : config.homePrice
          }
          step={config.downPaymentMode === "percent" ? 0.5 : 5000}
          unit={config.downPaymentMode === "percent" ? "%" : "$"}
          helperText={
            config.downPaymentMode === "percent"
              ? `${formatCurrency(downDollars)} down`
              : `${downPct.toFixed(1)}% down`
          }
        />
      </Box>

      {downPct < 20 && (
        <Alert severity="info" sx={{ py: 0.5 }}>
          <Typography variant="body2" gutterBottom>
            Below 20% down, CMHC insurance is required and added to the
            mortgage principal.
          </Typography>
          <NumberField
            label="CMHC premium"
            value={Math.round(cmhcValue)}
            onChange={(cmhcPremiumOverride) =>
              onChange({ ...config, cmhcPremiumOverride })
            }
            unit="$"
            fullWidth
            sx={{ mt: 1 }}
            helperText="Auto-calculated from the down-payment tier — edit to override, 0 to disable"
          />
        </Alert>
      )}

      <SliderField
        label="Mortgage rate"
        value={config.annualRatePct}
        onChange={(annualRatePct) => onChange({ ...config, annualRatePct })}
        min={0.5}
        max={10}
        step={0.05}
        unit="%"
        helperText="Semi-annual compounding; assumed constant across renewals"
      />
      <SliderField
        label="Amortization"
        value={config.amortizationYears}
        onChange={(amortizationYears) =>
          onChange({ ...config, amortizationYears })
        }
        min={5}
        max={30}
        step={1}
        helperText="Years"
      />
      <SliderField
        label="Term"
        value={config.termYears}
        onChange={(termYears) => onChange({ ...config, termYears })}
        min={1}
        max={10}
        step={1}
        helperText="Years — balance is reported at each renewal"
      />
      <TextField
        select
        label="Payment frequency"
        value={config.paymentFrequency}
        onChange={(e) =>
          onChange({
            ...config,
            paymentFrequency: e.target.value as PaymentFrequency,
          })
        }
        size="small"
        helperText="Accelerated = monthly payment split, paid more often — pays off early"
      >
        {Object.entries(PAYMENT_FREQUENCY_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default MortgageControls;
