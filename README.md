# Compliance Companion

Build a web app dashboard called "PrivacyAudit AI" using React and Tailwind 

CSS, with lucide-react icons. Style: light background, soft rounded cards 

(20-24px radius), generous whitespace, minimal borders, subtle shadows, 

one accent color (deep blue or teal) used sparingly for emphasis — clean 

and airy, not data-dense.

=== TOP NAVIGATION BAR ===

- Left: small logo icon + "PrivacyAudit AI" wordmark

- Center: horizontal nav links — Dashboard, Data Flows, Reports, 

  Remediation (Dashboard shown as active/bold)

- Right: a search bar with placeholder "Search processes or findings...", 

  a "Re-scan" button (refresh icon + label, filled accent color, shows a 

  loading spinner state when clicked), a notification bell icon, and a 

  circular user avatar

=== MAIN CONTENT — grid layout, two rows ===

ROW 1, LEFT (large card, ~60% width): "Compliance Score Tracker"

- Card header: title "Compliance Score Tracker" on the left, a small 

  dropdown on the right showing "This Month" with options for different 

  time ranges

- Subtitle text: "Track how your organization's DPDP compliance posture 

  changes as processes are scanned and remediated"

- A line/bar chart showing compliance score over recent scan dates, with 

  one data point highlighted showing its exact score in a small floating 

  tooltip bubble (e.g. "78%")

- Below the chart: a large percentage figure (e.g. "+12%") with the label 

  "Compliance score improved since last scan" and small dot markers 

  representing each scan date, clickable to jump the chart to that point

ROW 1, RIGHT (~40% width): "Data Processing Activities" list card

- Header: "Data Processing Activities" with a "See all" link top-right

- A vertical list of scanned processes, each row showing:

  - A small colored icon/avatar representing the process type

  - Process name (e.g. "KYC Onboarding") as bold text

  - A risk tag pill next to the name: "High Risk" (red), "Medium Risk" 

    (amber), or "Low Risk" (green)

  - Tags below: data types involved (e.g. "PAN", "Aadhaar") as small 

    outlined pills

  - Last scanned time on the right (e.g. "2h ago") with a small expand 

    chevron

ROW 2, LEFT (~35% width): "High-Risk Findings" list card

- Header: "High-Risk Findings" with a "See all" link top-right

- A vertical list of the top flagged compliance gaps, each row showing:

  - A small circular avatar/icon indicating severity color

  - Finding text (e.g. "No lawful basis for KYC data collection")

  - A subtitle showing the DPDP section reference (e.g. "Section 4") and 

    related process name

  - A small expand chevron on the right

- Clicking a row expands it inline to reveal:

  a) A short plain-language explanation of the finding

  b) A "Suggested fix" line

  c) An embedded "Ask about this finding" chat panel: a small message 

     thread area (empty state text: "Ask a follow-up about this finding"), 

     user messages right-aligned with light accent background, AI 

     responses left-aligned plain text, plus a text input + send button 

     at the bottom

ROW 2, MIDDLE (~25% width): Urgency banner card

- A card with a subtle gradient background (deep blue to teal)

- Bold heading: "298 days to Phase 3 enforcement"

- Subtext: "Full DPDP Act enforcement begins May 13, 2027 — get your 

  organization audit-ready"

- A button: "View Compliance Timeline"

ROW 2, RIGHT (~40% width): "Remediation Progress" card

- Header: "Remediation Progress" with the current date shown top-right

- Three stat columns side by side, each with a large number and label:

  - "Findings identified" — total count

  - "In Progress" — count

  - "Resolved" — count

- Below the stats: a horizontal segmented bar/progress visualization 

  showing the proportion of Open (red segment) vs In Progress (amber 

  segment) vs Resolved (green segment) findings, spanning the full width 

  of the card

=== DATA ===

Use realistic dummy data for a fictional "Fintech App" company: at least 

3 processes with different risk tags, 5+ findings across severities with 

DPDP section references, a 6-8 point compliance score trend showing 

gradual improvement, and remediation counts that add up sensibly (e.g. 

12 identified, 5 in progress, 7 resolved).

=== STATE MANAGEMENT ===

Use React state (useState) for: time-range dropdown selection, list item 

expand/collapse on both list cards, the chat panel's message thread per 

finding, and the Re-scan button's loading state (simulate a ~1.5s delay 

before showing "updated" data on mock/no backend). No backend wiring yet 

— mock data only, structured so real API calls can be dropped in later 

without restructuring.

Make it fully responsive, stacking the grid into a single column on 

smaller screens.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/488a3af9-2f71-4e3f-909e-19bd385310af).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
