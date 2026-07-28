import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { AccountConfig as AccountConfigValue, AccountPriority } from "../types";
import {
  RRSP_DOLLAR_LIMIT,
  rrspNewRoomFromIncome,
} from "../utils/calculations";
import { formatCurrency } from "../utils/labels";
import NumberField from "./NumberField";
import SliderField from "./SliderField";

interface AccountConfigProps {
  value: AccountConfigValue;
  onChange: (value: AccountConfigValue) => void;
}

/**
 * TFSA/RRSP/taxable configuration, embedded in Investment and Combined
 * controls. Inputs are fully wired to state; the projection engines
 * consume them in the implementation phase.
 */
const AccountConfig = ({ value, onChange }: AccountConfigProps) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
    <Typography variant="subtitle2">Your Accounts Today</Typography>

    <SliderField
      label="TFSA balance"
      value={value.tfsaBalance}
      onChange={(tfsaBalance) => onChange({ ...value, tfsaBalance })}
      min={0}
      max={300000}
      step={1000}
      unit="$"
      helperText="What's in your TFSA right now — doesn't use up room"
    />
    <SliderField
      label="TFSA room remaining"
      value={value.tfsaRoom}
      onChange={(tfsaRoom) => onChange({ ...value, tfsaRoom })}
      min={0}
      max={150000}
      step={500}
      unit="$"
      helperText="Unused room for NEW contributions — your CRA My Account number, minus anything contributed since"
    />
    <SliderField
      label="RRSP balance"
      value={value.rrspBalance}
      onChange={(rrspBalance) => onChange({ ...value, rrspBalance })}
      min={0}
      max={500000}
      step={1000}
      unit="$"
      helperText="What's in your RRSP right now — doesn't use up room"
    />
    <SliderField
      label="RRSP room remaining"
      value={value.rrspRoom}
      onChange={(rrspRoom) => onChange({ ...value, rrspRoom })}
      min={0}
      max={200000}
      step={500}
      unit="$"
      helperText="Unused deduction room for NEW contributions, not the lifetime total"
    />
    <NumberField
      label="FHSA opening year"
      value={value.fhsaOpeningYear}
      onChange={(fhsaOpeningYear) => onChange({ ...value, fhsaOpeningYear })}
      step={1}
      fullWidth
      helperText="Eligibility lands on a Jan 1 — four full calendar years must pass since you last lived in a home you owned"
    />
    {value.fhsaOpeningYear <= value.startYear ? (
      <SliderField
        label="FHSA balance"
        value={value.fhsaBalance}
        onChange={(fhsaBalance) => onChange({ ...value, fhsaBalance })}
        min={0}
        max={60000}
        step={500}
        unit="$"
        helperText="First Home Savings Account — deductible in, tax-free out for a first home"
      />
    ) : (
      <Typography variant="caption" color="text.secondary">
        FHSA opens in {value.fhsaOpeningYear} — it starts empty, and
        contributions begin flowing that January.
      </Typography>
    )}
    <SliderField
      label="FHSA lifetime room left"
      value={value.fhsaRoom}
      onChange={(fhsaRoom) => onChange({ ...value, fhsaRoom })}
      min={0}
      max={40000}
      step={500}
      unit="$"
      helperText="$40,000 lifetime cap, contributed at up to $8,000/yr — fills first (it beats both TFSA and RRSP)"
    />
    <SliderField
      label="Yearly income"
      value={value.annualIncome}
      onChange={(annualIncome) =>
        onChange({
          ...value,
          annualIncome,
          rrspAnnualNewRoom: rrspNewRoomFromIncome(annualIncome),
        })
      }
      min={0}
      max={300000}
      step={1000}
      unit="$"
      helperText="Optional — auto-fills new RRSP room below (18% of income, CRA-capped)"
    />
    <SliderField
      label="New RRSP room per year"
      value={value.rrspAnnualNewRoom}
      onChange={(rrspAnnualNewRoom) => onChange({ ...value, rrspAnnualNewRoom })}
      min={0}
      max={35000}
      step={500}
      unit="$"
      helperText={`18% of earned income, capped at ${formatCurrency(RRSP_DOLLAR_LIMIT)} (2026) — editable if you know your number`}
    />

    <Box>
      <Typography variant="body2" gutterBottom>
        Fill first
      </Typography>
      <ToggleButtonGroup
        value={value.priority}
        exclusive
        onChange={(_, priority: AccountPriority | null) => {
          if (priority) onChange({ ...value, priority });
        }}
        size="small"
        fullWidth
      >
        <ToggleButton value="tfsa-first">TFSA first</ToggleButton>
        <ToggleButton value="rrsp-first">RRSP first</ToggleButton>
      </ToggleButtonGroup>
    </Box>

    <SliderField
      label="Taxable balance"
      value={value.taxableBalance}
      onChange={(taxableBalance) => onChange({ ...value, taxableBalance })}
      min={0}
      max={500000}
      step={1000}
      unit="$"
      helperText="Existing non-registered investments"
    />
    <SliderField
      label="Tax rate on taxable gains"
      value={value.taxableTaxRatePct}
      onChange={(taxableTaxRatePct) => onChange({ ...value, taxableTaxRatePct })}
      min={0}
      max={54}
      step={0.5}
      unit="%"
      helperText="Effective drag applied once TFSA & RRSP room are full"
    />
  </Box>
);

export default AccountConfig;
