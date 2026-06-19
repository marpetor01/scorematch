/*
 * ScoreMatch — demo lender dataset.
 *
 * IMPORTANT: These are ILLUSTRATIVE, typical-case entries for a prototype.
 * They are NOT live offers and NOT scraped from issuers. `min` is the score
 * at which approval becomes plausible for a typical applicant; real approval
 * depends on income, debt-to-income, recent inquiries, and derogatory marks.
 *
 * pull: "none" | "soft" | "hard"
 *   none = decisions without a credit report pull
 *   soft = prequalify / preapproval with a soft inquiry (no score impact)
 *   hard = formal application, hard inquiry
 */
const LENDERS = [
  // ---- No pull ----
  { name: "Secured starter card", cat: "Credit card · secured", pull: "none", min: 300,
    desc: "Refundable deposit becomes your limit. Approval generally not based on score." },
  { name: "Credit-builder loan", cat: "Loan · builder", pull: "none", min: 300,
    desc: "Funds held in a locked account while you pay it off. Reports to bureaus." },
  { name: "Debit-linked 'build credit' card", cat: "Credit card · alt-data", pull: "none", min: 300,
    desc: "Uses your bank cash flow instead of a credit pull to set a limit." },

  // ---- Soft pull (prequalify) ----
  { name: "Entry rewards card (prequalify)", cat: "Credit card · rewards", pull: "soft", min: 580,
    desc: "Soft-pull preapproval check before you formally apply." },
  { name: "Store / retail card", cat: "Credit card · retail", pull: "soft", min: 600,
    desc: "Many retail cards offer a soft-pull prequalify and approve thinner files." },
  { name: "Personal loan marketplace", cat: "Loan · personal", pull: "soft", min: 600,
    desc: "Check estimated rates across lenders with a soft pull, then choose one." },
  { name: "Mid-tier cash-back card (prequalify)", cat: "Credit card · cash back", pull: "soft", min: 660,
    desc: "Solid cash back; soft-pull prequalify tool available." },
  { name: "Auto refinance (prequalify)", cat: "Loan · auto", pull: "soft", min: 640,
    desc: "See refinance estimates without a hard inquiry up front." },

  // ---- Hard pull (formal application) ----
  { name: "Travel rewards card", cat: "Credit card · travel", pull: "hard", min: 700,
    desc: "Strong sign-up bonuses. Application is a hard pull; good/excellent credit." },
  { name: "Premium metal card", cat: "Credit card · premium", pull: "hard", min: 740,
    desc: "High annual fee, top perks. Typically excellent credit only." },
  { name: "Low-APR personal loan", cat: "Loan · personal", pull: "hard", min: 680,
    desc: "Best rates go to strong scores; final application is a hard pull." },
  { name: "0% intro APR balance-transfer card", cat: "Credit card · balance transfer", pull: "hard", min: 690,
    desc: "Long 0% intro window; hard pull on application." },
  { name: "New-car auto loan (dealer)", cat: "Loan · auto", pull: "hard", min: 660,
    desc: "Dealer financing usually runs a hard inquiry (sometimes several)." },
];
