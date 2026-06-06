/* ============================================================
   TRUSTLAYER DEMO — All interactivity + mock data
   Vanilla JS only, no framework
   ============================================================ */

// ── Mock data ───────────────────────────────────────────────────
const MOCK = {
  wallet:           "0x7099...C79C8",
  walletFull:       "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  score:            850,
  racha:            5,
  rewards:          1250,
  level:            "Platino",
  nftTokenId:       42,
  creditLimit:      5000000,
  creditAvailable:  3500000,
  creditScore:      820,
  trustScore:       710,
  avgScore:         820,
  connected:        false,
  analysisComplete: false,

  leaderboard: [
    { name: "Juan C. Pérez", score: 950, racha: 15, rewards: 1250, me: true },
    { name: "María G.",       score: 920, racha: 12, rewards: 980,  me: false },
    { name: "Carlos R.",      score: 890, racha: 9,  rewards: 760,  me: false },
    { name: "Laura M.",       score: 870, racha: 7,  rewards: 620,  me: false },
    { name: "Andrés P.",      score: 850, racha: 5,  rewards: 490,  me: false },
  ],

  activities: [
    { type: "payment",     icon: "💳", title: "Pago registrado",       desc: "$150,000 COP registrado exitosamente",        time: "Hace 2h" },
    { type: "reward",      icon: "🏆", title: "50 mMonad ganados",      desc: "Recompensa por pago a tiempo",               time: "Hace 2h" },
    { type: "achievement", icon: "⭐", title: "Insignia Oro desbloqueada", desc: "Alcanzaste nivel Platino",               time: "Hace 5h" },
    { type: "score",       icon: "📊", title: "Score actualizado",      desc: "Tu score aumentó a 850 puntos",              time: "Hace 24h" },
  ],

  notifications: [
    { type: "achievement", title: "¡Insignia desbloqueada!",  body: "Alcanzaste el nivel Platino",    time: "Hace 2h",   read: false },
    { type: "reward",      title: "50 mMonad ganados",         body: "Recompensa por pago a tiempo",  time: "Hace 5h",   read: false },
    { type: "payment",     title: "Pago registrado",           body: "$150,000 COP registrado",       time: "Hace 24h",  read: true  },
    { type: "score",       title: "15 pagos consecutivos",     body: "¡Racha récord personal!",       time: "Hace 2d",   read: true  },
  ],

  achievements: [
    { emoji: "🌱", name: "Primer Paso",      desc: "Primer NFT creado",              progress: 100, unlocked: true  },
    { emoji: "🔥", name: "Racha de 5",       desc: "5 pagos consecutivos",           progress: 100, unlocked: true  },
    { emoji: "💫", name: "Decena Perfecta",  desc: "10 pagos consecutivos",          progress: 50,  unlocked: false },
    { emoji: "🌟", name: "Quincena",         desc: "15 pagos consecutivos",          progress: 33,  unlocked: false },
    { emoji: "💎", name: "Veintena",         desc: "20 pagos consecutivos",          progress: 25,  unlocked: false },
    { emoji: "🏅", name: "Maestro",          desc: "Score mayor a 900",              progress: 94,  unlocked: false },
    { emoji: "👑", name: "Leyenda",          desc: "Score mayor a 950",              progress: 89,  unlocked: false },
  ],

  goals: [
    { name: "Score 900",           current: 850, target: 900,  days: 90, unit: "pts" },
    { name: "10 Pagos Consecutivos", current: 5,  target: 10,   days: 60, unit: ""   },
    { name: "2000 mMonad",         current: 1250, target: 2000, days: 120, unit: ""  },
  ],

  scoreHistory: [790, 810, 820, 835, 842, 850],
  avgHistory:   [780, 795, 800, 808, 815, 820],

  rewards_table: [
    { level: "Diamante", mult: "2.0×", min5: 120, min10: 280, min15: 480 },
    { level: "Platino",  mult: "1.5×", min5: 90,  min10: 210, min15: 360 },
    { level: "Oro",      mult: "1.2×", min5: 72,  min10: 168, min15: 288 },
    { level: "Plata",    mult: "1.0×", min5: 60,  min10: 140, min15: 240 },
    { level: "Bronce",   mult: "0.8×", min5: 48,  min10: 112, min15: 192 },
  ],

  walletListForModal: [],
};

// chart refs
let trendChart = null;
let pieChart   = null;

// ── Helpers ─────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }
function on(id, ev, fn) { const el = $(id); if (el) el.addEventListener(ev, fn); }
function fmt(n) { return n.toLocaleString("es-CO"); }
function getRiskLabel(score) {
  if (score >= 800) return ["Riesgo Bajo",    "risk-low"];
  if (score >= 600) return ["Riesgo Medio",   "risk-medium"];
  if (score >= 400) return ["Riesgo Alto",    "risk-high"];
  return               ["Riesgo Crítico", "risk-critical"];
}

// ── SVG Arc Gauge ───────────────────────────────────────────────
function buildGauge(score, colorClass) {
  const radius = 56, cx = 70, cy = 70;
  const circumference = Math.PI * radius; // half circle
  const pct = Math.min(score / 1000, 1);
  const filled = pct * circumference;
  const gap    = circumference - filled;
  // color mapping
  const colorMap = { "risk-low": "#00FF87", "risk-medium": "#FFAA00", "risk-high": "#FF8C00", "risk-critical": "#ff4444" };
  const color = colorMap[colorClass] || "#00FF87";
  return `
    <svg viewBox="0 0 140 90" class="gauge-svg">
      <path d="M 14 84 A ${radius} ${radius} 0 0 1 126 84"
        fill="none" stroke="#1A2332" stroke-width="12" stroke-linecap="round"/>
      <path d="M 14 84 A ${radius} ${radius} 0 0 1 126 84"
        fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
        stroke-dasharray="${filled} ${gap}" opacity="0.9"/>
      <text x="70" y="78" text-anchor="middle" fill="${color}" font-size="22" font-weight="900" font-family="sans-serif">${score}</text>
    </svg>`;
}

// ── Tab Switching ────────────────────────────────────────────────
function initTabs() {
  const btns   = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      $(btn.dataset.tab).classList.add("active");
      if (btn.dataset.tab === "tab-estadisticas") renderTrendChart();
      if (btn.dataset.tab === "tab-recompensas")  renderPieChart();
    });
  });
}

// ── Wallet Connect ───────────────────────────────────────────────
function initWalletConnect() {
  on("btn-connect", "click", () => {
    MOCK.connected = true;
    $("btn-connect").classList.add("hidden");
    $("wallet-area").classList.remove("hidden");
    $("trust-score-card").classList.remove("hidden");
    showToast("Wallet conectada (modo demo)", "success");
  });
  on("wallet-chip-btn", "click", openProfileModal);
}

// ── Notifications ─────────────────────────────────────────────────
function initNotifications() {
  const wrap     = document.querySelector(".notif-wrap");
  const dropdown = $("notif-dropdown");
  document.querySelector(".notif-wrap .btn-icon").addEventListener("click", e => {
    e.stopPropagation();
    dropdown.classList.toggle("hidden");
  });
  document.addEventListener("click", e => {
    if (!wrap.contains(e.target)) dropdown.classList.add("hidden");
  });
  // render items
  const list = $("notif-list");
  MOCK.notifications.forEach(n => {
    const div = document.createElement("div");
    div.className = "notif-item" + (n.read ? "" : " unread");
    div.innerHTML = `
      <div class="notif-dot ${n.read ? "read" : ""}"></div>
      <div>
        <div style="font-size:.8125rem;font-weight:600">${n.title}</div>
        <div style="font-size:.75rem;color:var(--muted)">${n.body}</div>
        <div style="font-size:.7rem;color:var(--muted);margin-top:2px">${n.time}</div>
      </div>`;
    list.appendChild(div);
  });
}

// ── Profile Modal ─────────────────────────────────────────────────
function openProfileModal() {
  $("modal-profile").classList.remove("hidden");
}
function initProfileModal() {
  on("profile-close", "click", () => $("modal-profile").classList.add("hidden"));
  $("modal-profile").addEventListener("click", e => { if (e.target === $("modal-profile")) $("modal-profile").classList.add("hidden"); });
}

// ── Investigation Flow ───────────────────────────────────────────
function initInvestigation() {
  on("btn-inv-yes", "click", () => {
    MOCK.walletListForModal = [MOCK.connected ? MOCK.walletFull : ""];
    renderWalletList();
    $("modal-wallet-form").classList.remove("hidden");
  });
  on("btn-inv-no", "click", () => {
    showToast("Mostrando tu score financiero actual", "info");
  });
}

// ── Wallet List Form Modal ───────────────────────────────────────
function renderWalletList() {
  const container = $("wallet-inputs");
  container.innerHTML = "";
  MOCK.walletListForModal.forEach((addr, i) => {
    const row = document.createElement("div");
    row.className = "wallet-input-row";
    row.innerHTML = `
      <input type="text" placeholder="0x..." value="${addr}" data-idx="${i}"
        style="flex:1;background:var(--bg-nested);border:1px solid var(--border);
               border-radius:8px;padding:9px 12px;color:var(--text);
               font-size:.8125rem;font-family:monospace;outline:none"/>
      ${i === 0 ? "" : `<button class="remove-wallet" data-idx="${i}">✕</button>`}`;
    container.appendChild(row);
  });
  container.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", e => { MOCK.walletListForModal[+e.target.dataset.idx] = e.target.value; });
  });
  container.querySelectorAll(".remove-wallet").forEach(btn => {
    btn.addEventListener("click", e => {
      MOCK.walletListForModal.splice(+e.target.dataset.idx, 1);
      renderWalletList();
    });
  });
}
function initWalletForm() {
  on("btn-add-wallet", "click", () => {
    if (MOCK.walletListForModal.length >= 5) { showToast("Máximo 5 wallets", "warn"); return; }
    MOCK.walletListForModal.push("");
    renderWalletList();
  });
  on("wallet-form-close", "click", () => $("modal-wallet-form").classList.add("hidden"));
  $("modal-wallet-form").addEventListener("click", e => {
    if (e.target === $("modal-wallet-form")) $("modal-wallet-form").classList.add("hidden");
  });
  on("btn-wallet-continue", "click", () => {
    const wallets = MOCK.walletListForModal.filter(w => w.trim());
    if (!wallets.length) { showToast("Agrega al menos una wallet", "warn"); return; }
    $("modal-wallet-form").classList.add("hidden");
    openPaymentModal(wallets);
  });
}

// ── Score Payment Modal ──────────────────────────────────────────
let paymentStep = 0;
function openPaymentModal(wallets) {
  paymentStep = 0;
  updatePaymentStep(wallets);
  $("modal-payment").classList.remove("hidden");
}
function updatePaymentStep(wallets) {
  const steps = ["Confirmar","Pagando","Generando","Listo"];
  // update stepper
  steps.forEach((label, i) => {
    const dot   = $(`step-dot-${i}`);
    const lbl   = $(`step-lbl-${i}`);
    const item  = $(`step-item-${i}`);
    dot.textContent  = i < paymentStep ? "✓" : i + 1;
    item.className   = "step-item" + (i < paymentStep ? " done" : i === paymentStep ? " active" : "");
  });
  // show/hide step panels
  document.querySelectorAll(".payment-step").forEach((p, i) => {
    p.classList.toggle("hidden", i !== paymentStep);
  });
  // fill wallet summary
  if (wallets && $("wallet-summary-list")) {
    $("wallet-summary-list").textContent = wallets.map(w =>
      w.length > 20 ? w.slice(0,10)+"..."+w.slice(-8) : w
    ).join("\n");
  }
}
function initPaymentModal() {
  on("payment-close", "click", () => $("modal-payment").classList.add("hidden"));
  $("modal-payment").addEventListener("click", e => {
    if (e.target === $("modal-payment")) $("modal-payment").classList.add("hidden");
  });
  on("btn-pay-generate", "click", () => {
    // advance through steps automatically
    paymentStep = 1; updatePaymentStep();
    setTimeout(() => { paymentStep = 2; updatePaymentStep(); }, 1800);
    setTimeout(() => {
      paymentStep = 3; updatePaymentStep();
      MOCK.analysisComplete = true;
      animateCounter("result-credit-score", 0, MOCK.creditScore, 1200);
      animateCounter("result-trust-score",  0, MOCK.trustScore,  1400);
    }, 3600);
  });
  on("btn-view-dashboard", "click", () => {
    $("modal-payment").classList.add("hidden");
    // switch to resumen tab
    document.querySelectorAll(".tab-btn")[0].click();
    $("trust-score-card").classList.remove("hidden");
    showToast("¡Scores generados y registrados on-chain!", "success");
  });
}
function animateCounter(id, from, to, duration) {
  const el = $(id); if (!el) return;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(from + (to - from) * easeOut(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ── Actions (checklist) ──────────────────────────────────────────
function initActions() {
  document.querySelectorAll(".action-item").forEach(item => {
    item.addEventListener("click", () => {
      const check = item.querySelector(".action-check");
      const text  = item.querySelector(".action-text");
      const done  = check.classList.toggle("done");
      text.classList.toggle("done", done);
      check.textContent = done ? "✓" : "";
    });
  });
}

// ── Quick Actions ────────────────────────────────────────────────
function initQuickActions() {
  document.querySelectorAll(".quick-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      showToast(btn.dataset.msg || "Acción ejecutada (modo demo)", "info");
    });
  });
}

// ── Goals progress bars ──────────────────────────────────────────
function renderGoals() {
  const container = $("goals-container");
  if (!container) return;
  container.innerHTML = MOCK.goals.map(g => {
    const pct = Math.round((g.current / g.target) * 100);
    return `
      <div class="goal-card">
        <div class="goal-header">
          <strong>${g.name}</strong>
          <span class="goal-deadline">⏱ ${g.days} días</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:.8125rem;margin-bottom:6px">
          <span style="color:var(--muted)">${fmt(g.current)}${g.unit} / ${fmt(g.target)}${g.unit}</span>
          <span style="color:var(--accent);font-weight:600">${pct}%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>`;
  }).join("");
}

// ── Achievements ─────────────────────────────────────────────────
function renderAchievements() {
  const container = $("achievements-grid");
  if (!container) return;
  container.innerHTML = MOCK.achievements.map(a => `
    <div class="ach-item ${a.unlocked ? "unlocked" : "locked"}">
      <div class="ach-emoji">${a.emoji}</div>
      <div class="ach-name">${a.name}</div>
      <div style="font-size:.75rem;color:var(--muted);margin-bottom:8px">${a.desc}</div>
      ${a.unlocked
        ? `<span class="badge badge-green">Desbloqueado</span>`
        : `<div style="margin-top:4px">
             <div class="progress-track" style="height:5px">
               <div class="progress-fill" style="width:${a.progress}%"></div>
             </div>
             <div style="font-size:.7rem;color:var(--muted);margin-top:3px;text-align:center">${a.progress}%</div>
           </div>`}
    </div>`).join("");
}

// ── Leaderboard ──────────────────────────────────────────────────
function renderLeaderboard() {
  const container = $("leaderboard-list");
  if (!container) return;
  const icons = ["🥇","🥈","🥉","4","5"];
  container.innerHTML = MOCK.leaderboard.map((u, i) => `
    <div class="lb-row ${u.me ? "me" : ""}">
      <div class="lb-rank">${icons[i]}</div>
      <div>
        <div style="font-weight:600;font-size:.875rem">${u.name} ${u.me ? '<span class="badge badge-green" style="font-size:.65rem">Tú</span>' : ""}</div>
        <div style="font-size:.75rem;color:var(--muted)">Racha ${u.racha} · ${fmt(u.rewards)} mMonad</div>
      </div>
      <div class="lb-score">${u.score}</div>
    </div>`).join("");
}

// ── Activity Feed ────────────────────────────────────────────────
function renderActivity() {
  const container = $("activity-list");
  if (!container) return;
  container.innerHTML = MOCK.activities.map(a => `
    <div class="activity-item">
      <div class="activity-icon ${a.type}">${a.icon}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.875rem">${a.title}</div>
        <div style="font-size:.8125rem;color:var(--muted)">${a.desc}</div>
      </div>
      <div class="activity-time">${a.time}</div>
    </div>`).join("");
}

// ── Trust Score Card (gauges) ────────────────────────────────────
function renderTrustScoreCard() {
  const creditRisk = getRiskLabel(MOCK.creditScore);
  const trustRisk  = getRiskLabel(MOCK.trustScore);

  $("gauge-credit").innerHTML = buildGauge(MOCK.creditScore, creditRisk[1]);
  $("gauge-trust").innerHTML  = buildGauge(MOCK.trustScore,  trustRisk[1]);

  $("credit-risk-label").textContent = creditRisk[0];
  $("credit-risk-label").className   = "gauge-risk " + creditRisk[1];
  $("trust-risk-label").textContent  = trustRisk[0];
  $("trust-risk-label").className    = "gauge-risk " + trustRisk[1];
}

// ── Trend Chart ──────────────────────────────────────────────────
function renderTrendChart() {
  const ctx = $("trend-chart");
  if (!ctx) return;
  if (trendChart) { trendChart.destroy(); }
  trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      datasets: [
        {
          label: "Tu Score",
          data: MOCK.scoreHistory,
          borderColor: "#00FF87", backgroundColor: "rgba(0,255,135,0.08)",
          borderWidth: 2.5, pointRadius: 4, pointBackgroundColor: "#00FF87",
          tension: 0.4, fill: true
        },
        {
          label: "Promedio",
          data: MOCK.avgHistory,
          borderColor: "#8B92A7", backgroundColor: "transparent",
          borderWidth: 1.5, pointRadius: 3, pointBackgroundColor: "#8B92A7",
          tension: 0.4, borderDash: [4, 4]
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#8B92A7", font: { size: 12 } } } },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#8B92A7" } },
        y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#8B92A7" }, min: 750, max: 1000 }
      }
    }
  });
}

// ── Pie Chart ────────────────────────────────────────────────────
function renderPieChart() {
  const ctx = $("pie-chart");
  if (!ctx) return;
  if (pieChart) { pieChart.destroy(); }
  pieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Pagos a tiempo", "Racha bonus", "Bonificación nivel"],
      datasets: [{
        data: [700, 350, 200],
        backgroundColor: ["#00FF87", "#00D9FF", "#FFAA00"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: "68%",
      plugins: { legend: { position: "right", labels: { color: "#8B92A7", font: { size: 12 }, padding: 12 } } }
    }
  });
}

// ── Rewards Calculator ───────────────────────────────────────────
function initRewardsCalc() {
  const slider = $("calc-slider");
  const valEl  = $("calc-display");
  const tbl    = $("calc-table-body");
  if (!slider || !tbl) return;

  function update() {
    const n = +slider.value;
    valEl.textContent = n;
    // simulate cumulative rewards for current Platino level (mult 1.5×)
    const mult = 1.5; const base = 50;
    let cumulative = MOCK.rewards;
    tbl.innerHTML = "";
    for (let i = 1; i <= n; i++) {
      const bonus = i % 5 === 0 ? 50 : 0;
      cumulative += Math.round(base * mult) + bonus;
      if (i <= 5 || i % 5 === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td style="padding:8px 14px;border-bottom:1px solid var(--border);color:var(--muted)">${i}</td>
          <td style="padding:8px 14px;border-bottom:1px solid var(--border)">${Math.round(base * mult)}</td>
          <td style="padding:8px 14px;border-bottom:1px solid var(--border);color:var(--gold)">${bonus}</td>
          <td style="padding:8px 14px;border-bottom:1px solid var(--border);color:var(--accent);font-weight:700">${fmt(cumulative)}</td>`;
        tbl.appendChild(tr);
      }
    }
  }
  slider.addEventListener("input", update);
  update();
}

// ── AI Chat ───────────────────────────────────────────────────────
const chatResponses = {
  hola:       "¡Hola! Soy tu asistente financiero TrustLayer. ¿En qué te puedo ayudar?",
  ayuda:      "Puedo ayudarte con: tu score financiero, recompensas mMonad, rachas de pagos y crédito disponible.",
  score:      `Tu Payment Score actual es <b>${MOCK.score}</b> (Nivel Platino). ¡Excelente! Estás en el top 15% de usuarios.`,
  recompensa: `Has acumulado <b>${fmt(MOCK.rewards)} mMonad</b>. Con tu multiplicador Platino (1.5×) ganas 75 mMonad por pago a tiempo.`,
  racha:      `Llevas <b>${MOCK.racha} pagos consecutivos</b>. ¡A 5 más desbloqueas el bonus de Decena Perfecta!`,
  crédito:    `Tienes <b>$${fmt(MOCK.creditAvailable)} COP</b> disponibles de un límite de $${fmt(MOCK.creditLimit)} COP a 1.8% mensual.`,
  nivel:      `Eres nivel <b>Platino</b>. Para llegar a Diamante necesitas un score de 950+ puntos.`,
};
function initChat() {
  const btn    = $("ai-chat-btn");
  const panel  = $("ai-chat-panel");
  const input  = $("chat-input-field");
  const send   = $("chat-send");
  const msgs   = $("chat-messages");

  btn.addEventListener("click", () => panel.classList.toggle("hidden"));
  on("chat-close", "click", () => panel.classList.add("hidden"));

  function sendMessage() {
    const text = input.value.trim(); if (!text) return;
    appendMsg("user", text); input.value = "";
    setTimeout(() => {
      const key = Object.keys(chatResponses).find(k => text.toLowerCase().includes(k));
      appendMsg("bot", key ? chatResponses[key] : "Escribe: score, recompensa, racha, crédito, nivel o ayuda.");
    }, 600);
  }
  function appendMsg(role, text) {
    const div = document.createElement("div");
    div.className = "chat-msg " + role;
    div.innerHTML = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
  send.addEventListener("click", sendMessage);
  input.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

  // initial bot greeting
  appendMsg("bot", "¡Hola! Soy tu asistente TrustLayer 🤖 Pregúntame sobre tu score, recompensas o racha.");
}

// ── Toast ──────────────────────────────────────────────────────
function showToast(msg, type = "info") {
  let container = $("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    Object.assign(container.style, { position: "fixed", bottom: "90px", left: "50%", transform: "translateX(-50%)", zIndex: "9999", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" });
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  const colors = { success: "#00FF87", info: "#00D9FF", warn: "#FFAA00", error: "#ff4444" };
  Object.assign(toast.style, {
    background: "var(--bg-card)", border: `1px solid ${colors[type] || colors.info}`,
    borderRadius: "10px", padding: "10px 20px", color: "var(--text)", fontSize: ".875rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)", animation: "modal-in .25s ease",
    whiteSpace: "nowrap"
  });
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Rewards Table (static) ────────────────────────────────────────
function renderRewardsTable() {
  const tbody = $("rewards-tbody");
  if (!tbody) return;
  tbody.innerHTML = MOCK.rewards_table.map(r => `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid var(--border);font-weight:600">${r.level}</td>
      <td style="padding:12px 14px;border-bottom:1px solid var(--border);color:var(--accent)">${r.mult}</td>
      <td style="padding:12px 14px;border-bottom:1px solid var(--border)">${r.min5}</td>
      <td style="padding:12px 14px;border-bottom:1px solid var(--border)">${r.min10}</td>
      <td style="padding:12px 14px;border-bottom:1px solid var(--border)">${r.min15}</td>
    </tr>`).join("");
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initWalletConnect();
  initNotifications();
  initProfileModal();
  initInvestigation();
  initWalletForm();
  initPaymentModal();
  initActions();
  initQuickActions();
  renderGoals();
  renderAchievements();
  renderLeaderboard();
  renderActivity();
  renderTrustScoreCard();
  renderRewardsTable();
  initRewardsCalc();
  initChat();
});
