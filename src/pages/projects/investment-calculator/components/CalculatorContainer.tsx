import { useEffect, useState } from "react";
import { Box, Button, Paper, Tab, Tabs, Typography } from "@mui/material";
import { RestartAlt as RestartAltIcon } from "@mui/icons-material";
import {
  CalculatorMode,
  CombinedSettings,
  InvestmentConfig,
  MortgageConfig,
} from "../types";
import { useCombinedCalc } from "../hooks/useCombinedCalc";
import { downloadCsv, toCsv } from "../utils/export";
import { PAYMENT_FREQUENCY_LABELS } from "../utils/labels";
import {
  DEFAULT_STATE,
  clearCalculatorState,
  loadCalculatorState,
  saveCalculatorState,
} from "../utils/persistence";
import InvestmentControls from "./InvestmentControls";
import MortgageControls from "./MortgageControls";
import CombinedControls from "./CombinedControls";
import ResultsChart from "./ResultsChart";
import ResultsSummary from "./ResultsSummary";
import ResultsTable from "./ResultsTable";
import ExportButton from "./ExportButton";

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Mode tabs + state orchestration. The investment and mortgage configs
 * are shared across tabs — combined mode edits the same state, so
 * numbers always agree between modes.
 */
const CalculatorContainer = () => {
  // Initial state comes from localStorage (falling back to defaults);
  // the lazy initializer runs the read exactly once.
  const [initial] = useState(loadCalculatorState);
  const [mode, setMode] = useState<CalculatorMode>(initial.mode);
  const [investment, setInvestment] = useState<InvestmentConfig>(
    initial.investment
  );
  const [mortgage, setMortgage] = useState<MortgageConfig>(initial.mortgage);
  const [combinedSettings, setCombinedSettings] = useState<CombinedSettings>(
    initial.combinedSettings
  );

  // Debounced write-back so slider drags don't hammer localStorage.
  useEffect(() => {
    const id = window.setTimeout(() => {
      saveCalculatorState({ mode, investment, mortgage, combinedSettings });
    }, 300);
    return () => window.clearTimeout(id);
  }, [mode, investment, mortgage, combinedSettings]);

  const handleReset = () => {
    clearCalculatorState();
    setInvestment(DEFAULT_STATE.investment);
    setMortgage(DEFAULT_STATE.mortgage);
    setCombinedSettings(DEFAULT_STATE.combinedSettings);
  };

  const combinedResult = useCombinedCalc({
    investment,
    mortgage,
    ...combinedSettings,
  });
  const { investment: investmentResult, mortgage: mortgageResult } =
    combinedResult;

  const handleExport = () => {
    if (mode === "investment") {
      downloadCsv(
        "investment-projection.csv",
        toCsv(
          [
            "month",
            "total_value",
            "tfsa",
            "fhsa",
            "rrsp",
            "taxable",
            "total_contributions",
            "cumulative_fees",
            "real_total_value",
          ],
          investmentResult.timeline.map((p) => [
            p.month,
            round2(p.totalValue),
            round2(p.tfsaBalance),
            round2(p.fhsaBalance),
            round2(p.rrspBalance),
            round2(p.taxableBalance),
            round2(p.totalContributions),
            round2(p.cumulativeFees),
            round2(p.realTotalValue),
          ])
        )
      );
    } else if (mode === "mortgage") {
      downloadCsv(
        "amortization-schedule.csv",
        toCsv(
          ["payment_number", "month", "principal", "interest", "balance"],
          mortgageResult.schedule.map((r) => [
            r.paymentNumber,
            round2(r.month),
            round2(r.principalPaid),
            round2(r.interestPaid),
            round2(r.balance),
          ])
        )
      );
    } else {
      downloadCsv(
        "rent-vs-buy-projection.csv",
        toCsv(
          [
            "month",
            "net_worth_buy",
            "net_worth_rent",
            "investments_buy",
            "mortgage_balance",
            "home_value",
            "home_equity",
            "real_net_worth_buy",
            "real_net_worth_rent",
          ],
          combinedResult.timeline.map((p) => [
            p.month,
            round2(p.netWorth),
            round2(p.rentNetWorth),
            round2(p.investmentsTotal),
            round2(p.mortgageBalance),
            round2(p.homeValue),
            round2(p.homeEquity),
            round2(p.realNetWorth),
            round2(p.realRentNetWorth),
          ])
        )
      );
    }
  };

  return (
    <Box>
      <Tabs
        value={mode}
        onChange={(_, value: CalculatorMode) => setMode(value)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Investment" value="investment" />
        <Tab label="Mortgage" value="mortgage" />
        <Tab label="Combined" value="combined" />
      </Tabs>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            width: { xs: "100%", md: 380 },
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Inputs
          </Typography>
          {mode === "investment" && (
            <InvestmentControls config={investment} onChange={setInvestment} />
          )}
          {mode === "mortgage" && (
            <MortgageControls config={mortgage} onChange={setMortgage} />
          )}
          {mode === "combined" && (
            <CombinedControls
              investment={investment}
              onInvestmentChange={setInvestment}
              mortgage={mortgage}
              onMortgageChange={setMortgage}
              settings={combinedSettings}
              onSettingsChange={setCombinedSettings}
              funding={combinedResult.downPaymentFunding}
              purchaseDownPayment={combinedResult.purchaseDownPayment}
            />
          )}
        </Paper>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            minWidth: 0,
          }}
        >
          <ResultsSummary
            mode={mode}
            investment={investmentResult}
            mortgage={mortgageResult}
            combined={combinedResult}
            paymentFrequencyLabel={
              PAYMENT_FREQUENCY_LABELS[mortgage.paymentFrequency]
            }
          />
          <ResultsChart
            mode={mode}
            investment={investmentResult}
            mortgage={mortgageResult}
            combined={combinedResult}
            inflationPct={investment.inflationPct}
          />
          <ResultsTable
            mode={mode}
            investment={investmentResult}
            mortgage={mortgageResult}
            combined={combinedResult}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
            >
              Reset inputs
            </Button>
            <ExportButton onExport={handleExport} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CalculatorContainer;
