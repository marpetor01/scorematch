# ScoreMatch

**See who'll likely approve you — sorted by pull type.**

Type your credit score and get a ranked list of credit cards and lenders likely
to approve you, each tagged **No pull · Soft pull · Hard pull** so an inquiry
never catches you off guard. The whole idea is to take the *fear* out of
applying.

## Why this angle

Existing tools (Credit Karma, NerdWallet, Experian) show offers, but none of
them lead with the thing people are actually afraid of: **the hard inquiry.**
ScoreMatch organizes everything around pull type first.

## Run it

It's a static site — no build step.

```bash
# from this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser.

## Files

- `index.html` — page + score input
- `styles.css` — styling
- `lenders.js` — **demo** lender dataset (illustrative, not live offers)
- `app.js` — matching + ranking logic

## Honest limitations (read this)

- A **score alone cannot guarantee approval.** Real decisions use income,
  debt-to-income, recent inquiries, and derogatory marks. ScoreMatch only
  estimates *likelihood*, never approval.
- The lender list is **illustrative demo data** with typical thresholds — it is
  not scraped from issuers and is not financial advice.

## Where this goes next

1. Replace demo data with a maintained dataset of real prequalify offers.
2. Add optional questions (income, recent inquiries) to sharpen likelihood.
3. Affiliate/referral revenue — but rank by *fit*, not payout.
4. Review FCRA / CFPB obligations before showing real offers and earning
   referral fees.

---

*Educational prototype. Not affiliated with any brand shown. Not financial advice.*
