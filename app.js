(function () {
  const $ = (id) => document.getElementById(id);
  const slider = $("slider");
  const scoreVal = $("scoreVal");
  const ratePill = $("ratePill");
  const goalSel = $("goal");
  const analyzeBtn = $("analyzeBtn");

  const advisor = $("advisor");
  const simNote = $("simNote");
  const marketplace = $("marketplace");

  let PRODUCTS = [];      // flattened {institution, website, ...product}
  let started = false;    // has the user analyzed once?
  let activeFilter = "all";

  // Flatten marketplace.json into one product list.
  function flatten(data) {
    const out = [];
    data.institutions.forEach((inst) => {
      inst.products.forEach((p) => {
        out.push({ institution: inst.institution, website: inst.website, ...p });
      });
    });
    return out;
  }

  function score() { return parseInt(slider.value, 10); }

  function updateHead() {
    const s = score();
    scoreVal.textContent = s;
    const r = Advisor.rating(s);
    ratePill.textContent = r.label;
  }

  function aprText(p) {
    return `${p.aprLow.toFixed(1)}–${p.aprHigh.toFixed(1)}%`;
  }
  function pullLabel(pull) {
    return pull === "none" ? "No Pull" : pull === "soft" ? "Soft Pull" : "Hard Pull";
  }

  // Filter predicate for the marketplace chips.
  function passesFilter(p) {
    switch (activeFilter) {
      case "all": return true;
      case "none": return p.pull === "none";
      case "soft": return p.pull === "soft";
      case "hard": return p.pull === "hard";
      case "credit_card": return p.category === "credit_card";
      case "loan": return p.category === "loan";
      case "credit_builder": return p.category === "credit_builder";
      default: return true;
    }
  }

  function reasonFor(p, s, goal) {
    if (p.goals.includes(goal)) return `Matches your goal and your score of ${s} clears its typical ${p.minScore}+ range.`;
    if (p.pull !== "hard") return `Soft-pull option you can check with zero score impact.`;
    return `In reach for your score; compare its APR before a hard inquiry.`;
  }
  function eligibilityFor(p, s) {
    const gap = s - p.minScore;
    if (gap >= 40) return `Comfortably above its ~${p.minScore} typical minimum.`;
    if (gap >= 0) return `Just within range of its ~${p.minScore} typical minimum.`;
    return `Typically needs ~${p.minScore}; you're ${Math.abs(gap)} below — possible with strong income/history.`;
  }

  function cardHTML(p, s, goal, dim) {
    return `
    <article class="card ${dim ? "dim" : ""}">
      <div class="card-top">
        <div>
          <div class="inst">${p.institution}</div>
          <h4>${p.name}</h4>
          <div class="cat">${p.subtype.replace(/_/g, " ")} · ${p.category.replace(/_/g, " ")}</div>
        </div>
        <div class="badges">
          <span class="likebadge ${p.tier.key}">${p.tier.label} · ${p.confidence}%</span>
          <span class="pill ${p.pull}">${pullLabel(p.pull)}</span>
        </div>
      </div>
      <div class="card-meta">
        <div class="metaitem"><div class="k">Est. APR</div><div class="v">${aprText(p)}</div></div>
        <div class="metaitem"><div class="k">Min score</div><div class="v">${p.minScore}</div></div>
        <div class="metaitem"><div class="k">Inquiry</div><div class="v">${pullLabel(p.pull)}</div></div>
      </div>
      <div class="reason">💡 ${reasonFor(p, s, goal)}</div>
      <p class="eligibility">${eligibilityFor(p, s)}</p>
      <a class="visit" href="${p.website}" target="_blank" rel="noopener noreferrer">Visit lender →</a>
    </article>`;
  }

  function renderAdvisor(a) {
    $("advisorRating").textContent = `${a.rating.label} credit · ${a.goalLabel}`;
    $("advisorSummary").textContent =
      `Based on a score of ${a.score} in Arizona, here's where you stand and what to do next.`;

    // Animate the confidence ring + number.
    const ring = $("confRing");
    ring.style.setProperty("--pct", a.headlineConfidence);
    animateNum($("confVal"), a.headlineConfidence);

    $("nextSteps").innerHTML = a.nextSteps.map((s) => `<li>${s}</li>`).join("");
    $("improvements").innerHTML = a.improvements
      .map((r) => `<li><span class="tip">${r.tip}</span><div class="impact">${r.impact}</div></li>`)
      .join("");
  }

  function renderMarketplace(a, s, goal) {
    const likely = a.likely.filter(passesFilter);
    const unlikely = a.unlikely.filter(passesFilter);

    $("likelyCards").innerHTML = likely.length
      ? likely.map((p) => cardHTML(p, s, goal, false)).join("")
      : `<p class="empty">No likely matches for this filter at score ${s}. Try "All".</p>`;

    const unlikelyLabel = $("unlikelyLabel");
    if (unlikely.length) {
      unlikelyLabel.hidden = false;
      $("unlikelyCards").innerHTML = unlikely.map((p) => cardHTML(p, s, goal, true)).join("");
    } else {
      unlikelyLabel.hidden = true;
      $("unlikelyCards").innerHTML = "";
    }
  }

  function run(scrollTo) {
    const s = score();
    const goal = goalSel.value;
    const analysis = Advisor.analyze(s, goal, PRODUCTS);
    renderAdvisor(analysis);
    renderMarketplace(analysis, s, goal);

    [advisor, simNote, marketplace].forEach((el) => {
      el.hidden = false;
      el.classList.remove("reveal");
      // reflow to restart animation
      void el.offsetWidth;
      el.classList.add("reveal");
    });
    started = true;

    if (scrollTo) advisor.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function animateNum(el, target) {
    const start = parseInt(el.textContent, 10) || 0;
    const dur = 700, t0 = performance.now();
    function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- events ----
  slider.addEventListener("input", () => {
    updateHead();
    if (started) run(false); // live simulator
  });
  goalSel.addEventListener("change", () => { if (started) run(false); });
  analyzeBtn.addEventListener("click", () => run(true));

  $("filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    [...e.currentTarget.children].forEach((c) => c.classList.toggle("active", c === chip));
    if (started) run(false);
  });

  // ---- boot ----
  updateHead();
  fetch("marketplace.json")
    .then((r) => r.json())
    .then((data) => {
      PRODUCTS = flatten(data);
      // #autorun renders results immediately (handy for demos/previews).
      if (location.hash === "#autorun") run(false);
    })
    .catch(() => {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "Couldn't load marketplace data";
    });
})();
