import { useState } from "react";
import { Box, Chip, Paper, Typography, useTheme } from "@mui/material";
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
  dashed?: boolean;
  data: number[];
}

interface ResultsChartProps {
  mode: CalculatorMode;
  investment: InvestmentResult;
  mortgage: MortgageResult;
  combined: CombinedResult;
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
        {
          key: "realTotalValue",
          label: "Total value (today's $)",
          color: COLOR.blue,
          dashed: true,
          data: investment.timeline.map((p) => p.realTotalValue),
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
        label: "Net worth — buy",
        color: COLOR.magenta,
        data: combined.timeline.map((p) => p.netWorth),
      },
      {
        // For the renter, net worth IS their investments (they hold no
        // other assets) — labeled so it reads as the direct comparable
        // to "Investments (buy)".
        key: "rentNetWorth",
        label: "Investments = net worth — rent",
        color: COLOR.yellow,
        data: combined.timeline.map((p) => p.rentNetWorth),
      },
      {
        key: "investmentsTotal",
        label: "Investments (buy)",
        color: COLOR.blue,
        data: combined.timeline.map((p) => p.investmentsTotal),
      },
      {
        key: "mortgageBalance",
        label: "Mortgage balance",
        color: COLOR.red,
        data: combined.timeline.map((p) => p.mortgageBalance),
      },
      {
        key: "homeEquity",
        label: "Home equity",
        color: COLOR.green,
        data: combined.timeline.map((p) => p.homeEquity),
      },
      {
        key: "realNetWorth",
        label: "Buy (today's $)",
        color: COLOR.magenta,
        dashed: true,
        data: combined.timeline.map((p) => p.realNetWorth),
      },
      {
        key: "realRentNetWorth",
        label: "Rent (today's $)",
        color: COLOR.yellow,
        dashed: true,
        data: combined.timeline.map((p) => p.realRentNetWorth),
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
}: ResultsChartProps) => {
  const theme = useTheme();
  const paletteMode = theme.palette.mode;
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const { xYears, defs } = buildSeries(mode, investment, mortgage, combined);
  const visible = defs.filter((d) => !hidden[d.key]);

  // x-charts v9 exposes lines as .MuiLineChart-line[data-series="<id>"]
  const dashedSx = Object.fromEntries(
    visible
      .filter((d) => d.dashed)
      .map((d) => [
        `& .MuiLineChart-line[data-series="${d.key}"]`,
        { strokeDasharray: "6 4" },
      ])
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 1,
          alignItems: "center",
        }}
      >
        {defs.map((d) => {
          const isHidden = Boolean(hidden[d.key]);
          const dotColor = d.color[paletteMode];
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
                    ...(d.dashed
                      ? {
                          border: `2px solid ${dotColor}`,
                          bgcolor: "transparent",
                        }
                      : { bgcolor: dotColor }),
                    opacity: isHidden ? 0.4 : 1,
                  }}
                />
              }
              sx={{ opacity: isHidden ? 0.6 : 1 }}
            />
          );
        })}
      </Box>

      <LineChart
        height={360}
        xAxis={[
          {
            data: xYears,
            label: "Years",
            min: 0,
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
            width: 72,
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
        sx={dashedSx}
      />
    </Paper>
  );
};

export default ResultsChart;
