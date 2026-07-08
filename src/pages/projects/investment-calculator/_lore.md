# Investment & Mortgage Calculator Layer

## Purpose
A three-mode financial calculator (Investment, Mortgage, Combined) for the Canadian context: compound investment growth with TFSA/RRSP contribution-room modeling, Canadian mortgage amortization, and a combined net-worth projection. Self-contained — all state, math, types, and UI live here. Nothing is imported from outside this directory except `ProjectDetailLayout`, `getProjectById`, and MUI/x-charts.

**Phase status**: Fully implemented and browser-verified. All engines are real: account filling (TFSA/RRSP/taxable with room tracking and tax drag), full Canadian amortization (semi-annual compounding, CMHC, accelerated schedules, term renewals, early payoff), and the combined-mode **rent-vs-buy** simulation (see below). 37 unit tests (`npm test`).

## Files in this Layer
- `index.tsx` — Page entry: `ProjectDetailLayout` wrapper with an Overview section and `CalculatorContainer` as `additionalContent`.
- `types.ts` — All config/result interfaces. Convention: **rates are percentages (6.5 = 6.5%), never decimals**; conversion happens only inside `utils/calculations.ts`.
- `components/CalculatorContainer.tsx` — Mode tabs + state orchestration. Owns the shared `InvestmentConfig`/`MortgageConfig` state (combined mode edits the *same* state as the other tabs) and the CSV export handlers.
- `components/SliderField.tsx` — The input primitive: slider + adjacent `NumberField`. Slider clamps to its range; the text field deliberately does not, so typed values can exceed slider bounds.
- `components/NumberField.tsx` — Numeric text field with a local draft string so clearing the field doesn't snap to 0; only valid numbers commit upward, blur restores the committed value. Use this for every numeric input — never a raw controlled `TextField type="number"`.
- `components/ResultsTable.tsx` — Year-by-year table below the chart (also the chart's accessible table view).
- `components/{Investment,Mortgage,Combined}Controls.tsx` — Per-mode input panels, fully wired. CombinedControls nests the other two in accordions plus combined-only settings.
- `components/AccountConfig.tsx` — TFSA/RRSP/taxable sub-panel embedded in InvestmentControls (inputs wired; consumed by the engines in the implementation phase).
- `components/ResultsChart.tsx` — Multi-line `@mui/x-charts` LineChart with per-series chip toggles. Holds the **validated series palette** (see Chart decision below). x-charts v9 quirk: per-series line styling targets `.MuiLineChart-line[data-series="<id>"]` — the older `.MuiLineElement-series-<id>` classes no longer exist.
- `components/ResultsSummary.tsx` — Headline stat tiles per mode.
- `components/ExportButton.tsx` — CSV export trigger.
- `hooks/useInvestmentCalc.ts`, `hooks/useMortgageCalc.ts`, `hooks/useCombinedCalc.ts` — Memoized wrappers over the pure engines in `utils/calculations.ts`.
- `utils/accountFilling.ts` — `createAccountPortfolio`: the pure FHSA/TFSA/RRSP/taxable allocator. Routes contributions through room (FHSA always first — deductible in AND tax-free out, it dominates), grants new room at 12-month anniversaries (TFSA limit for `startYear + k`, flat RRSP estimate; FHSA is a lifetime pool drawn at ≤$8k/yr), returns overflow to the caller. Also the down-payment machinery: `withdraw`, `addTfsaRoom` (re-credit), `repayRrsp` (HBP repayments consume no room), `closeFhsa` (remainder transfers to RRSP — real rule). Growth doesn't consume room; taxable grows at the tax-dragged rate. (The planned `useAccountFilling` hook was dropped — pure allocator instead.)
- `utils/calculations.ts` — The pure math: rate helpers, CMHC tiers, PV discounting, and the three projection engines (`runInvestmentProjection`, `runMortgageProjection`, `runCombinedProjection`) plus `sampleMortgageMonthly` for charting.
- `utils/labels.ts` — Frequency label maps and currency/duration formatters.
- `utils/persistence.ts` — localStorage save/load/clear for all inputs + active mode. Versioned payload: bump `STORAGE_VERSION` on incompatible shape changes (stale saves are discarded whole); compatibly-added fields need no bump because `load` deep-merges stored values over current defaults. Write-back is debounced 300ms in `CalculatorContainer`; "Reset inputs" clears storage and restores defaults. All storage access is try/catch — private-mode/quota failures degrade to in-memory only.
- `utils/calculations.test.ts`, `utils/tfsaLimits.test.ts` — Vitest unit tests (`npm test`). Anchors: the $639.81 Canadian benchmark payment ($100k, 6%, 25y monthly), CMHC tiers, money conservation over the schedule, frequency invariance, and the nearest-$500 (not floor) TFSA rounding — 2028 at 2% inflation distinguishes the two.
- `utils/tfsaLimits.ts` — **Implemented.** CRA historical TFSA limits (2009–2026) + inflation-indexed projection.
- `utils/defaults.ts` — Default configs seeding the controls.
- `utils/export.ts` — **Implemented.** Generic `toCsv` + `downloadCsv` (Blob pattern reused from `Randomizer/fileUtils.ts`). TODO: per-mode timeline adapters.

## Locked Design Decisions (from scoping — do not re-litigate without the user)

**TFSA limits**: Historical table (2009–2026) baked in verbatim from canada.ca. From 2027: compound the *unrounded* value forward from the $7,000 base using the user's inflation input; round each granted year's limit to the **nearest $500** (CRA methodology — nearest, not floor). New room lands January 1; unused room carries forward indefinitely.

**RRSP room**: User enters current room and annual new room directly; an optional yearly-income field auto-fills new room as `min(18% × income, $33,810)` (CRA 2026 dollar limit) while the room field stays directly editable. RRSP growth treated as tax-free for simplicity; refund reinvestment explicitly out of scope.

**FHSA (simplified)**: Balance + lifetime-room-left fields; contributions draw from the lifetime pool at ≤$8,000/yr (the real $16k carry-forward subtlety is deliberately ignored) and always fill first. In the buy universe the FHSA closes at purchase — funded portion withdrawn tax-free, remainder transferred to the RRSP without consuming room.

**Down-payment funding (combined mode)**: The buyer can pull the down payment from FHSA / TFSA / RRSP (HBP) / taxable via `resolveDownPaymentFunding` — requests clamp to balances, the $60k HBP cap, and the remaining down-payment need, in that order; the rest is external cash, which the RENT universe invests instead (this keeps the t0 fairness invariant: both universes always start at identical net worth, tested). Withdrawn TFSA room re-credits at the first anniversary. HBP repays 1/15th per year over years 2–16 out of the buyer's budget into the RRSP (no room consumed); the UI warns about the schedule and that CRA taxes missed repayments.

**Account filling**: There is no single "initial investment" — the user enters **per-account starting balances** (TFSA/RRSP/taxable), which are placed directly into their accounts **without consuming contribution room**: money already inside consumed its room when originally contributed, and growth never consumes room. Only NEW contributions fill the priority account (user toggle: TFSA-first / RRSP-first), spill to the other, then overflow. (The renter's down-payment cash in combined mode is new money, so it does route through room.) Overflow destination is a user toggle: **taxable account** (investment mode always) or **extra mortgage principal** (combined mode, buyer side). Room grants are modeled at 12-month anniversaries rather than literal January 1sts.

**Combined mode is a rent-vs-buy comparison** (reworked from the original "own + invest" merge at the user's request): one monthly budget = rent + monthly-ized contribution, **stepping up annually with inflation like a salary**. RENT pays rent (growing at its own rate, default inflation) and invests the rest — and invests the down-payment cash from day one. BUY pays the mortgage (fixed nominal — the inflation-hedge effect falls out naturally) plus ownership costs (% of current home value, default 1.5% — property tax + maintenance + insurance) and invests the rest. `breakevenMonth` = the month from which buying stays ahead through the horizon (0 = always, null = renting ahead at horizon). Budget shortfalls (either side) are flagged, not silently absorbed — in shortfall months investing pauses but the mortgage is still paid, so the comparison is unfair and the UI warns. The buy scenario walks the mortgage **monthly** (so prepayments can alter it); its balance can differ slightly from the mortgage tab's exact per-payment schedule for sub-monthly frequencies.

**Taxable account**: Single effective tax rate (%) applied as drag on that account's returns — no capital-gains/dividend split.

**Compounding semantics**: Per-period rate is `(1 + r)^(1/n) − 1`, so annual growth is identical across frequencies; the frequency input only changes contribution *timing*. Return input is a CAGR — UI carries a one-line disclaimer that it's a smoothed average, not a volatility model.

**MER**: Subtracted from the annual return before compounding. Fee impact reported as delta vs a fee-free run.

**Mortgage math**: Semi-annual compounding (Canadian standard): per-payment rate `(1 + r/2)^(2/n) − 1`. Rate assumed constant across renewals — state this in UI copy near the renewal-balance display. Term renewal balances reported at each `termYears` boundary.

**Payment frequencies**: One dropdown, five options — Monthly, Bi-weekly (accelerated), Bi-weekly, Weekly (accelerated), Weekly. Accelerated = monthly payment ÷ 2 (or ÷ 4) paid 26 (or 52) times/year → pays off early. Non-accelerated = recalculated to match amortization exactly.

**CMHC insurance**: Mandatory below 20% down. Auto-calculated from the LTV tier table (2.8% / 3.1% / 4.0% of loan for 15–19.99% / 10–14.99% / 5–9.99% down), added to principal. Editable override field appears only when down payment < 20%; 0 disables.

**Home appreciation (combined mode)**: Nominal %/yr input, pre-filled with the inflation rate (helper text says so). Mental model everywhere: *all rate inputs are nominal; the real-value display discounts everything uniformly.*

**Inflation input**: Single value, dual purpose — present-value display and TFSA/RRSP limit projection.

**Market defaults = North Vancouver, BC (researched mid-2026)**: home price $800k (North Van condo benchmark; detached ≈ $2.15M), rent $3,350 (2-bed ≈ $3,345 per liv.rent), rent growth 2.3% (BC's announced 2026 rent-increase cap, down from 3.0% in 2025), mortgage 4.3% (best conventional 5-yr fixed ≈ 3.94–4.34% mid-2026), appreciation 5% (Metro Van 20-yr CAGR ≈ 5.5%; recent years flat), ownership costs 1.5% (CNV effective property tax ≈ 0.32% + strata/maintenance/insurance). A caption in CombinedControls tells users the defaults are North Van and to adjust.

**Chart**: `@mui/x-charts` (community edition, MIT — deliberately chosen over Recharts because it themes from the existing MUI theme automatically). Multi-line with per-series show/hide toggles; inflation-adjusted variants render dashed. Free tier covers everything needed; do not import from `@mui/x-charts-pro`.

**Chart palette**: Validated with the dataviz palette validator against the app's real chart surfaces (`#ffffff` light paper / `#1e1e1e` dark paper) — CVD-safe adjacency per mode's default visible set, separate light/dark steps. Color follows the entity across modes: investments blue, TFSA aqua, RRSP violet, taxable yellow, mortgage red, home equity green, buy-net-worth magenta, contributions-baseline gray; real-dollar variants share their parent hue, dashed. **Rent-net-worth reuses yellow** (taxable never co-displays in combined mode) — violet and aqua both FAIL dark-mode CVD adjacency in that series order; yellow passes. Hex values live in `ResultsChart.tsx` (`COLOR`). If you change hues or the default series order, re-validate.

**Export**: CSV of the full timeline via the Randomizer Blob-download pattern. PNG export deferred — low value, fiddly.

## Out of Scope (explicitly excluded during scoping)
Income modeling / tax brackets, RRSP refund reinvestment, withdrawal/decumulation strategies, multiple properties, detailed capital-gains tax, variable-rate scenarios. (Rent-vs-buy was originally excluded but was pulled into scope by the user and is now combined mode.)

## Key Patterns & Contracts
- **Rates as percentages** end-to-end in configs and UI; decimal conversion is `utils/calculations.ts`'s job alone.
- **Timelines are monthly**: results sample one point per month regardless of contribution/payment frequency, keeping chart series alignable across modes in combined view.
- **Pure math in utils, orchestration in hooks**: projection engines must be pure functions of config (no Date.now, no locale) so they stay trivially testable; hooks memoize and expose them to components.
- **Persistence via localStorage**: inputs and active mode survive refresh (`utils/persistence.ts`). It lives exactly where the Randomizer lore said it should — CalculatorContainer's state initializers plus one debounced write-back effect, nothing scattered in child components. Calculated results are never persisted; they recompute from inputs.

## What Belongs Here
All state, financial math, types, export logic, and UI for the calculator — nothing here is imported outside this directory except by `src/config/projectRoutes.tsx` (which imports `index.tsx`).
