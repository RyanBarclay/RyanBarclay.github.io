import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import {
  CombinedSettings,
  InvestmentConfig,
  MortgageConfig,
  OverflowDestination,
} from "../types";
import {
  HBP_MAX_WITHDRAWAL,
  HBP_REPAYMENT_YEARS,
} from "../utils/accountFilling";
import {
  PERIODS_PER_YEAR,
  resolveDownPayment,
  resolveDownPaymentFunding,
} from "../utils/calculations";
import { formatCurrency } from "../utils/labels";
import InvestmentControls from "./InvestmentControls";
import MortgageControls from "./MortgageControls";
import NumberField from "./NumberField";
import SliderField from "./SliderField";

// Outlined, self-contained boxes — without this the two collapsed
// accordions render as flush elevation-paper strips that read as one
// odd block inside the Inputs paper.
const accordionSx = {
  borderRadius: 1,
  overflow: "hidden",
  "&:before": { display: "none" },
} as const;

interface CombinedControlsProps {
  investment: InvestmentConfig;
  onInvestmentChange: (config: InvestmentConfig) => void;
  mortgage: MortgageConfig;
  onMortgageChange: (config: MortgageConfig) => void;
  settings: CombinedSettings;
  onSettingsChange: (settings: CombinedSettings) => void;
}

/**
 * Rent-vs-buy inputs: the shared investment and mortgage configs in
 * collapsible sections (same state as the other tabs — edits carry
 * across), plus the comparison-only settings.
 */
const CombinedControls = ({
  investment,
  onInvestmentChange,
  mortgage,
  onMortgageChange,
  settings,
  onSettingsChange,
}: CombinedControlsProps) => {
  const monthlyContribution =
    (investment.contributionAmount *
      PERIODS_PER_YEAR[investment.contributionFrequency]) /
    12;
  const monthlyBudget = settings.monthlyRent + monthlyContribution;

  const { dollars: downDollars } = resolveDownPayment(mortgage);
  const funding = resolveDownPaymentFunding(
    { investment, mortgage, ...settings },
    downDollars
  );
  const fundingRequested =
    settings.downPaymentFromFhsa +
    settings.downPaymentFromTfsa +
    settings.downPaymentFromRrsp +
    settings.downPaymentFromTaxable;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="caption" color="text.secondary">
        Defaults reflect North Vancouver, BC (mid-2026) — adjust for your
        market.
      </Typography>
      <SliderField
        label="Monthly rent"
        value={settings.monthlyRent}
        onChange={(monthlyRent) =>
          onSettingsChange({ ...settings, monthlyRent })
        }
        min={0}
        max={8000}
        step={50}
        unit="$"
        helperText="What you'd pay if you kept renting"
      />
      <SliderField
        label="Rent increases"
        value={settings.rentGrowthPct}
        onChange={(rentGrowthPct) =>
          onSettingsChange({ ...settings, rentGrowthPct })
        }
        min={0}
        max={8}
        step={0.1}
        unit="%"
        helperText="Per year — BC's 2026 rent-increase cap is 2.3%"
      />
      <SliderField
        label="Ownership costs"
        value={settings.ownershipCostPct}
        onChange={(ownershipCostPct) =>
          onSettingsChange({ ...settings, ownershipCostPct })
        }
        min={0}
        max={4}
        step={0.1}
        unit="%"
        helperText="Property tax + maintenance + insurance, % of home value per year"
      />
      <SliderField
        label="Home appreciation"
        value={settings.homeAppreciationPct}
        onChange={(homeAppreciationPct) =>
          onSettingsChange({ ...settings, homeAppreciationPct })
        }
        min={0}
        max={8}
        step={0.1}
        unit="%"
        helperText="Nominal, per year — Metro Vancouver's 20-yr average is ≈5.5%; recent years flat"
      />

      <Box>
        <Typography variant="body2" gutterBottom>
          When TFSA & RRSP room are full, extra buyer contributions go to
        </Typography>
        <ToggleButtonGroup
          value={settings.overflowDestination}
          exclusive
          onChange={(_, value: OverflowDestination | null) => {
            if (value) {
              onSettingsChange({ ...settings, overflowDestination: value });
            }
          }}
          size="small"
          fullWidth
        >
          <ToggleButton value="taxable">Taxable account</ToggleButton>
          <ToggleButton value="mortgage">Mortgage principal</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Alert severity="info" sx={{ py: 0.5 }}>
        Shared monthly budget: <strong>{formatCurrency(monthlyBudget)}</strong>{" "}
        today = rent + investment contribution, growing with inflation like a
        salary. Renting pays rent and invests the rest (unspent down-payment
        cash stays invested); buying pays the mortgage and ownership costs
        from the same budget and invests the rest.
      </Alert>

      <Accordion disableGutters variant="outlined" sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">
            Fund the down payment from investments
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Typography variant="caption" color="text.secondary">
            Pull part of the {formatCurrency(downDollars)} down payment from
            your accounts at purchase. Whatever isn't funded here is external
            cash — which the rent scenario invests instead.
          </Typography>
          <NumberField
            label="From FHSA"
            value={settings.downPaymentFromFhsa}
            onChange={(downPaymentFromFhsa) =>
              onSettingsChange({ ...settings, downPaymentFromFhsa })
            }
            unit="$"
            fullWidth
            helperText="Tax-free for a first home, no repayment — use this first"
          />
          <NumberField
            label="From TFSA"
            value={settings.downPaymentFromTfsa}
            onChange={(downPaymentFromTfsa) =>
              onSettingsChange({ ...settings, downPaymentFromTfsa })
            }
            unit="$"
            fullWidth
            helperText="Tax-free; the withdrawn room comes back next January"
          />
          <NumberField
            label="From RRSP (Home Buyers' Plan)"
            value={settings.downPaymentFromRrsp}
            onChange={(downPaymentFromRrsp) =>
              onSettingsChange({ ...settings, downPaymentFromRrsp })
            }
            unit="$"
            fullWidth
            helperText={`Up to ${formatCurrency(HBP_MAX_WITHDRAWAL)} — must be repaid over ${HBP_REPAYMENT_YEARS} years`}
          />
          <NumberField
            label="From taxable account"
            value={settings.downPaymentFromTaxable}
            onChange={(downPaymentFromTaxable) =>
              onSettingsChange({ ...settings, downPaymentFromTaxable })
            }
            unit="$"
            fullWidth
          />

          {fundingRequested > 0 && (
            <Alert severity="info" sx={{ py: 0.5 }}>
              Funded from investments:{" "}
              <strong>
                {formatCurrency(
                  funding.fhsa + funding.tfsa + funding.rrsp + funding.taxable
                )}
              </strong>{" "}
              · external cash: <strong>{formatCurrency(funding.cash)}</strong>
              {fundingRequested >
                funding.fhsa +
                  funding.tfsa +
                  funding.rrsp +
                  funding.taxable && (
                <>
                  {" "}
                  (requests were clamped to balances, the HBP cap, and the
                  down payment itself)
                </>
              )}
              {funding.fhsa > 0 && (
                <>
                  {" "}
                  The FHSA closes after purchase; any remainder moves to your
                  RRSP tax-free.
                </>
              )}
            </Alert>
          )}

          {funding.rrsp > 0 && (
            <Alert severity="warning" sx={{ py: 0.5 }}>
              HBP: {formatCurrency(funding.rrsp)} must be repaid to your RRSP
              at {formatCurrency(funding.rrsp / HBP_REPAYMENT_YEARS)}/yr for{" "}
              {HBP_REPAYMENT_YEARS} years, starting the 2nd year after
              withdrawal — modeled as coming out of your monthly budget.
              Missed repayments are added to your taxable income by the CRA.
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        disableGutters
        defaultExpanded
        variant="outlined"
        sx={accordionSx}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Investment inputs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <InvestmentControls
            config={investment}
            onChange={onInvestmentChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters variant="outlined" sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Mortgage inputs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MortgageControls config={mortgage} onChange={onMortgageChange} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CombinedControls;
