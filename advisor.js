/*
 * ScoreMatch — AI Credit Advisor (rules-based engine).
 *
 * Runs entirely in the browser: no API calls, no data leaves the device.
 * It is deterministic and explainable on purpose — every number can be traced
 * to a rule. Architected so a real LLM/underwriting backend can replace
 * `Advisor.analyze()` later without touching the UI.
 */
const Advisor = (function () {
  const GOALS = {
    credit_card: "Credit Card",
    auto_loan: "Auto Loan",
    personal_loan: "Personal Loan",
    credit_builder: "Credit Builder",
    mortgage: "Mortgage",
  };

  function rating(score) {
    if (score >= 800) return { label: "Excellent", key: "excellent" };
    if (score >= 740) return { label: "Very Good", key: "verygood" };
    if (score >= 670) return { label: "Good", key: "good" };
    if (score >= 580) return { label: "Fair", key: "fair" };
    return { label: "Poor", key: "poor" };
  }

  // Approval confidence for one product, 0-100.
  // Based on how far the score clears the product's minimum, softened by
  // whether it's a soft or hard pull (hard pulls underwrite more strictly).
  function confidence(score, product) {
    const gap = score - product.minScore;
    if (gap < 0) {
      // Below the floor: small, decaying chance the further below you are.
      return Math.max(2, Math.round(20 + gap / 3));
    }
    let base = 55 + gap * 0.9;               // clears the floor -> climbs
    if (product.pull === "soft" || product.pull === "none") base += 8;
    if (product.pull === "hard") base -= 4;
    // Bonus for sitting inside the product's recommended band.
    if (score >= product.recommended[0] && score <= product.recommended[1]) base += 6;
    return Math.max(5, Math.min(98, Math.round(base)));
  }

  function tier(conf) {
    if (conf >= 75) return { label: "Likely", key: "high" };
    if (conf >= 45) return { label: "Possible", key: "mid" };
    return { label: "Unlikely", key: "low" };
  }

  // Personalized next steps based on score band + goal.
  function nextSteps(score, goal) {
    const r = rating(score).key;
    const steps = [];

    if (r === "poor") {
      steps.push("Start with a secured card or credit-builder loan — both report to all three bureaus.");
      steps.push("Set every bill to autopay; payment history is 35% of your score.");
      steps.push("Avoid hard inquiries for now — each one can cost a few points while you rebuild.");
    } else if (r === "fair") {
      steps.push("Keep card balances under 30% of their limits — utilization is your fastest lever.");
      steps.push("Prefer soft-pull prequalification before any formal application.");
      steps.push("Give new accounts 3-6 months of on-time history before applying again.");
    } else if (r === "good") {
      steps.push("You qualify for most mainstream products — compare APRs, don't just take the first offer.");
      steps.push("Use soft-pull prequalify tools to confirm before a hard inquiry.");
      steps.push("Pushing utilization under 10% can move you into the 'very good' tier.");
    } else {
      steps.push("You're in strong territory — prioritize the lowest APR and best rewards, not just approval.");
      steps.push("Space out hard inquiries; even strong files dip slightly after several at once.");
      steps.push("Keep your oldest accounts open to protect your length-of-history.");
    }

    if (goal === "mortgage" && score < 680) {
      steps.unshift("For a mortgage, aim for 680+ before applying — it meaningfully lowers your rate.");
    }
    if (goal === "auto_loan" && score < 640) {
      steps.unshift("For an auto loan, 640+ unlocks far better rates; a co-signer can bridge the gap.");
    }
    return steps;
  }

  // Improvement recommendations: concrete, score-aware.
  function improvements(score) {
    const recs = [
      { tip: "Pay every bill on time", impact: "Highest impact — 35% of your score." },
      { tip: "Lower credit utilization below 30%", impact: "High impact — aim for under 10% if you can." },
    ];
    if (score < 670) {
      recs.push({ tip: "Keep old accounts open", impact: "Protects your average account age." });
      recs.push({ tip: "Limit new hard inquiries", impact: "Each can cost a few points for ~12 months." });
    } else {
      recs.push({ tip: "Request a credit-limit increase", impact: "Lowers utilization without new debt (ask for a soft-pull increase)." });
      recs.push({ tip: "Diversify your credit mix", impact: "A small installment loan can help a card-only file." });
    }
    return recs;
  }

  /*
   * Main entry point. Returns a full analysis object the UI renders.
   * `products` is the flat list of {institution, website, ...product} entries.
   */
  function analyze(score, goal, products) {
    const scored = products.map((p) => {
      const conf = confidence(score, p);
      return { ...p, confidence: conf, tier: tier(conf) };
    });

    const likely = scored
      .filter((p) => p.confidence >= 45)
      .sort((a, b) => b.confidence - a.confidence);
    const unlikely = scored
      .filter((p) => p.confidence < 45)
      .sort((a, b) => b.confidence - a.confidence);

    // Headline confidence = AVERAGE across all products that serve the user's
    // goal, not the single easiest one. This keeps it honest: a low score that
    // can only get a secured card still sees a modest headline because the
    // rewards/premium cards for that goal drag the average down.
    const onGoal = scored.filter((p) => p.goals.includes(goal));
    const pool = onGoal.length ? onGoal : scored;
    const headlineConfidence = Math.round(
      pool.reduce((sum, p) => sum + p.confidence, 0) / pool.length
    );

    return {
      score,
      goal,
      goalLabel: GOALS[goal] || "Any product",
      rating: rating(score),
      headlineConfidence,
      likely,
      unlikely,
      nextSteps: nextSteps(score, goal),
      improvements: improvements(score),
    };
  }

  return { analyze, rating, confidence, tier, GOALS };
})();
