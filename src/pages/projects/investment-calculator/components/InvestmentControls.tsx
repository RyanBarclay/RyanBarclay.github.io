import { Box, Divider, MenuItem, TextField } from "@mui/material";
import { ContributionFrequency, InvestmentConfig } from "../types";
import { CONTRIBUTION_FREQUENCY_LABELS } from "../utils/labels";
import AccountConfig from "./AccountConfig";
import SliderField from "./SliderField";

interface InvestmentControlsProps {
  config: InvestmentConfig;
  onChange: (config: InvestmentConfig) => void;
}

/** Investment mode inputs. */
const InvestmentControls = ({ config, onChange }: InvestmentControlsProps) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    <SliderField
      label="Contribution per period"
      value={config.contributionAmount}
      onChange={(contributionAmount) =>
        onChange({ ...config, contributionAmount })
      }
      min={0}
      max={5000}
      step={50}
      unit="$"
    />
    <TextField
      select
      label="Contribution frequency"
      value={config.contributionFrequency}
      onChange={(e) =>
        onChange({
          ...config,
          contributionFrequency: e.target.value as ContributionFrequency,
        })
      }
      size="small"
      helperText="Changes contribution timing — annual growth stays the same"
    >
      {Object.entries(CONTRIBUTION_FREQUENCY_LABELS).map(([value, label]) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
    <SliderField
      label="Expected annual return"
      value={config.annualReturnPct}
      onChange={(annualReturnPct) => onChange({ ...config, annualReturnPct })}
      min={0}
      max={15}
      step={0.1}
      unit="%"
      helperText="Long-run average (CAGR) — a smoothed rate, not a volatility model"
    />
    <SliderField
      label="MER / fund fees"
      value={config.merPct}
      onChange={(merPct) => onChange({ ...config, merPct })}
      min={0}
      max={3}
      step={0.01}
      unit="%"
    />
    <SliderField
      label="Time horizon"
      value={config.years}
      onChange={(years) => onChange({ ...config, years })}
      min={1}
      max={40}
      step={1}
      helperText="Years"
    />
    <SliderField
      label="Inflation"
      value={config.inflationPct}
      onChange={(inflationPct) => onChange({ ...config, inflationPct })}
      min={0}
      max={6}
      step={0.1}
      unit="%"
      helperText="Used for today's-dollars view and future TFSA/RRSP room"
    />

    <Divider sx={{ my: 0.5 }} />

    <AccountConfig
      value={config.accounts}
      onChange={(accounts) => onChange({ ...config, accounts })}
    />
  </Box>
);

export default InvestmentControls;
