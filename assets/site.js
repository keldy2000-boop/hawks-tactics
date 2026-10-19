/* AFC Tickton Hawks U12s — shared header, page tabs, formation choice and footer.
   Every page loads this at the very top of <body>, with its own heading in data-* attributes:
   <script src="assets/site.js" data-page="corners" data-eyebrow="..." data-h1="..." data-l2="..." data-sub="..."></script>
   To add, remove or rename a page tab, edit PAGES below.
   A page with a parent (e.g. "game-day") sits under that tab: on the parent page and its children,
   a second row of tabs lists the children. */
(function(){
  "use strict";

  var TEAM = "AFC Tickton Hawks U12s";
  var FOOTER_NAME = "Tickton Hawks U12 Girls";

  /* [file name, tab label, parent tab] */
  var PAGES = [
    ["index", "Home"],
    ["game-day", "Game Day"],
    ["roles", "Roles", "game-day"],
    ["board", "Board", "game-day"],
    ["set-piece-roles", "Set Pieces", "game-day"],
    ["goal-kicks", "Goal Kicks", "game-day"],
    ["corners", "Corners", "game-day"],
    ["throw-ins", "Throw-Ins", "game-day"],
    ["quiz", "Quiz", "game-day"],
    ["training", "Training"],
    ["parents", "Parents"],
    ["vote", "Vote"],
    ["table", "Fixtures"]
  ];

  /* Vote tab and links are hidden until voting is ready. Set to true to show them. */
  var SHOW_VOTE = false;
  if (!SHOW_VOTE) {
    PAGES = PAGES.filter(function(p){ return p[0] !== "vote"; });
    document.documentElement.setAttribute("data-vote", "off");
  }

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
  function link(p, on){ return '<a href="' + p[0] + '.html"' + (on ? ' aria-current="page"' : '') + '>' + p[1] + '</a>'; }
  var tabs = PAGES.filter(function(p){ return !p[2]; }).map(function(p){ return link(p, p[0] === section); }).join("");
  var kids = PAGES.filter(function(p){ return p[2] === section; });
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
    '<nav class="tabs" aria-label="Pages"><div class="wrap tabs-inner">' + tabs + '</div>' + subs + '</nav>'
  );

  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("[data-pick-form]");
    if (b) { Hawks.setForm(b.getAttribute("data-pick-form")); }
    var a = e.target.closest && e.target.closest("[data-act]");
    if (a) { if (a.getAttribute("data-act") === "install") { install(); } else { share(); } }
  });

  /* keep the active tab visible on narrow screens */
  [].forEach.call(document.querySelectorAll('nav.tabs [aria-current]'), function(a){
    a.parentNode.scrollLeft = a.offsetLeft - 16;
  });
})();
