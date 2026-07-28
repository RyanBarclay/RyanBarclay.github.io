import { useState } from "react";
import {
  Box,
  Chip,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  CalculatorMode,
  CombinedResult,
  InvestmentResult,
  MortgageResult,
} from "../types";
import { sampleMortgageMonthly } from "../utils/calculations";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatMonths,
} from "../utils/labels";

/**
 * Series palette validated with the dataviz palette validator against
 * the app's actual chart surfaces (#ffffff light / #1e1e1e dark):
 * CVD-safe adjacency per mode, ≥3:1 contrast except aqua/yellow/magenta
 * in light mode, which the labeled toggle chips mitigate. Color follows
 * the entity across modes (investments are always blue, mortgage always
 * red, etc.); inflation-adjusted variants share their parent's hue,
 * dashed.
 */
const COLOR = {
  blue: { light: "#2a78d6", dark: "#3987e5" }, // investments
  aqua: { light: "#1baf7a", dark: "#199e70" }, // TFSA
  violet: { light: "#4a3aa7", dark: "#9085e9" }, // RRSP
  yellow: { light: "#eda100", dark: "#c98500" }, // taxable / cum. interest / rent net worth
  red: { light: "#e34948", dark: "#e66767" }, // mortgage balance
  green: { light: "#008300", dark: "#008300" }, // home equity
  magenta: { light: "#e87ba4", dark: "#d55181" }, // buy net worth
  orange: { light: "#eb6834", dark: "#d95926" }, // FHSA
  gray: { light: "#898781", dark: "#898781" }, // contributions baseline
};

interface SeriesDef {
  key: string;
  label: string;
  color: { light: string; dark: string };
  data: number[];
}

interface ResultsChartProps {
  mode: CalculatorMode;
  investment: InvestmentResult;
  mortgage: MortgageResult;
  combined: CombinedResult;
  /** For the nominal ↔ today's-$ toggle. */
  inflationPct: number;
}

const buildSeries = (
  mode: CalculatorMode,
  investment: InvestmentResult,
  mortgage: MortgageResult,
  combined: CombinedResult
): { xYears: number[]; defs: SeriesDef[] } => {
  if (mode === "investment") {
    return {
      xYears: investment.timeline.map((p) => p.month / 12),
      defs: [
        {
          key: "totalValue",
          label: "Total value",
          color: COLOR.blue,
          data: investment.timeline.map((p) => p.totalValue),
        },
        {
          key: "tfsaBalance",
          label: "TFSA",
          color: COLOR.aqua,
          data: investment.timeline.map((p) => p.tfsaBalance),
        },
        {
          key: "fhsaBalance",
          label: "FHSA",
          color: COLOR.orange,
          data: investment.timeline.map((p) => p.fhsaBalance),
        },
        {
          key: "rrspBalance",
          label: "RRSP",
          color: COLOR.violet,
          data: investment.timeline.map((p) => p.rrspBalance),
        },
        {
          key: "taxableBalance",
          label: "Taxable",
          color: COLOR.yellow,
          data: investment.timeline.map((p) => p.taxableBalance),
        },
        {
          key: "totalContributions",
          label: "Contributions",
          color: COLOR.gray,
          data: investment.timeline.map((p) => p.totalContributions),
        },
      ],
    };
  }
  if (mode === "mortgage") {
    const monthly = sampleMortgageMonthly(mortgage);
    return {
      xYears: monthly.map((p) => p.month / 12),
      defs: [
        {
          key: "mortgageBalance",
          label: "Remaining balance",
          color: COLOR.red,
          data: monthly.map((p) => p.balance),
        },
        {
          key: "cumulativeInterest",
          label: "Interest paid (cumulative)",
          color: COLOR.yellow,
          data: monthly.map((p) => p.cumulativeInterest),
        },
      ],
    };
  }
  return {
    xYears: combined.timeline.map((p) => p.month / 12),
    defs: [
      {
        key: "netWorth",
        label: "Buy: net worth",
        color: COLOR.magenta,
        data: combined.timeline.map((p) => p.netWorth),
      },
      {
        // The renter holds no property, so their net worth IS their
        // investment portfolio — one line, explained by the caption
        // under the chart.
        key: "rentNetWorth",
        label: "Rent: net worth",
        color: COLOR.yellow,
        data: combined.timeline.map((p) => p.rentNetWorth),
      },
      {
        key: "investmentsTotal",
        label: "Buy: investments",
        color: COLOR.blue,
        data: combined.timeline.map((p) => p.investmentsTotal),
      },
      {
        key: "mortgageBalance",
        label: "Buy: mortgage balance",
        color: COLOR.red,
        data: combined.timeline.map((p) => p.mortgageBalance),
      },
      {
        key: "homeEquity",
        label: "Buy: home equity",
        color: COLOR.green,
        data: combined.timeline.map((p) => p.homeEquity),
      },
    ],
  };
};

/** Multi-line timeline with per-series chip toggles. */
const ResultsChart = ({
  mode,
  investment,
  mortgage,
  combined,
  inflationPct,
}: ResultsChartProps) => {
  const theme = useTheme();
  const paletteMode = theme.palette.mode;
  // Phones: reclaim horizontal room from the y-axis and shorten the
  // chart so the plot doesn't render as a tall sliver.
  const isNarrow = useMediaQuery(theme.breakpoints.down("sm"));
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [dollarMode, setDollarMode] = useState<"nominal" | "real">("nominal");

  const { xYears, defs } = buildSeries(mode, investment, mortgage, combined);
  // Today's-$ mode discounts EVERY series by inflation — one mental
  // model for the whole chart instead of dashed twin lines.
  const deflated =
    dollarMode === "real"
      ? defs.map((d) => ({
          ...d,
          data: d.data.map(
            (v, i) => v / Math.pow(1 + inflationPct / 100, xYears[i])
          ),
        }))
      : defs;
  const visible = deflated.filter((d) => !hidden[d.key]);

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 1,
          alignItems: "center",
        }}
      >
        {deflated.map((d) => {
          const isHidden = Boolean(hidden[d.key]);
          return (
            <Chip
              key={d.key}
              label={d.label}
              size="small"
              variant={isHidden ? "outlined" : "filled"}
              onClick={() =>
                setHidden((h) => ({ ...h, [d.key]: !h[d.key] }))
              }
              icon={
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    ml: 0.5,
                    bgcolor: d.color[paletteMode],
                    opacity: isHidden ? 0.4 : 1,
                  }}
                />
              }
              sx={{ opacity: isHidden ? 0.6 : 1 }}
            />
          );
        })}
        <ToggleButtonGroup
          value={dollarMode}
          exclusive
          onChange={(_, value: "nominal" | "real" | null) => {
            if (value) setDollarMode(value);
          }}
          size="small"
          sx={{ ml: "auto" }}
        >
          <ToggleButton value="nominal" sx={{ px: 1, py: 0.25 }}>
            Nominal
          </ToggleButton>
          <ToggleButton value="real" sx={{ px: 1, py: 0.25 }}>
            Today's $
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <LineChart
        height={isNarrow ? 280 : 360}
        // x-charts reserves a default left margin on top of the y-axis
        // width — zero it out so the plot uses the full card width.
        margin={{ left: 0, right: isNarrow ? 8 : 16 }}
        xAxis={[
          {
            data: xYears,
            label: "Years",
            min: 0,
            tickLabelStyle: isNarrow ? { fontSize: 11 } : undefined,
            // The x data is monthly (fractional years) — show clean
            // "N yrs M mo" in the tooltip instead of 3.9166666….
            valueFormatter: (years: number, context: { location: string }) =>
              context.location === "tooltip"
                ? formatMonths(Math.round(years * 12))
                : String(years),
          },
        ]}
        yAxis={[
          {
            // Sized to the widest compact tick ("$1.5M"-style) — ticks
            // land on round numbers so labels stay short.
            width: isNarrow ? 44 : 56,
            tickLabelStyle: isNarrow ? { fontSize: 11 } : undefined,
            valueFormatter: (value: number | null) =>
              formatCurrencyCompact(value ?? 0),
          },
        ]}
        series={visible.map((d) => ({
          id: d.key,
          data: d.data,
          label: d.label,
          color: d.color[paletteMode],
          showMark: false,
          curve: "linear" as const,
          valueFormatter: (value: number | null) =>
            value == null ? "" : formatCurrency(value),
        }))}
        hideLegend
        grid={{ horizontal: true }}
      />
      {mode === "combined" && (
        <Typography variant="caption" color="text.secondary" display="block">
          The renter holds no property, so their net worth is simply their
          investment portfolio — compare it with "Buy: investments" to see
          where each universe's money lives.
        </Typography>
      )}
    </Paper>
  );
};

export default ResultsChart;
