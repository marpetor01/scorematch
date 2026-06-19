(function () {
  const scoreInput = document.getElementById("score");
  const slider = document.getElementById("slider");
  const bandrow = document.getElementById("bandrow");
  const checkBtn = document.getElementById("checkBtn");
  const results = document.getElementById("results");
  const resultsTitle = document.getElementById("resultsTitle");
  const cards = document.getElementById("cards");
  const filters = document.getElementById("filters");
  const stateSelect = document.getElementById("state");

  let activePull = "all";

  // Populate the state dropdown from the STATES list in lenders.js
  STATES.forEach(([code, name]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = name;
    stateSelect.appendChild(opt);
  });

  // Is this lender available to someone in `state`?
  // No state selected -> only show nationwide options.
  function availableIn(lender, state) {
    if (lender.avail === "all") return true;
    if (!state) return false;
    return lender.avail.includes(state);
  }

  function bandName(score) {
    if (score >= 800) return "Exceptional";
    if (score >= 740) return "Very good";
    if (score >= 670) return "Good";
    if (score >= 580) return "Fair";
    return "Poor / building";
  }

  // How likely approval is, given how far the score clears the lender's floor.
  function likelihood(score, min) {
    const gap = score - min;
    if (gap < 0) return null;            // below floor — exclude
    if (gap >= 40) return { key: "high", label: "Likely" };
    if (gap >= 15) return { key: "mid", label: "Possible" };
    return { key: "low", label: "Borderline" };
  }

  function pullLabel(pull) {
    return pull === "none" ? "No pull" : pull === "soft" ? "Soft pull" : "Hard pull";
  }

  function clampScore(v) {
    v = parseInt(v, 10);
    if (isNaN(v)) return null;
    return Math.min(850, Math.max(300, v));
  }

  function render(score) {
    const state = stateSelect.value;
    const matches = LENDERS
      .map((l) => ({ ...l, like: likelihood(score, l.min) }))
      .filter((l) => l.like !== null)
      .filter((l) => activePull === "all" || l.pull === activePull)
      .filter((l) => availableIn(l, state))
      .sort((a, b) => {
        // Local (state-specific) options surface above nationwide ones.
        const aLocal = a.avail !== "all", bLocal = b.avail !== "all";
        if (aLocal !== bLocal) return aLocal ? -1 : 1;
        const order = { none: 0, soft: 1, hard: 2 };
        if (order[a.pull] !== order[b.pull]) return order[a.pull] - order[b.pull];
        return b.min - a.min; // within a pull type, stronger options first
      });

    const stateName = state ? STATES.find((s) => s[0] === state)[1] : null;
    const where = stateName ? ` in ${stateName}` : "";

    results.hidden = false;
    resultsTitle.textContent =
      `Score ${score} · ${bandName(score)}${where} — ${matches.length} match${matches.length === 1 ? "" : "es"}`;

    if (matches.length === 0) {
      cards.innerHTML = `<p class="empty">No matches for this filter at this score. Try "All", or building with a no-pull option first.</p>`;
      return;
    }

    cards.innerHTML = matches
      .map(
        (l) => `
      <div class="card">
        <div>
          <div class="bank">${l.bank}</div>
          <h4>${l.account}</h4>
          <div class="cat">${l.cat}</div>
        </div>
        <div class="badges">
          ${l.avail !== "all" ? `<span class="pill local">Local${stateName ? " · " + state : ""}</span>` : ""}
          <span class="pill ${l.pull}">${pullLabel(l.pull)}</span>
          <span class="likely ${l.like.key}">${l.like.label}</span>
        </div>
        <div class="desc">${l.desc}</div>
      </div>`
      )
      .join("");
  }

  function currentScore() {
    return clampScore(scoreInput.value) ?? parseInt(slider.value, 10);
  }

  function updateBand() {
    const s = currentScore();
    bandrow.innerHTML =
      `<span>300</span><span class="cur">${s} · ${bandName(s)}</span><span>850</span>`;
  }

  function go() {
    const s = currentScore();
    updateBand();
    render(s);
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Sync slider <-> number input
  slider.addEventListener("input", () => {
    scoreInput.value = slider.value;
    updateBand();
    if (!results.hidden) render(currentScore());
  });
  scoreInput.addEventListener("input", () => {
    const s = clampScore(scoreInput.value);
    if (s !== null) slider.value = s;
    updateBand();
  });
  scoreInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") go();
  });

  stateSelect.addEventListener("change", () => {
    if (!results.hidden) render(currentScore());
  });

  checkBtn.addEventListener("click", go);

  filters.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activePull = chip.dataset.pull;
    [...filters.children].forEach((c) => c.classList.toggle("active", c === chip));
    if (!results.hidden) render(currentScore());
  });

  updateBand();
})();
