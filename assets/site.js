/* AFC Tickton Hawks U12s — shared header, page tabs, formation choice and footer.
   Every page loads this at the very top of <body>, with its own heading in data-* attributes:
   <script src="assets/site.js" data-page="corners" data-eyebrow="..." data-h1="..." data-l2="..." data-sub="..."></script>
   To add, remove or rename a page tab, edit PAGES below.
   A page with a parent (e.g. "game-day") sits under that tab: on its children, a second row of tabs
   lists them. A tab with a fourth entry opens that page instead (Game Day opens Roles).
   The formation switch sits at the right-hand end of the top tab bar on every page. */
(function(){
  "use strict";

  var TEAM = "AFC Tickton Hawks U12s";
  var FOOTER_NAME = "Tickton Hawks U12 Girls";

  /* [file name, tab label, parent tab, page the tab opens] */
  var PAGES = [
    ["index", "Home"],
    ["game-day", "Game Day", null, "roles"],
    ["roles", "Roles", "game-day"],
    ["board", "Tactics Board", "game-day"],
    ["play-forward", "The Ten Rules", "game-day"],
    ["set-piece-roles", "Set Pieces", "game-day"],
    ["goal-kicks", "Goal Kicks", "game-day"],
    ["corners", "Corners", "game-day"],
    ["throw-ins", "Throw-Ins", "game-day"],
    ["training", "Training"],
    ["parents", "Parents"]
  ];

  var FORMS = {
    f341: { label: "3-4-1", tag: "Current shape" },
    f242: { label: "2-4-2", tag: "New shape" }
  };
  var KEY = "hawksForm";

  /* ---------- formation choice (remembered on this device) ---------- */
  function stored(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function fromUrl(){
    var m = /[?&]f=(341|242)\b/.exec(location.search);
    return m ? "f" + m[1] : null;
  }
  var picked = fromUrl() || stored();
  var current = FORMS[picked] ? picked : "f341";
  if (fromUrl()) { try { localStorage.setItem(KEY, current); } catch(e){} }
  document.documentElement.setAttribute("data-form", current);

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }

  var Hawks = window.Hawks = {
    FORMS: FORMS,
    form: function(){ return current; },
    hasPicked: function(){ return !!FORMS[stored()] || !!fromUrl(); },
    setForm: function(k){
      if (!FORMS[k]) { return; }
      current = k;
      try { localStorage.setItem(KEY, k); } catch(e){}
      document.documentElement.setAttribute("data-form", k);
      var bs = document.querySelectorAll("[data-pick-form]");
      for (var i = 0; i < bs.length; i++) { bs[i].setAttribute("aria-pressed", bs[i].getAttribute("data-pick-form") === k ? "true" : "false"); }
      document.dispatchEvent(new CustomEvent("hawks:form", { detail: k }));
    },
    footer: function(){
      var msgs = window.HAWKS_MESSAGES || [];
      /* weeks counted from Monday 5 Jan 1970, so the message changes every Monday */
      var week = Math.floor((Date.now() - Date.UTC(1970, 0, 5)) / 604800000);
      var msg = msgs.length ? msgs[((week % msgs.length) + msgs.length) % msgs.length] : "";
      var f = document.createElement("footer");
      f.innerHTML =
        '<div class="wrap">' +
          '<div class="ft"><a href="index.html"><img src="assets/crest.png" alt="AFC Tickton crest"></a><span>' + esc(FOOTER_NAME) + '</span></div>' +
          (msg ? '<p class="msg">' + esc(msg) + '</p><p class="wk">Message of the week</p>' : '') +
          (document.querySelector("[data-app-actions]") ? '' : ACTIONS) +
        '</div>';
      (document.currentScript || document.body.lastChild).insertAdjacentElement("beforebegin", f);
      syncInstall();
    },
    /* the same two buttons anywhere else: <div data-app-actions></div> then Hawks.actions() */
    actions: function(){
      [].forEach.call(document.querySelectorAll("[data-app-actions]"), function(el){ el.innerHTML = ACTIONS; });
      syncInstall();
    }
  };

  /* ---------- "Add to home screen" and "Share" ---------- */
  var SHARE_TITLE = "AFC Tickton Hawks U12s";
  var SHARE_TEXT = "The Hawks playbook: next match, league table, game day and training.";
  var ACTIONS =
    '<div class="app-actions">' +
      '<button type="button" class="app-btn" data-act="install"><span aria-hidden="true">+</span> Add to home screen</button>' +
      '<button type="button" class="app-btn" data-act="share"><span aria-hidden="true">&#8599;</span> Share</button>' +
    '</div>';
  var installPrompt = null;
  function standalone(){
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  }
  function syncInstall(){
    /* already opened from the home screen: no need to offer it */
    [].forEach.call(document.querySelectorAll('[data-act="install"]'), function(b){ b.hidden = standalone(); });
  }
  window.addEventListener("beforeinstallprompt", function(e){ e.preventDefault(); installPrompt = e; });
  window.addEventListener("appinstalled", function(){ installPrompt = null; syncInstall(); });

  var ua = navigator.userAgent;
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/.test(ua);
  var SHARE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="vertical-align:-3px"><path d="M12 3v12M7 8l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var STEPS_IOS = '<li>Tap the <b>Share</b> button ' + SHARE_ICON + ' (bottom of the screen in Safari, top in Chrome).</li><li>Scroll down and tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>.</li>';
  var STEPS_ANDROID = '<li>Tap the <b>&#8942;</b> menu at the top right of Chrome.</li><li>Tap <b>Add to Home screen</b> or <b>Install app</b>.</li><li>Tap <b>Add</b> or <b>Install</b>.</li>';

  function dialog(title, body){
    var dl = document.getElementById("appDialog");
    if (!dl) {
      dl = document.createElement("dialog");
      dl.id = "appDialog";
      dl.className = "app-dialog";
      document.body.appendChild(dl);
      dl.addEventListener("click", function(e){ if (e.target === dl || e.target.closest("[data-close]")) { dl.close(); } });
    }
    dl.innerHTML = '<div class="app-dialog-in"><h3>' + title + '</h3>' + body + '<button type="button" class="app-btn" data-close>Done</button></div>';
    if (dl.showModal) { dl.showModal(); } else { dl.setAttribute("open", ""); }
  }

  function install(){
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then(function(){ installPrompt = null; syncInstall(); });
      return;
    }
    var body;
    if (isIOS) { body = '<ol>' + STEPS_IOS + '</ol>'; }
    else if (isAndroid) { body = '<ol>' + STEPS_ANDROID + '</ol>'; }
    else { body = '<p>Open this site on your phone, then:</p><p class="app-os">iPhone</p><ol>' + STEPS_IOS + '</ol><p class="app-os">Android</p><ol>' + STEPS_ANDROID + '</ol>'; }
    dialog("Add Hawks to your home screen", body + '<p class="app-note">The Hawks crest appears on your home screen and opens the site like an app.</p>');
  }

  function toast(text){
    var t = document.getElementById("appToast");
    if (!t) { t = document.createElement("div"); t.id = "appToast"; t.className = "app-toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = text; t.classList.add("on");
    clearTimeout(t._h); t._h = setTimeout(function(){ t.classList.remove("on"); }, 2500);
  }

  function share(){
    var url = new URL("./", location.href).href;
    var copyBox = '<p>Copy this link:</p><p class="app-link">' + esc(url) + '</p>';
    if (navigator.share) {
      navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: url }).catch(function(){});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function(){ toast("Link copied. Paste it into WhatsApp, a text or an email."); },
        function(){ dialog("Share the Hawks site", copyBox); });
    } else {
      dialog("Share the Hawks site", copyBox);
    }
  }

  /* ---------- header + tabs, written in place of this script tag ---------- */
  var me = document.currentScript;
  var d = me.dataset;
  var page = d.page || "index";

  var mine = PAGES.filter(function(p){ return p[0] === page; })[0];
  var section = mine && mine[2] ? mine[2] : page;
  function link(p, on){ return '<a href="' + (p[3] || p[0]) + '.html"' + (on ? ' aria-current="page"' : '') + '>' + p[1] + '</a>'; }
  var tabs = PAGES.filter(function(p){ return !p[2]; }).map(function(p){ return link(p, p[0] === section); }).join("");
  var kids = PAGES.filter(function(p){ return p[2] === section; });
  var formSwitch =
    '<div class="formsw" role="group" aria-label="Formation"><span>Formation</span>' +
      Object.keys(FORMS).map(function(k){
        return '<button type="button" data-pick-form="' + k + '" aria-pressed="' + (k === current) + '">' + FORMS[k].label + '</button>';
      }).join("") +
    '</div>';
  var subs = kids.length ? '<div class="subtabs"><div class="wrap tabs-inner">' + kids.map(function(p){ return link(p, p[0] === page); }).join("") + '</div></div>' : "";

  me.insertAdjacentHTML("beforebegin",
    '<header class="hero"><div class="wrap hero-inner">' +
      '<div class="crest"><a href="index.html"><img src="assets/crest.png" alt="AFC Tickton crest"></a></div>' +
      '<div class="hero-txt">' +
        '<p class="eyebrow">' + esc(d.eyebrow || TEAM) + '</p>' +
        '<h1>' + esc(d.h1 || "Hawks Playbook") + (d.l2 ? '<span class="l2">' + esc(d.l2) + '</span>' : '') + '</h1>' +
        (d.sub ? '<p class="sub">' + esc(d.sub) + '</p>' : '') +
      '</div>' +
    '</div></header>' +
    '<nav class="tabs" aria-label="Pages"><div class="wrap navrow"><div class="tabs-inner">' + tabs + '</div>' + formSwitch + '</div>' + subs + '</nav>'
  );

  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("[data-pick-form]");
    if (b) { Hawks.setForm(b.getAttribute("data-pick-form")); }
    var a = e.target.closest && e.target.closest("[data-act]");
    if (a) { if (a.getAttribute("data-act") === "install") { install(); } else { share(); } }
  });

  /* ---------- cold-weather check ----------
     Looks up the "feels like" temperature (Open-Meteo, free, no key) for the next training and the
     next match. Colder than COLD at either: a snowflake shows at the right of the tab bar, and the
     Training page lists both in #weatherNote. Venues are approximate (the town is close enough for weather). */
  var COLD = 8;
  var TRAINING = { weekday: 4, from: 17, to: 18, time: "5:00pm to 6:00pm", place: "Longcroft School 3G", at: [53.8494, -0.4497] };
  var VENUES = {
    "East Riding Leisure Beverley": [53.840, -0.430],
    "Brandesburton Recreation Ground": [53.912, -0.303],
    "Allam Sport Centre, Grass 3": [53.773, -0.369],
    "South Cave Sporting Club": [53.769, -0.601],
    "Haworth Park": [53.783, -0.361]
  };
  var WX_AGE = 3600e3; /* reuse a forecast for an hour */

  function pad(n){ return (n < 10 ? "0" : "") + n; }
  function ymd(d){ return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function nice(d){ return d.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" }); }

  function nextTraining(){
    var d = new Date(), add = (TRAINING.weekday - d.getDay() + 7) % 7;
    if (add === 0 && d.getHours() >= TRAINING.to) { add = 7; }
    d.setDate(d.getDate() + add);
    return { kind: "Training", what: nice(d) + ", " + TRAINING.time, where: TRAINING.place,
      date: ymd(d), from: TRAINING.from, to: TRAINING.to, at: TRAINING.at };
  }
  function nextMatch(){
    var L = window.HAWKS_LEAGUE;
    if (!L) { return null; }
    for (var i = 0; i < L.fixtures.length; i++) {
      var f = L.fixtures[i], p = f[0].split("-"), t = f[1].split(":");
      var ko = new Date(+p[0], p[1] - 1, +p[2], +t[0], +t[1]);
      if (ko.getTime() + 2 * 3600e3 <= Date.now()) { continue; }
      var end = new Date(ko.getTime() + 75 * 60e3);
      return { kind: "Match", what: nice(ko) + ", kick-off " + f[1] + " v " + (f[2] === L.us ? f[3] : f[2]), where: f[4],
        date: f[0], from: ko.getHours(), to: end.getHours(), at: VENUES[f[4]] || VENUES["East Riding Leisure Beverley"] };
    }
    return null;
  }

  /* WMO weather codes from Open-Meteo, in plain words */
  function sky(c){
    if (c === 0) { return "Clear"; }
    if (c <= 2) { return "Partly cloudy"; }
    if (c === 3) { return "Cloudy"; }
    if (c <= 48) { return "Fog"; }
    if (c <= 57) { return "Drizzle"; }
    if (c === 61 || c === 80) { return "Light rain"; }
    if (c <= 65 || c === 81 || c === 82) { return "Rain"; }
    if (c <= 67) { return "Freezing rain"; }
    if (c <= 77 || c === 85 || c === 86) { return "Snow"; }
    return "Thunderstorms";
  }

  function forecast(at, done){
    var key = "hawksWx2:" + at.join(",");
    try {
      var c = JSON.parse(localStorage.getItem(key));
      if (c && Date.now() - c.t < WX_AGE) { done(c.h); return; }
    } catch(e){}
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + at[0] + "&longitude=" + at[1] +
      "&hourly=apparent_temperature,weather_code,precipitation_probability&timezone=Europe%2FLondon&forecast_days=16";
    fetch(url).then(function(r){ return r.json(); }).then(function(j){
      var h = { time: j.hourly.time, feel: j.hourly.apparent_temperature, code: j.hourly.weather_code, rain: j.hourly.precipitation_probability };
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), h: h })); } catch(e){}
      done(h);
    }).catch(function(){ done(null); });
  }
  /* across the event's hours: coldest "feels like", worst weather and highest chance of rain.
     ev.feel is undefined if the forecast doesn't reach that far, null if it failed to load */
  function readForecast(ev, h){
    if (!h) { ev.feel = null; return; }
    var feel = [], code = [], rain = [];
    h.time.forEach(function(t, i){
      var hr = +t.slice(11, 13);
      if (t.slice(0, 10) !== ev.date || hr < ev.from || hr > ev.to || h.feel[i] === null) { return; }
      feel.push(h.feel[i]);
      if (h.code && h.code[i] !== null) { code.push(h.code[i]); }
      if (h.rain && h.rain[i] !== null) { rain.push(h.rain[i]); }
    });
    ev.feel = feel.length ? Math.round(Math.min.apply(null, feel)) : undefined;
    ev.sky = code.length ? sky(Math.max.apply(null, code)) : "";
    ev.rain = rain.length ? Math.max.apply(null, rain) : null;
  }
  function conditions(ev){
    return (ev.sky ? ev.sky : "") + (ev.rain !== null ? (ev.sky ? ", " : "") + ev.rain + "% chance of rain" : "");
  }

  var SNOW = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7"/><path d="M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5M3.6 10.6l3.6-1.3-.6-3.8M20.4 13.4l-3.6 1.3.6 3.8M6.6 18.5l.6-3.8-3.6-1.3M17.4 5.5l-.6 3.8 3.6 1.3"/></g></svg>';

  function wxLine(ev){
    var cold = typeof ev.feel === "number" && ev.feel < COLD;
    var state = ev.feel === null ? "Couldn't load the forecast. Check again later."
      : ev.feel === undefined ? "Forecast not out yet. Check again nearer the day."
      : "Feels like " + ev.feel + "°C" + (conditions(ev) ? " · " + conditions(ev) : "") + ". " + (cold ? "Base layers needed." : "No base layers needed.");
    return '<div class="wx' + (cold ? ' cold' : '') + '"><span class="wx-k">' + (cold ? SNOW + ' ' : '') + ev.kind + '</span>' +
      '<b>' + esc(ev.what) + '</b><span class="wx-w">' + esc(ev.where) + '</span><span class="wx-s">' + state + '</span></div>';
  }

  function weather(){
    var evs = [nextTraining(), nextMatch()].filter(Boolean), left = evs.length;
    evs.forEach(function(ev){
      forecast(ev.at, function(h){
        readForecast(ev, h);
        if (--left === 0) { showWeather(evs); }
      });
    });
  }
  function showWeather(evs){
    var body = evs.map(wxLine).join("") + '<p class="app-note">Forecast from Open-Meteo. It can change, so check again on the day.</p>';
    var note = document.getElementById("weatherNote");
    if (note) { note.innerHTML = '<div class="wxs">' + body + '</div>'; }
    /* a Weather box in the Next match panel on Home */
    var match = evs.filter(function(ev){ return ev.kind === "Match"; })[0];
    var meta = document.querySelector("#nextMatch .nm-meta");
    if (match && meta) {
      var mcold = typeof match.feel === "number" && match.feel < COLD;
      var w = document.createElement("div");
      w.className = "nm-wx" + (mcold ? " cold" : "");
      w.innerHTML = '<dt>Weather</dt><dd>' +
        (match.feel === null ? "Forecast unavailable"
          : match.feel === undefined ? "Forecast not out yet"
          : "Feels like " + match.feel + "°C" + (conditions(match) ? '<span class="nm-wx-c">' + esc(conditions(match)) + '</span>' : '') +
            (mcold ? '<span class="nm-wx-b">' + SNOW + ' Base layers needed</span>' : '')) +
        '</dd>';
      meta.appendChild(w);
    }
    var cold = evs.filter(function(ev){ return typeof ev.feel === "number" && ev.feel < COLD; });
    var row = document.querySelector("nav.tabs .navrow");
    if (!cold.length || !row) { return; }
    var coldest = Math.min.apply(null, cold.map(function(ev){ return ev.feel; }));
    var b = document.createElement("button");
    b.type = "button"; b.className = "coldbadge";
    b.setAttribute("aria-label", "Cold: feels like " + coldest + "°C. Base layers needed.");
    b.title = "Base layers needed";
    b.innerHTML = SNOW;
    b.addEventListener("click", function(){ dialog("Base layers needed", '<p>It will feel colder than ' + COLD + '°C, so wear base layers under your kit.</p><div class="wxs">' + body + '</div>'); });
    row.appendChild(b);
  }
  function withLeague(cb){
    if (window.HAWKS_LEAGUE) { cb(); return; }
    var s = document.createElement("script");
    s.src = "assets/league.js"; s.onload = cb; s.onerror = cb;
    document.head.appendChild(s);
  }
  if (window.fetch) {
    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", function(){ withLeague(weather); }); }
    else { withLeague(weather); }
  }

  /* keep the active tab visible on narrow screens */
  [].forEach.call(document.querySelectorAll('nav.tabs [aria-current]'), function(a){
    a.parentNode.scrollLeft = a.offsetLeft - 16;
  });
})();
