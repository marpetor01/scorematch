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
 *
 * avail: "all"  -> available nationwide (most big card issuers)
 *        ["AZ", "CA", ...] -> only available to residents of those states
 *        (typical for credit unions and regional / community banks)
 */
const LENDERS = [
  // ---- No pull · nationwide ----
  { name: "Secured starter card", cat: "Credit card · secured", pull: "none", min: 300, avail: "all",
    desc: "Refundable deposit becomes your limit. Approval generally not based on score." },
  { name: "Credit-builder loan", cat: "Loan · builder", pull: "none", min: 300, avail: "all",
    desc: "Funds held in a locked account while you pay it off. Reports to bureaus." },
  { name: "Debit-linked 'build credit' card", cat: "Credit card · alt-data", pull: "none", min: 300, avail: "all",
    desc: "Uses your bank cash flow instead of a credit pull to set a limit." },

  // ---- Soft pull (prequalify) · nationwide ----
  { name: "Entry rewards card (prequalify)", cat: "Credit card · rewards", pull: "soft", min: 580, avail: "all",
    desc: "Soft-pull preapproval check before you formally apply." },
  { name: "Store / retail card", cat: "Credit card · retail", pull: "soft", min: 600, avail: "all",
    desc: "Many retail cards offer a soft-pull prequalify and approve thinner files." },
  { name: "Personal loan marketplace", cat: "Loan · personal", pull: "soft", min: 600, avail: "all",
    desc: "Check estimated rates across lenders with a soft pull, then choose one." },
  { name: "Mid-tier cash-back card (prequalify)", cat: "Credit card · cash back", pull: "soft", min: 660, avail: "all",
    desc: "Solid cash back; soft-pull prequalify tool available." },
  { name: "Auto refinance (prequalify)", cat: "Loan · auto", pull: "soft", min: 640, avail: "all",
    desc: "See refinance estimates without a hard inquiry up front." },

  // ---- Hard pull (formal application) · nationwide ----
  { name: "Travel rewards card", cat: "Credit card · travel", pull: "hard", min: 700, avail: "all",
    desc: "Strong sign-up bonuses. Application is a hard pull; good/excellent credit." },
  { name: "Premium metal card", cat: "Credit card · premium", pull: "hard", min: 740, avail: "all",
    desc: "High annual fee, top perks. Typically excellent credit only." },
  { name: "Low-APR personal loan", cat: "Loan · personal", pull: "hard", min: 680, avail: "all",
    desc: "Best rates go to strong scores; final application is a hard pull." },
  { name: "0% intro APR balance-transfer card", cat: "Credit card · balance transfer", pull: "hard", min: 690, avail: "all",
    desc: "Long 0% intro window; hard pull on application." },
  { name: "New-car auto loan (dealer)", cat: "Loan · auto", pull: "hard", min: 660, avail: "all",
    desc: "Dealer financing usually runs a hard inquiry (sometimes several)." },

  // ---- Regional credit unions & community banks (state-limited) ----
  // Southwest
  { name: "Desert Sun Credit Union — secured card", cat: "Credit union · secured", pull: "none", min: 300, avail: ["AZ", "NV", "NM"],
    desc: "Member-owned. No-pull secured card; open to residents of AZ, NV, NM." },
  { name: "Desert Sun Credit Union — auto loan", cat: "Credit union · auto", pull: "soft", min: 620, avail: ["AZ", "NV", "NM"],
    desc: "Soft-pull preapproval for members in the Southwest. Competitive rates." },
  // West Coast
  { name: "Pacific Coast FCU — rewards card", cat: "Credit union · rewards", pull: "soft", min: 640, avail: ["CA", "OR", "WA"],
    desc: "West-coast credit union; soft-pull prequalify, low APR for members." },
  { name: "Golden State Community Bank — personal loan", cat: "Community bank · personal", pull: "hard", min: 660, avail: ["CA"],
    desc: "California-only community bank. Flexible underwriting for local residents." },
  // Texas
  { name: "Lone Star Credit Union — credit-builder", cat: "Credit union · builder", pull: "none", min: 300, avail: ["TX"],
    desc: "Texas members only. No-pull credit-builder loan reports to all bureaus." },
  // Southeast
  { name: "Magnolia Community Bank — secured card", cat: "Community bank · secured", pull: "none", min: 300, avail: ["GA", "FL", "AL", "SC"],
    desc: "Southeast community bank; no-pull secured card for local residents." },
  // Northeast
  { name: "Empire State FCU — cash-back card", cat: "Credit union · cash back", pull: "soft", min: 650, avail: ["NY", "NJ", "CT"],
    desc: "Tri-state credit union; soft-pull prequalify with solid cash back." },
  // Midwest
  { name: "Great Lakes Community Bank — auto loan", cat: "Community bank · auto", pull: "soft", min: 630, avail: ["MI", "OH", "IL", "IN", "WI"],
    desc: "Great Lakes region bank; soft-pull auto preapproval for local residents." },
];

// All 50 states + DC, for the location dropdown.
const STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["DC","District of Columbia"],
  ["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],
  ["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],
  ["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],
  ["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],
  ["NH","New Hampshire"],["NJ","New Jersey"],["NM","New Mexico"],["NY","New York"],
  ["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],["OK","Oklahoma"],["OR","Oregon"],
  ["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],["SD","South Dakota"],
  ["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],
  ["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
];
