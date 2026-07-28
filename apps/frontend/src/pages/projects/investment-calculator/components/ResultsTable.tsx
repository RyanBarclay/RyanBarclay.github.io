import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  CalculatorMode,
  CombinedResult,
  InvestmentResult,
  MortgageResult,
} from "../types";
import { sampleMortgageMonthly } from "../utils/calculations";
import { formatCurrency } from "../utils/labels";

interface ResultsTableProps {
  mode: CalculatorMode;
  investment: InvestmentResult;
  mortgage: MortgageResult;
  combined: CombinedResult;
}

interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

/** Year-end snapshots of the active mode's timeline. */
const buildTable = ({
  mode,
  investment,
  mortgage,
  combined,
}: ResultsTableProps): TableData => {
  if (mode === "investment") {
    return {
      headers: [
        "Year",
        "Total value",
        "TFSA",
        "FHSA",
        "RRSP",
        "Taxable",
        "Contributions",
        "Today's $",
      ],
      rows: investment.timeline
        .filter((p) => p.month % 12 === 0)
        .map((p) => [
          p.month / 12,
          formatCurrency(p.totalValue),
          formatCurrency(p.tfsaBalance),
          formatCurrency(p.fhsaBalance),
          formatCurrency(p.rrspBalance),
          formatCurrency(p.taxableBalance),
          formatCurrency(p.totalContributions),
          formatCurrency(p.realTotalValue),
        ]),
    };
  }
  if (mode === "mortgage") {
    return {
      headers: [
        "Year",
        "Remaining balance",
        "Principal paid",
        "Interest paid",
      ],
      rows: sampleMortgageMonthly(mortgage)
        .filter((p) => p.month % 12 === 0)
        .map((p) => [
          p.month / 12,
          formatCurrency(p.balance),
          formatCurrency(mortgage.loanAmount - p.balance),
          formatCurrency(p.cumulativeInterest),
        ]),
    };
  }
  return {
    headers: [
      "Year",
      "Buy: net worth",
      "Rent: net worth",
      "Buy: investments",
      "Buy: mortgage balance",
      "Buy: home equity",
    ],
    rows: combined.timeline
      .filter((p) => p.month % 12 === 0)
      .map((p) => [
        p.month / 12,
        formatCurrency(p.netWorth),
        formatCurrency(p.rentNetWorth),
        formatCurrency(p.investmentsTotal),
        formatCurrency(p.mortgageBalance),
        formatCurrency(p.homeEquity),
      ]),
  };
};

/** Year-by-year table below the chart — the readable/accessible view. */
const ResultsTable = (props: ResultsTableProps) => {
  const { headers, rows } = buildTable(props);

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Year by year
      </Typography>
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map((header, i) => (
                <TableCell key={header} align={i === 0 ? "left" : "right"}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row[0]} hover>
                {row.map((cell, i) => (
                  <TableCell
                    key={`${row[0]}-${headers[i]}`}
                    align={i === 0 ? "left" : "right"}
                    sx={i === 0 ? undefined : { fontVariantNumeric: "tabular-nums" }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ResultsTable;
