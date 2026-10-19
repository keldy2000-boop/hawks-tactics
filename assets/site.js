/* AFC Tickton Hawks U12s — shared header, page tabs, formation choice and footer.
   Every page loads this at the very top of <body>, with its own heading in data-* attributes:
   <script src="assets/site.js" data-page="corners" data-eyebrow="..." data-h1="..." data-l2="..." data-sub="..."></script>
   To add, remove or rename a page tab, edit PAGES below. */
(function(){
  "use strict";

  var TEAM = "AFC Tickton Hawks U12s";
  var FOOTER_NAME = "Tickton Hawks U12 Girls";

  var PAGES = [
    ["index", "Home"],
    ["roles", "Roles"],
    ["board", "Board"],
    ["set-piece-roles", "Set Pieces"],
    ["goal-kicks", "Goal Kicks"],
    ["corners", "Corners"],
    ["throw-ins", "Throw-Ins"],
    ["quiz", "Quiz"],
    ["parents", "Parents"],
    ["vote", "Vote"],
    ["table", "Table"]
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
        '</div>';
      (document.currentScript || document.body.lastChild).insertAdjacentElement("beforebegin", f);
    }
  };

  /* ---------- header + tabs, written in place of this script tag ---------- */
  var me = document.currentScript;
  var d = me.dataset;
  var page = d.page || "index";

  var formBtns = Object.keys(FORMS).map(function(k){
    return '<button type="button" data-pick-form="' + k + '" aria-pressed="' + (k === current) + '">' + FORMS[k].label + '</button>';
  }).join("");

  var tabs = PAGES.map(function(p){
    return '<a href="' + p[0] + '.html"' + (p[0] === page ? ' aria-current="page"' : '') + '>' + p[1] + '</a>';
  }).join("");

  me.insertAdjacentHTML("beforebegin",
    '<header class="hero"><div class="wrap hero-inner">' +
      '<div class="crest"><a href="index.html"><img src="assets/crest.png" alt="AFC Tickton crest"></a></div>' +
      '<div class="hero-txt">' +
        '<p class="eyebrow">' + esc(d.eyebrow || TEAM) + '</p>' +
        '<h1>' + esc(d.h1 || "Hawks Playbook") + (d.l2 ? '<span class="l2">' + esc(d.l2) + '</span>' : '') + '</h1>' +
        (d.sub ? '<p class="sub">' + esc(d.sub) + '</p>' : '') +
        '<div class="formsw" role="group" aria-label="Formation"><span class="lab">Formation</span>' + formBtns + '</div>' +
      '</div>' +
    '</div></header>' +
    '<nav class="tabs" aria-label="Pages"><div class="wrap tabs-inner">' + tabs + '</div></nav>'
  );

  document.addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("[data-pick-form]");
    if (b) { Hawks.setForm(b.getAttribute("data-pick-form")); }
  });

  /* keep the active tab visible on narrow screens */
  var active = document.querySelector('.tabs a[aria-current="page"]');
  if (active && active.scrollIntoView) { active.parentNode.scrollLeft = active.offsetLeft - 16; }
})();
