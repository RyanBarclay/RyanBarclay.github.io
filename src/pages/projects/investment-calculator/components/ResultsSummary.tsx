import { Alert, Box, Paper, Typography } from "@mui/material";
import {
  CalculatorMode,
  CombinedResult,
  InvestmentResult,
  MortgageResult,
} from "../types";
import { formatCurrency, formatMonths } from "../utils/labels";

interface Stat {
  label: string;
  value: string;
  sub?: string;
}

interface ResultsSummaryProps {
  mode: CalculatorMode;
  investment: InvestmentResult;
  mortgage: MortgageResult;
  combined: CombinedResult;
  paymentFrequencyLabel: string;
}

const buildStats = ({
  mode,
  investment,
  mortgage,
  combined,
}: Omit<ResultsSummaryProps, "paymentFrequencyLabel">): Stat[] => {
  if (mode === "investment") {
    return [
      {
        label: "Future value",
        value: formatCurrency(investment.futureValue),
        sub: `${formatCurrency(investment.futureValueReal)} in today's dollars`,
      },
      {
        label: "Total contributions",
        value: formatCurrency(investment.totalContributions),
      },
      {
        label: "Growth",
        value: formatCurrency(investment.totalGrowth),
      },
      {
        label: "Cost of fees",
        value: formatCurrency(investment.totalFees),
        sub: "vs. the same portfolio with no MER",
      },
    ];
  }
  if (mode === "mortgage") {
    return [
      {
        label: "Payment",
        value: formatCurrency(mortgage.paymentAmount),
      },
      {
        label: "Loan amount",
        value: formatCurrency(mortgage.loanAmount),
        sub:
          mortgage.cmhcPremium > 0
            ? `includes ${formatCurrency(mortgage.cmhcPremium)} CMHC premium`
            : undefined,
      },
      {
        label: "Total interest",
        value: formatCurrency(mortgage.totalInterest),
      },
      {
        label: "Paid off in",
        value: formatMonths(mortgage.payoffMonths),
      },
    ];
  }
  const last = combined.timeline[combined.timeline.length - 1];
  const buy = last?.netWorth ?? 0;
  const rent = last?.rentNetWorth ?? 0;
  // Measure the verdict from the purchase month onward: level
  // differences at purchase (e.g. a family gift, buy-universe only)
  // don't get credited — only what each path builds afterwards.
  const atPurchase =
    combined.timeline[
      Math.min(combined.purchaseMonth, combined.timeline.length - 1)
    ];
  const growthDiff =
    buy - (atPurchase?.netWorth ?? 0) - (rent - (atPurchase?.rentNetWorth ?? 0));
  return [
    {
      label: "Buying — net worth",
      value: formatCurrency(buy),
      sub: `${formatCurrency(last?.realNetWorth ?? 0)} in today's dollars`,
    },
    {
      label: "Renting — net worth",
      value: formatCurrency(rent),
      sub: `${formatCurrency(last?.realRentNetWorth ?? 0)} in today's dollars`,
    },
    {
      label: "Difference (since purchase)",
      value: formatCurrency(Math.abs(growthDiff)),
      sub:
        growthDiff >= 0
          ? "buying builds more from the moment you buy"
          : "renting builds more from the moment you buy",
    },
    {
      label: "Breakeven",
      value:
        combined.breakevenMonth === null
          ? "Never"
          : combined.breakevenMonth === 0
            ? "Immediately"
            : formatMonths(combined.breakevenMonth),
      sub:
        combined.breakevenMonth === null
          ? "renting stays ahead within this horizon"
          : "when buying pulls ahead of renting for good",
    },
  ];
};

/** Headline numbers for the active mode. */
const ResultsSummary = (props: ResultsSummaryProps) => {
  const stats = buildStats(props);
  const { mode, paymentFrequencyLabel, combined } = props;

  const shortfalls: string[] = [];
  if (mode === "combined") {
    if (combined.buyShortfallMonth !== null) {
      shortfalls.push(
        `the buyer's budget stops covering the mortgage + ownership costs at ${formatMonths(combined.buyShortfallMonth)}`
      );
    }
    if (combined.rentShortfallMonth !== null) {
      shortfalls.push(
        `rent alone exceeds the budget at ${formatMonths(combined.rentShortfallMonth)}`
      );
    }
  }

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      {shortfalls.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Budget shortfall: {shortfalls.join("; ")}. Investing is paused in
          those months — consider a bigger budget or cheaper scenario.
        </Alert>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Typography variant="caption" color="text.secondary">
              {stat.label}
              {mode === "mortgage" && stat.label === "Payment"
                ? ` (${paymentFrequencyLabel.toLowerCase()})`
                : ""}
            </Typography>
            <Typography variant="h5">{stat.value}</Typography>
            {stat.sub && (
              <Typography variant="caption" color="text.secondary">
                {stat.sub}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ResultsSummary;
