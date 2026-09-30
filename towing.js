"use strict";

/* =========================================================
   Data / API layer
   Swap the functions inside `api` for real fetch() calls
   to a backend when one is available.
========================================================= */
const DB = {
  services: [
    { id: "tow",  n: "Towing",                ic: "ðŸš›", base: 65,  km: 3.2, d: "Local flatbed & wheel-lift towing", dest: 1 },
    { id: "tire", n: "Flat Tire",              ic: "ðŸ›ž", base: 45,  km: 0,   d: "Spare install or tire repair",      dest: 0 },
    { id: "jump", n: "Jump Start",             ic: "âš¡", base: 40,  km: 0,   d: "Dead battery? Back on the road",    dest: 0 },
    { id: "fuel", n: "Fuel Delivery",          ic: "â›½", base: 50,  km: 0,   d: "Up to 5 gallons delivered",         dest: 0 },
    { id: "batt", n: "Battery Assistance",     ic: "ðŸ”‹", base: 70,  km: 0,   d: "Test & on-site replacement",        dest: 0 },
    { id: "lock", n: "Vehicle Lockout",        ic: "ðŸ”‘", base: 55,  km: 0,   d: "Damage-free entry",                 dest: 0 },
    { id: "acc",  n: "Accident Recovery",      ic: "ðŸš§", base: 120, km: 4.5, d: "Winch-out & scene recovery",        dest: 1 },
    { id: "long", n: "Long-Distance Towing",   ic: "ðŸ›£ï¸", base: 150, km: 2.4, d: "Intercity, 50+ km",                 dest: 1 }
  ],

  mult: { car: 1, suv: 1.25, van: 1.45, heavy: 2.2, moto: 0.85 },

  zones: [
    { n: "Downtown",   x: 45, y: 45, r: 26, eta: 12, pop: "420k",    t: "Full coverage, 24/7" },
    { n: "Midtown",    x: 68, y: 30, r: 20, eta: 15, pop: "310k",    t: "Full coverage, 24/7" },
    { n: "Airport",    x: 82, y: 68, r: 17, eta: 18, pop: "90k",     t: "Priority dispatch" },
    { n: "North Hills",x: 25, y: 22, r: 19, eta: 22, pop: "150k",    t: "Coverage 6amâ€“midnight" },
    { n: "Harbor",     x: 20, y: 72, r: 18, eta: 20, pop: "120k",    t: "Full coverage, 24/7" },
    { n: "Highway 9",  x: 55, y: 82, r: 15, eta: 25, pop: "Corridor",t: "Highway patrol partner" }
  ],

  reviews: [
    ["Sarah K.", 5, "Truck arrived in 14 minutes at midnight. The driver was calm and professional.", "Towing"],
    ["Marcus D.", 5, "Live tracking meant I knew exactly when help would arrive. Fair price too.", "Jump Start"],
    ["Priya N.", 4, "Lockout solved without a scratch on the door. Would use again.", "Lockout"],
    ["Tom R.", 5, "Long-distance tow handled smoothly, updates all the way.", "Long-distance"]
  ],

  history: [
    { id: "RR-1042", s: "tow",  date: "2026-09-12", from: "5th Ave & Pine",     to: "Midtown Auto Care", cost: 142, st: "Completed", drv: "Daniel Osei" },
    { id: "RR-0987", s: "jump", date: "2026-08-03", from: "City Mall parking",  to: "â€”",                 cost: 40,  st: "Completed", drv: "Lena Park" },
    { id: "RR-0931", s: "tire", date: "2026-06-21", from: "Highway 9, km 42",   to: "â€”",                 cost: 52,  st: "Completed", drv: "Carlos Ruiz" },
    { id: "RR-0870", s: "lock", date: "2026-04-14", from: "Harbor Street 18",   to: "â€”",                 cost: 55,  st: "Cancelled", drv: "â€”" }
  ],

  vehicles: [
    { n: "Toyota Camry", p: "KJA-482", t: "car", y: 2021 },
    { n: "Ford Ranger",  p: "LND-119", t: "suv", y: 2019 }
  ],

  notes: [
    { m: "Welcome! Save your vehicles for faster requests.", r: 0 },
    { m: "Receipt for RR-1042 is ready.", r: 0 },
    { m: "New: Live driver tracking now available.", r: 1 }
  ],

  drivers: [
    { n: "Daniel Osei", r: 4.9, job: 1240, truck: "Flatbed Â· Ford F-550", plate: "TRK-207", ph: "+1 800 555 0207" },
    { n: "Lena Park",   r: 4.8, job: 980,  truck: "Wheel-lift Â· Ram 5500", plate: "TRK-118", ph: "+1 800 555 0118" }
  ]
};

const api = {
  delay(value, ms = 700) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
  },

  getServices() {
    return this.delay(DB.services, 0);
  },

  estimate({ service, vehicle, km }) {
    const s = DB.services.find(x => x.id === service);
    const dist = s.dest ? km * s.km : 0;
    const veh = DB.mult[vehicle];
    const sub = (s.base + dist) * veh;
    const eta = Math.round(12 + Math.min(km, 60) / 6);
    return { base: s.base, dist, veh, total: Math.round(sub), eta, s };
  },

  submitRequest(payload) {
    const id = "RR-" + (1100 + Math.floor(Math.random() * 90));
    const driver = DB.drivers[Math.floor(Math.random() * 2)];
    return this.delay({ id, driver, ...payload });
  },

  getHistory() {
    return this.delay(DB.history, 0);
  }
};

/* =========================================================
   Helpers
========================================================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function svcName(id) {
  const s = DB.services.find(s => s.id === id);
  return s ? s.n : id;
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  $("#toasts").append(el);
  setTimeout(() => el.remove(), 4200);
}

function modal(title, html) {
  $("#mt").textContent = title;
  $("#mb").innerHTML = html;
  $("#modal").classList.add("on");
  $("#mc").focus();
}

$("#mc").onclick = () => $("#modal").classList.remove("on");
$("#modal").onclick = e => {
  if (e.target.id === "modal") $("#modal").classList.remove("on");
};
document.addEventListener("keydown", e => {
  if (e.key === "Escape") $("#modal").classList.remove("on");
});

/* =========================================================
   Theme toggle & mobile nav
========================================================= */
try {
  const saved = localStorage.getItem("rr-theme");
  if (saved) document.documentElement.dataset.theme = saved;
} catch (e) {}

$("#theme").onclick = () => {
  const isDark = getComputedStyle(document.body).backgroundColor === "rgb(10, 18, 32)";
  const next = isDark ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("rr-theme", next); } catch (e) {}
};

$("#burger").onclick = e => {
  const open = $("#nav").classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", open);
};

$$("#nav a").forEach(a => {
  a.onclick = () => $("#nav").classList.remove("open");
});

/* =========================================================
   Services grid, form inputs, live price estimate
========================================================= */
let selected = "tow";

function renderServices() {
  $("#svcs").innerHTML = DB.services.map(s => `
    <button type="button" class="card svc ${s.id === selected ? "sel" : ""}"
            role="radio" aria-checked="${s.id === selected}" data-id="${s.id}">
      <div class="ic">${s.ic}</div>
      <h3>${s.n}</h3>
      <p>${s.d}</p>
      <span class="pr">from $${s.base}</span>
    </button>
  `).join("");

  $$(".svc").forEach(btn => {
    btn.onclick = () => {
      selected = btn.dataset.id;
      $("#service").value = selected;
      renderServices();
      updateEst();
      location.hash = "#request";
    };
  });
}

$("#service").innerHTML = DB.services
  .map(s => `<option value="${s.id}">${s.ic} ${s.n}</option>`)
  .join("");

function updateEst() {
  selected = $("#service").value;
  const e = api.estimate({
    service: selected,
    vehicle: $("#vehicle").value,
    km: +$("#km").value
  });

  $("#kmo").textContent = $("#km").value;
  $("#destg").style.display = e.s.dest ? "" : "none";
  $("#tot").textContent = "$" + e.total;
  $("#etaq").textContent = e.eta + " min";

  $("#brk").innerHTML = `
    <li><span>Base (${esc(e.s.n)})</span><span>$${e.base}</span></li>
    <li><span>Distance</span><span>$${e.dist.toFixed(0)}</span></li>
    <li><span>Vehicle Ã—${e.veh}</span><span>${e.veh === 1 ? "â€”" : "applied"}</span></li>
  `;

  $$(".svc").forEach(btn => {
    const on = btn.dataset.id === selected;
    btn.classList.toggle("sel", on);
    btn.setAttribute("aria-checked", on);
  });
}

["service", "vehicle", "km"].forEach(id => {
  $("#" + id).addEventListener("input", updateEst);
});

$("#loc").onclick = () => {
  const set = text => {
    $("#pickup").value = text;
    toast("Location detected: " + text);
    location.hash = "#request";
  };

  if (!navigator.geolocation) {
    set("Downtown, 5th Ave (sample)");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => set(pos.coords.latitude.toFixed(4) + ", " + pos.coords.longitude.toFixed(4)),
    () => set("Downtown, 5th Ave (sample)"),
    { timeout: 4000 }
  );
};

/* =========================================================
   Form validation
========================================================= */
function setErr(el, msg) {
  el.classList.toggle("bad", !!msg);
  el.setAttribute("aria-invalid", !!msg);
  const span = el.parentElement.querySelector(".err");
  if (span) span.textContent = msg || "";
}

function validate() {
  let ok = true;

  const check = (id, fn, msg) => {
    const el = $("#" + id);
    const bad = !fn(el.value.trim());
    setErr(el, bad ? msg : "");
    if (bad && ok) el.focus();
    ok = ok && !bad;
  };

  check("name", v => v.length >= 2, "Please enter your name");
  check("phone", v => /^[+()\d\s-]{7,18}$/.test(v), "Enter a valid phone number");
  check("pickup", v => v.length >= 4, "Pickup location is required");

  if ($("#destg").style.display !== "none") {
    check("dest", v => v.length >= 3, "Destination is required for this service");
  }

  return ok;
}

/* =========================================================
   Active request tracking, ETA countdown
========================================================= */
const STAGES = ["Request Received", "Driver Assigned", "En Route", "Arrived", "Service Completed"];
const ICONS = ["ðŸ“", "ðŸ‘·", "ðŸš›", "ðŸ“", "âœ…"];

let active = null;
let stage = 0;
let etaSec = 0;
let timers = [];

function renderActive() {
  const activeCard = $("#activeCard");
  const driverCard = $("#driverCard");

  if (!active) {
    activeCard.innerHTML = `
      <h3>Active request</h3>
      <p class="mute">No active request. If you need help, we'll dispatch a driver in seconds.</p>
      <a class="btn btn-p" href="#request">Request help</a>
    `;
    driverCard.innerHTML = `
      <h3>Assigned driver</h3>
      <p class="mute">Driver details will appear here once assigned.</p>
    `;
    return;
  }

  const mm = String(Math.floor(etaSec / 60)).padStart(2, "0");
  const ss = String(etaSec % 60).padStart(2, "0");

  activeCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h3 style="margin:0">Request ${active.id}</h3>
      <span class="pill ${stage === 4 ? "p-ok" : "p-wait"}">${STAGES[stage]}</span>
    </div>

    <div class="track" role="list" aria-label="Request progress">
      ${STAGES.map((name, i) => `
        <div class="stp ${i < stage ? "done" : i === stage ? "cur" : ""}" role="listitem">
          <i>${i < stage ? "âœ“" : ICONS[i]}</i>${name}
        </div>
      `).join("")}
    </div>

    <p class="mute" style="margin:16px 0 0">${stage === 4 ? "Completed" : "Estimated arrival"}</p>
    <div class="eta">${stage >= 3 ? (stage === 4 ? "Done" : "Arrived") : mm + ":" + ss}</div>

    <p>
      <b>Service:</b> ${esc(svcName(active.service))}<br>
      <b>Pickup:</b> ${esc(active.pickup)}<br>
      <b>Destination:</b> ${esc(active.dest || "â€”")}<br>
      <b>Estimate:</b> $${active.total}
    </p>

    ${stage < 4
      ? `<button class="btn btn-g" id="cancel">Cancel request</button>`
      : `<button class="btn btn-p" id="rate">Rate your service</button>`}
  `;

  const dr = active.driver;

  driverCard.innerHTML = stage < 1
    ? `<h3>Assigned driver</h3><p class="mute">Finding the nearest driverâ€¦</p>`
    : `
      <h3>Assigned driver</h3>
      <div class="drv">
        <div class="av">${dr.n.split(" ").map(x => x[0]).join("")}</div>
        <div><b>${dr.n}</b><br><span class="stars">â˜…â˜…â˜…â˜…â˜…</span> ${dr.r} Â· ${dr.job} jobs</div>
      </div>
      <p style="margin:14px 0">
        <b>Truck:</b> ${dr.truck}<br>
        <b>Plate:</b> ${dr.plate}
      </p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="btn btn-p" href="tel:${dr.ph.replace(/\s/g, "")}">ðŸ“ž Call</a>
        <button class="btn btn-g" id="msg">ðŸ’¬ Message</button>
      </div>
    `;

  const cancelBtn = $("#cancel");
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      modal("Cancel request?", `
        <p>Are you sure you want to cancel ${active.id}?</p>
        <button class="btn btn-d" id="yes" style="width:100%">Yes, cancel</button>
      `);
      $("#yes").onclick = () => {
        clearAll();
        active = null;
        $("#modal").classList.remove("on");
        toast("Request cancelled");
        renderActive();
      };
    };
  }

  const msgBtn = $("#msg");
  if (msgBtn) {
    msgBtn.onclick = () => {
      modal("Message " + dr.n, `
        <textarea rows="3" placeholder="e.g. I'm in the silver Camry by the gas station"></textarea>
        <button class="btn btn-p" style="width:100%;margin-top:10px"
          onclick="document.getElementById('modal').classList.remove('on');toast('Message sent')">
          Send
        </button>
      `);
    };
  }

  const rateBtn = $("#rate");
  if (rateBtn) {
    rateBtn.onclick = () => {
      modal("Rate your service", `
        <p>How was ${esc(dr.n)}?</p>
        <div style="font-size:2rem" class="stars">â˜…â˜…â˜…â˜…â˜…</div>
        <button class="btn btn-p" style="width:100%"
          onclick="document.getElementById('modal').classList.remove('on');toast('Thanks for your feedback!')">
          Submit
        </button>
      `);
    };
  }
}

function clearAll() {
  timers.forEach(clearInterval);
  timers.forEach(clearTimeout);
  timers = [];
}

function startTracking() {
  clearAll();
  stage = 0;
  etaSec = active.eta * 60;
  renderActive();

  const advance = (n, msg) => {
    stage = n;
    pushNote(msg);
    toast(msg);
    renderActive();
  };

  timers.push(setTimeout(() => advance(1, "Driver assigned: " + active.driver.n), 3000));
  timers.push(setTimeout(() => advance(2, "Your driver is en route"), 7000));

  timers.push(setInterval(() => {
    if (stage >= 1 && stage < 3 && etaSec > 0) {
      etaSec -= 1;
      renderActive();
    }
  }, 1000));

  timers.push(setTimeout(() => {
    etaSec = 0;
    advance(3, "Driver has arrived at your location");
  }, 25000));

  timers.push(setTimeout(() => {
    advance(4, "Service completed. Thank you!");
    DB.history.unshift({
      id: active.id,
      s: active.service,
      date: new Date().toISOString().slice(0, 10),
      from: active.pickup,
      to: active.dest || "â€”",
      cost: active.total,
      st: "Completed",
      drv: active.driver.n
    });
    renderHistory();
  }, 40000));
}

/* =========================================================
   Form submission
========================================================= */
$("#form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!validate()) return;

  const btn = e.submitter;
  btn.disabled = true;
  btn.textContent = "Dispatchingâ€¦";

  const est = api.estimate({
    service: $("#service").value,
    vehicle: $("#vehicle").value,
    km: +$("#km").value
  });

  active = await api.submitRequest({
    service: $("#service").value,
    pickup: $("#pickup").value.trim(),
    dest: $("#dest").value.trim(),
    total: est.total,
    eta: est.eta,
    vehicle: $("#vehicle").value
  });

  btn.disabled = false;
  btn.textContent = "Request Help Now";

  modal("Request received âœ…", `
    <p>Your request <b>${active.id}</b> is confirmed. Estimated cost <b>$${est.total}</b>,
       arrival in about <b>${est.eta} min</b>.</p>
    <p class="mute">Track live progress in your dashboard.</p>
  `);

  pushNote("Request " + active.id + " received");
  startTracking();
  showTab("active");

  setTimeout(() => {
    $("#modal").classList.remove("on");
    location.hash = "#dashboard";
  }, 1800);
});

/* =========================================================
   Dashboard tabs
========================================================= */
const TABS = [
  ["active", "Active request"],
  ["history", "History"],
  ["vehicles", "Vehicles"],
  ["notes", "Notifications"],
  ["profile", "Profile"]
];

$("#tabs").innerHTML = TABS.map(([key, label]) => `
  <button class="tab" role="tab" data-k="${key}" aria-selected="${key === "active"}">
    ${label}<span id="badge-${key}"></span>
  </button>
`).join("");

function showTab(key) {
  $$(".tab").forEach(t => t.setAttribute("aria-selected", t.dataset.k === key));
  $$(".pan").forEach(p => p.classList.toggle("on", p.id === "p-" + key));
}

$$(".tab").forEach(t => {
  t.onclick = () => showTab(t.dataset.k);
});

/* --- History tab --- */
function renderHistory() {
  const q = $("#q").value.toLowerCase();
  const f = $("#fs").value;

  const rows = DB.history.filter(h =>
    (!f || h.s === f) &&
    (!q || JSON.stringify(h).toLowerCase().includes(q) || svcName(h.s).toLowerCase().includes(q))
  );

  $("#hist").innerHTML = rows.length
    ? rows.map(h => `
        <button class="hi" data-id="${h.id}">
          <div>
            <b>${svcName(h.s)}</b> <span class="pill ${h.st === "Completed" ? "p-ok" : "p-x"}">${h.st}</span><br>
            <small class="mute">${h.id} Â· ${h.date} Â· ${esc(h.from)}</small>
          </div>
          <b>$${h.cost}</b>
        </button>
      `).join("")
    : `<p class="mute">No matching requests.</p>`;

  $$(".hi").forEach(btn => {
    btn.onclick = () => {
      const h = DB.history.find(x => x.id === btn.dataset.id);
      modal(h.id + " Â· " + svcName(h.s), `
        <p>
          <b>Date:</b> ${h.date}<br>
          <b>Pickup:</b> ${esc(h.from)}<br>
          <b>Destination:</b> ${esc(h.to)}<br>
          <b>Driver:</b> ${esc(h.drv)}<br>
          <b>Total:</b> $${h.cost}<br>
          <b>Status:</b> ${h.st}
        </p>
        <button class="btn btn-p" style="width:100%" id="again">Request again</button>
      `);

      $("#again").onclick = () => {
        $("#service").value = h.s;
        $("#pickup").value = h.from;
        $("#dest").value = h.to === "â€”" ? "" : h.to;
        updateEst();
        $("#modal").classList.remove("on");
        location.hash = "#request";
      };
    };
  });
}

$("#fs").innerHTML += DB.services.map(s => `<option value="${s.id}">${s.n}</option>`).join("");
$("#q").oninput = renderHistory;
$("#fs").onchange = renderHistory;

/* --- Vehicles tab --- */
function renderVeh() {
  $("#veh").innerHTML = DB.vehicles.map((v, i) => `
    <div class="card">
      <h3>ðŸš— ${esc(v.n)}</h3>
      <p class="mute">${v.y} Â· Plate ${esc(v.p)} Â· ${v.t}</p>
      <button class="btn btn-g use" data-i="${i}">Use for request</button>
    </div>
  `).join("");

  $$(".use").forEach(btn => {
    btn.onclick = () => {
      $("#vehicle").value = DB.vehicles[btn.dataset.i].t;
      updateEst();
      toast("Vehicle applied to your request");
      location.hash = "#request";
    };
  });
}

$("#addv").onclick = () => {
  modal("Add vehicle", `
    <div class="fg"><label for="vn">Make & model</label><input id="vn"></div>
    <div class="fg"><label for="vp">Plate</label><input id="vp"></div>
    <button class="btn btn-p" style="width:100%" id="sv">Save vehicle</button>
  `);

  $("#sv").onclick = () => {
    if ($("#vn").value.trim().length < 2) {
      $("#vn").focus();
      return;
    }
    DB.vehicles.push({
      n: $("#vn").value.trim(),
      p: $("#vp").value.trim() || "â€”",
      t: "car",
      y: "â€”"
    });
    renderVeh();
    $("#modal").classList.remove("on");
    toast("Vehicle saved");
  };
};

/* --- Notifications tab --- */
function pushNote(msg) {
  DB.notes.unshift({ m: msg, r: 0 });
  renderNotes();
}

function renderNotes() {
  const unread = DB.notes.filter(n => !n.r).length;
  $("#badge-notes").textContent = unread ? " (" + unread + ")" : "";

  $("#notes-list").innerHTML = DB.notes.map((n, i) => `
    <div class="nt ${n.r ? "read" : ""}" data-i="${i}">ðŸ”” <span>${esc(n.m)}</span></div>
  `).join("");

  $$(".nt").forEach(el => {
    el.onclick = () => {
      DB.notes[el.dataset.i].r = 1;
      renderNotes();
    };
  });
}

$("#readall").onclick = () => {
  DB.notes.forEach(n => n.r = 1);
  renderNotes();
};

/* --- Profile tab --- */
$("#prof").onsubmit = e => {
  e.preventDefault();
  toast("Profile saved");
};

/* =========================================================
   Coverage map
========================================================= */
let zsel = 0;

function renderZones() {
  $("#zchips").innerHTML = DB.zones.map((z, i) => `
    <button class="chip" aria-pressed="${i === zsel}" data-i="${i}">${z.n}</button>
  `).join("");

  $("#map").innerHTML = DB.zones.map((z, i) => `
    <div class="zone ${i === zsel ? "on" : ""}" role="button" tabindex="0" data-i="${i}"
         style="left:${z.x}%;top:${z.y}%;
                 width:${z.r * 2.4}%;height:${z.r * 2.4}%;
                 max-width:${z.r * 5}px;max-height:${z.r * 5}px;
                 min-width:${z.r * 3}px;min-height:${z.r * 3}px">
      ${z.n}
    </div>
  `).join("");

  const z = DB.zones[zsel];
  $("#zinfo").innerHTML = `
    <h3>ðŸ“ ${z.n}</h3>
    <p class="mute">${z.t}</p>
    <p><b>Average arrival:</b> ${z.eta} min<br><b>Population served:</b> ${z.pop}</p>
    <a href="#request" class="btn btn-p">Request in ${z.n}</a>
  `;

  $$("#zchips .chip, .zone").forEach(el => {
    el.onclick = () => {
      zsel = +el.dataset.i;
      renderZones();
    };
    el.onkeydown = e => {
      if (e.key === "Enter") el.click();
    };
  });
}

/* =========================================================
   Reviews
========================================================= */
$("#rev").innerHTML = DB.reviews.map(r => `
  <div class="card">
    <div class="stars" aria-label="${r[1]} stars">${"â˜…".repeat(r[1])}${"â˜†".repeat(5 - r[1])}</div>
    <p>â€œ${esc(r[2])}â€</p>
    <b>${esc(r[0])}</b> <span class="pill p-ok">âœ” Verified Â· ${esc(r[3])}</span>
  </div>
`).join("");

/* =========================================================
   Live availability wobble
========================================================= */
setInterval(() => {
  const n = +$("#avail").textContent;
  const next = n + (Math.random() > 0.5 ? 1 : -1);
  $("#avail").textContent = Math.max(9, Math.min(19, next));
}, 5000);

/* =========================================================
   Init
========================================================= */
renderServices();
$("#service").value = selected;
updateEst();
renderActive();
renderHistory();
renderVeh();
renderNotes();
renderZones();