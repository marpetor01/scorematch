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
  { bank: "FirstStep Bank", account: "Secured Starter Card", cat: "Credit card · secured", pull: "none", min: 300, avail: "all",
    desc: "Refundable deposit becomes your limit. Approval generally not based on score." },
  { bank: "BuildUp Financial", account: "Credit-Builder Loan", cat: "Loan · builder", pull: "none", min: 300, avail: "all",
    desc: "Funds held in a locked account while you pay it off. Reports to bureaus." },
  { bank: "CashFlow Bank", account: "FlexBuild Debit Card", cat: "Credit card · alt-data", pull: "none", min: 300, avail: "all",
    desc: "Uses your bank cash flow instead of a credit pull to set a limit." },

  // ---- Soft pull (prequalify) · nationwide ----
  { bank: "Horizon Bank", account: "Everyday Rewards Card", cat: "Credit card · rewards", pull: "soft", min: 580, avail: "all",
    desc: "Soft-pull preapproval check before you formally apply." },
  { bank: "RetailOne", account: "Store Rewards Card", cat: "Credit card · retail", pull: "soft", min: 600, avail: "all",
    desc: "Many retail cards offer a soft-pull prequalify and approve thinner files." },
  { bank: "LendBridge", account: "Personal Loan Marketplace", cat: "Loan · personal", pull: "soft", min: 600, avail: "all",
    desc: "Check estimated rates across lenders with a soft pull, then choose one." },
  { bank: "Summit Bank", account: "CashBack Plus Card", cat: "Credit card · cash back", pull: "soft", min: 660, avail: "all",
    desc: "Solid cash back; soft-pull prequalify tool available." },
  { bank: "AutoLink Finance", account: "Auto Refinance Quote", cat: "Loan · auto", pull: "soft", min: 640, avail: "all",
    desc: "See refinance estimates without a hard inquiry up front." },

  // ---- Hard pull (formal application) · nationwide ----
  { bank: "Voyager Bank", account: "Travel Rewards Card", cat: "Credit card · travel", pull: "hard", min: 700, avail: "all",
    desc: "Strong sign-up bonuses. Application is a hard pull; good/excellent credit." },
  { bank: "Apex Financial", account: "Apex Metal Card", cat: "Credit card · premium", pull: "hard", min: 740, avail: "all",
    desc: "High annual fee, top perks. Typically excellent credit only." },
  { bank: "Meridian Bank", account: "Low-APR Personal Loan", cat: "Loan · personal", pull: "hard", min: 680, avail: "all",
    desc: "Best rates go to strong scores; final application is a hard pull." },
  { bank: "ClearRate Bank", account: "0% Intro Balance-Transfer Card", cat: "Credit card · balance transfer", pull: "hard", min: 690, avail: "all",
    desc: "Long 0% intro window; hard pull on application." },
  { bank: "DriveNow Auto", account: "New-Car Auto Loan", cat: "Loan · auto", pull: "hard", min: 660, avail: "all",
    desc: "Dealer financing usually runs a hard inquiry (sometimes several)." },

  // ---- Regional credit unions & community banks (state-limited) ----
  // Southwest
  { bank: "Desert Sun Credit Union", account: "Secured Visa Card", cat: "Credit union · secured", pull: "none", min: 300, avail: ["AZ", "NV", "NM"],
    desc: "Member-owned. No-pull secured card; open to residents of AZ, NV, NM." },
  { bank: "Desert Sun Credit Union", account: "Member Auto Loan", cat: "Credit union · auto", pull: "soft", min: 620, avail: ["AZ", "NV", "NM"],
    desc: "Soft-pull preapproval for members in the Southwest. Competitive rates." },
  // West Coast
  { bank: "Pacific Coast FCU", account: "Member Rewards Card", cat: "Credit union · rewards", pull: "soft", min: 640, avail: ["CA", "OR", "WA"],
    desc: "West-coast credit union; soft-pull prequalify, low APR for members." },
  { bank: "Golden State Community Bank", account: "Neighborhood Personal Loan", cat: "Community bank · personal", pull: "hard", min: 660, avail: ["CA"],
    desc: "California-only community bank. Flexible underwriting for local residents." },
  // Texas
  { bank: "Lone Star Credit Union", account: "Credit-Builder Loan", cat: "Credit union · builder", pull: "none", min: 300, avail: ["TX"],
    desc: "Texas members only. No-pull credit-builder loan reports to all bureaus." },
  // Southeast
  { bank: "Magnolia Community Bank", account: "Secured Starter Card", cat: "Community bank · secured", pull: "none", min: 300, avail: ["GA", "FL", "AL", "SC"],
    desc: "Southeast community bank; no-pull secured card for local residents." },
  // Northeast
  { bank: "Empire State FCU", account: "CashBack Member Card", cat: "Credit union · cash back", pull: "soft", min: 650, avail: ["NY", "NJ", "CT"],
    desc: "Tri-state credit union; soft-pull prequalify with solid cash back." },
  // Midwest
  { bank: "Great Lakes Community Bank", account: "Member Auto Loan", cat: "Community bank · auto", pull: "soft", min: 630, avail: ["MI", "OH", "IL", "IN", "WI"],
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
