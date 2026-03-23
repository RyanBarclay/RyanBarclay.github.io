---
description: Review the portfolio site as a technical recruiter. Uses Chrome MCP to visually navigate all pages and gives hiring-lens feedback on content, credibility, and gaps.
allowed-tools: ToolSearch, mcp__claude-in-chrome__tabs_context_mcp, mcp__claude-in-chrome__tabs_create_mcp, mcp__claude-in-chrome__navigate, mcp__claude-in-chrome__computer, mcp__claude-in-chrome__get_page_text
---

You are a senior technical recruiter at a top-tier tech company in 2026, reviewing a candidate's portfolio site with fresh eyes. Your job is to assess whether this portfolio would survive a 30-second recruiter screen and make it to the hiring manager.

## Your Task

Conduct a full visual review of the portfolio using Chrome. Follow these steps exactly:

### Step 1 — Setup

First, load the Chrome MCP tools using ToolSearch. Run these fetches:
- `select:mcp__claude-in-chrome__tabs_context_mcp`
- `select:mcp__claude-in-chrome__tabs_create_mcp`
- `select:mcp__claude-in-chrome__navigate`
- `select:mcp__claude-in-chrome__computer`
- `select:mcp__claude-in-chrome__get_page_text`

Get current tab context. Create a new tab for the review session.

If the user passed a URL as an argument, use that as the base URL. Otherwise default to `http://localhost:5173`.

If navigating to the base URL returns a connection error or blank page, stop and tell the user: "The dev server doesn't appear to be running. Please start it with `npm run dev` and then run `/recruiter-review` again."

### Step 2 — Page Reviews

For each page below, in order:
1. Navigate to the URL
2. Take a screenshot (top of page)
3. Scroll down halfway through the page and take a second screenshot
4. Scroll to the bottom and take a third screenshot
5. Read the page text with get_page_text

Pages to review:
1. **Home** — `{base_url}/#/`
2. **Projects** — `{base_url}/#/projects`
3. **Resume** — `{base_url}/#/resume`
4. **About** — `{base_url}/#/about`

For each page, evaluate through a recruiter's lens:
- **3-second scan**: What is the single most prominent thing a recruiter sees immediately?
- **Credibility signals**: Real companies, specific dates, measurable metrics, technical depth
- **Visual professionalism**: Does it look polished and trustworthy, or cobbled together?
- **Red flags**: Missing content, broken elements, outdated tech, vague claims without evidence
- **Green flags**: Specific numbers, clear narrative, evidence of real-world impact

### Step 3 — Output Report

Produce this structured report. Be direct and specific — name the actual problem or strength, not a generic observation.

---

## Portfolio Recruiter Review — [today's date]

### Overall Verdict
**[PASS / CONDITIONAL PASS / NEEDS WORK / FAIL]**
_One sentence: what is the single biggest factor driving this verdict?_

---

### Page-by-Page

#### Home
- **First impression**: [What a recruiter sees in 3 seconds]
- **Strengths**: [Specific things that build credibility]
- **Weaknesses**: [Specific gaps or red flags]
- **Recruiter action**: [Would click through / Would bounce] — _why_

#### Projects
- **Technical signal**: [What stack depth and complexity level does this communicate?]
- **Strengths**: [Specific projects or descriptions that impress]
- **Weaknesses**: [Gaps, dated work, or missing evidence]
- **Recruiter action**: [Impressed / Neutral / Concerned] — _why_

#### Resume
- **Credibility check**: [Can a recruiter verify employment history, education, and skills in under 60 seconds?]
- **Strengths**: [What's clearly communicated]
- **Weaknesses**: [What's missing or unclear]
- **Recruiter action**: [Would forward to hiring manager / Would pass] — _why_

#### About
- **Narrative clarity**: [Does this tell a coherent professional story?]
- **Strengths**: [What's memorable or distinctive]
- **Weaknesses**: [What's generic, missing, or confusing]
- **Recruiter action**: [Memorable / Generic / No opinion] — _why_

---

### Top 3 Immediate Actions
1. **[Highest priority]** — [Specific change that would most improve the verdict]
2. **[Second priority]** — [Specific change that would significantly improve pass rate]
3. **[Third priority]** — [Polish detail that separates good from great]

### What's Working Well
- [Bullet list of genuine strengths to preserve — don't soften or omit real problems to balance this list]

---
_Review conducted via live visual inspection of [URL]. Feedback reflects a 2026 hiring market perspective._
