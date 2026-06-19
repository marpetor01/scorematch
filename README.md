# ScoreMatch — Arizona MVP

**Know where you stand before you apply.**

ScoreMatch is an AI-guided financial discovery platform. Tell it your credit
score and goal, and it returns your credit rating, an approval-confidence
estimate, matched Arizona products, and a personalized plan — while showing
which lenders do a **soft pull** vs. a **hard pull** so you avoid needless hard
inquiries.

> **Arizona-only MVP.** The marketplace covers real Arizona credit unions.

## Features

1. **Onboarding** — score slider (300–850), state (Arizona), and goal (Credit
   Card / Auto Loan / Personal Loan / Credit Builder / Mortgage).
2. **AI Credit Advisor** — credit rating, approval-confidence %, likely vs.
   unlikely products, next steps, and score-improvement tips. Rules-based and
   fully in-browser (see *Architecture*).
3. **Arizona Marketplace** — structured `marketplace.json` of real institutions
   and their products.
4. **Match Cards** — approval badge, inquiry-type badge, estimated APR,
   recommended reason, eligibility explanation, and a **Visit lender** CTA.
5. **Filters** — All · No Pull · Soft Pull · Hard Pull · Credit Cards · Loans ·
   Credit Building.
6. **Score Simulator** — drag the slider and every match, badge, %, and APR
   updates instantly.
7. **Disclaimer** — clearly states ScoreMatch is not a lender, bureau, or
   advisor.

## Run it

Static site — no build. Must be served over HTTP (the marketplace loads via
`fetch`):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Append `#autorun` to render results immediately (handy for demos/screenshots).

## Architecture

| File | Role |
|------|------|
| `index.html` | Onboarding, advisor, marketplace, simulator, disclaimer |
| `styles.css` | Dark glassmorphism UI (Apple Card / Rocket Money inspired) |
| `advisor.js` | `Advisor.analyze()` — deterministic credit engine |
| `marketplace.json` | Arizona institutions + products (the data layer) |
| `app.js` | Loads data, runs the advisor, renders, handles simulator/filters |

### Why the advisor is rules-based (not an LLM call)

A static site can't safely hold an API key, and users' credit scores shouldn't
be shipped to a third party. The advisor is **deterministic, explainable, and
runs 100% in the browser** — nothing leaves the device. `Advisor.analyze()` is
isolated so a real LLM or underwriting backend can replace it later without
touching the UI.

## Honest limitations

- Institutions are **real Arizona credit unions**, but product names, minimum
  scores, and APR ranges are **illustrative estimates** for an MVP — not live
  offers. Confirm current terms with each institution.
- A score alone can't guarantee approval; real decisions use income,
  debt-to-income, recent inquiries, and history. ScoreMatch estimates
  *likelihood*, never approval.

## Roadmap

1. Replace estimated product data with a maintained, dated feed of real offers.
2. Add income / DTI / inquiry inputs to sharpen confidence.
3. Real prequalification API integrations (soft-pull).
4. Expand beyond Arizona.
5. Optional LLM advisor backend behind `Advisor.analyze()`.

---

*Educational tool. Not affiliated with any institution shown. Not financial advice.*
