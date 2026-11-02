/* League data for the home page and the Table page, copied from FA Full-Time.
   FA Full-Time can't be read live from this site, so update this file after each matchday:
   - "updated": the date you copied the table
   - "table": one line per team, in league position order
   - "fixtures": our league and cup fixtures (add "Cup" at the end of a cup tie); a date that has passed drops off automatically.
     Postponed? Delete the line, or add it again with the new date. */
window.HAWKS_LEAGUE = {
  updated: "2026-11-02",
  us: "AFC Tickton U12 Hawks",
  league: "East Riding Girls Football League · U12 Whites",
  link: "https://fulltime.thefa.com/displayTeam.html?divisionseason=416865769&teamID=802136243",
  tableLink: "https://fulltime.thefa.com/table.html?league=498851&selectedSeason=552569340&selectedFixtureGroupAgeGroup=11&previousSelectedFixtureGroupAgeGroup=11&selectedDivision=674437591&selectedCompetition=0&selectedFixtureGroupKey=1_416865769",

  /* [team, played, won, drawn, lost, points] */
  table: [
    ["Hull United Juniors CIC U12 Whites Girls", 5, 5, 0, 0, 15],
    ["South Cave Sporting Club U12 Panthers", 5, 5, 0, 0, 15],
    ["AFC Tickton U12 Hawks", 5, 4, 0, 1, 12],
    ["Cottingham Rangers AFC U12 Lionesses", 6, 4, 0, 2, 12],
    ["Cottingham Rangers AFC U12 Girls Eagles", 5, 2, 0, 3, 6],
    ["Parks AFC U12", 4, 1, 0, 3, 3],
    ["AFC Preston U12 Girls", 7, 0, 1, 6, 1],
    ["Brandesburton AFC U12 Girls", 7, 0, 1, 6, 1]
  ],

  /* Our results, newest first: [date YYYY-MM-DD, home team, away team, home goals, away goals, "Cup" or "" , note]
     FA Full-Time shows our scores but hides goals for the rest of the league, so only our totals are worked out. */
  results: [
    ["2026-10-31", "AFC Tickton U12 Hawks", "Parks AFC U12", 16, 0, ""],
    ["2026-10-17", "Malet Lambert YC U12 Belles", "AFC Tickton U12 Hawks", 2, 2, "Cup", "won 2–0 on penalties"],
    ["2026-10-10", "AFC Tickton U12 Hawks", "AFC Preston U12 Girls", 8, 0, ""],
    ["2026-10-03", "AFC Tickton U12 Hawks", "Hull United Juniors CIC U12 Whites Girls", 1, 4, ""],
    ["2026-09-26", "Cottingham Rangers AFC U12 Girls Eagles", "AFC Tickton U12 Hawks", 0, 2, ""],
    ["2026-09-12", "AFC Preston U12 Girls", "AFC Tickton U12 Hawks", 0, 7, ""]
  ],

  /* [date YYYY-MM-DD, kick-off, home team, away team, venue, "Cup" for cup ties (leave off for league)] */
  fixtures: [
    ["2026-11-07", "10:30", "Brandesburton AFC U12 Girls", "AFC Tickton U12 Hawks", "Brandesburton Recreation Ground"],
    ["2026-11-14", "09:15", "AFC Tickton U12 Hawks", "Cottingham Rangers AFC U12 Girls Eagles", "East Riding Leisure Beverley"],
    ["2026-11-21", "10:30", "Springhead U12 Falcons", "AFC Tickton U12 Hawks", "Springhead Avenue Playing Fields", "Cup"],
    ["2026-11-28", "09:15", "AFC Tickton U12 Hawks", "Brandesburton AFC U12 Girls", "East Riding Leisure Beverley"],
    ["2026-12-12", "09:15", "AFC Tickton U12 Hawks", "South Cave Sporting Club U12 Panthers", "East Riding Leisure Beverley"],
    ["2026-12-19", "10:30", "Parks AFC U12", "AFC Tickton U12 Hawks", "Courtland Road Playing Fields"],
    ["2027-01-09", "10:30", "Cottingham Rangers AFC U12 Lionesses", "AFC Tickton U12 Hawks", "Allam Sport Centre, Grass 3"],
    ["2027-01-16", "11:00", "South Cave Sporting Club U12 Panthers", "AFC Tickton U12 Hawks", "South Cave Sporting Club"],
    ["2027-01-23", "09:15", "AFC Tickton U12 Hawks", "Cottingham Rangers AFC U12 Girls Eagles", "East Riding Leisure Beverley"],
    ["2027-01-30", "10:30", "Hull United Juniors CIC U12 Whites Girls", "AFC Tickton U12 Hawks", "Haworth Park"],
    ["2027-02-13", "09:15", "AFC Tickton U12 Hawks", "AFC Preston U12 Girls", "East Riding Leisure Beverley"],
    ["2027-02-20", "09:15", "AFC Tickton U12 Hawks", "Hull United Juniors CIC U12 Whites Girls", "East Riding Leisure Beverley"],
    ["2027-02-27", "10:30", "Cottingham Rangers AFC U12 Lionesses", "AFC Tickton U12 Hawks", "Allam Sport Centre, Grass 3"],
    ["2027-03-13", "11:00", "South Cave Sporting Club U12 Panthers", "AFC Tickton U12 Hawks", "South Cave Sporting Club"],
    ["2027-04-03", "10:30", "Brandesburton AFC U12 Girls", "AFC Tickton U12 Hawks", "Brandesburton Recreation Ground"],
    ["2027-04-17", "09:15", "AFC Tickton U12 Hawks", "Parks AFC U12", "East Riding Leisure Beverley"],
    ["2027-04-24", "09:15", "AFC Tickton U12 Hawks", "Cottingham Rangers AFC U12 Lionesses", "East Riding Leisure Beverley"]
  ]
};

/* Draws the next match / league table / fixture list into any element with these ids:
   #nextMatch, #leagueTable, #fixtureList */
(function(){
  "use strict";
  var L = window.HAWKS_LEAGUE;
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]; }); }
  function when(f){ var d = f[0].split("-"), t = f[1].split(":"); return new Date(+d[0], d[1] - 1, +d[2], +t[0], +t[1]); }
  function day(f){ return when(f).toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"short" }); }
  function longDay(f){ return when(f).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" }); }
  /* a match stays "next" until two hours after kick-off */
  var upcoming = L.fixtures.filter(function(f){ return when(f).getTime() + 2 * 3600e3 > Date.now(); });
  var updated = new Date(L.updated + "T12:00:00").toLocaleDateString("en-GB", { day:"numeric", month:"long" });

  /* meet 30 minutes before kick-off */
  var MEET_BEFORE = 30;
  function meet(f){ var m = new Date(when(f).getTime() - MEET_BEFORE * 60e3); return (m.getHours() < 10 ? "0" : "") + m.getHours() + ":" + (m.getMinutes() < 10 ? "0" : "") + m.getMinutes(); }
  function opp(f){ return f[2] === L.us ? f[3] : f[2]; }
  function ha(f){ return f[2] === L.us ? "Home" : "Away"; }
  function cup(f){ return f[5] === "Cup" ? ' <span class="nm-ha nm-cup">Cup</span>' : ""; }

  var nm = document.getElementById("nextMatch");
  if (nm) {
    var f = upcoming[0];
    if (!f) {
      nm.innerHTML = '<p class="nm-none">No more fixtures listed. <a href="' + esc(L.link) + '" target="_blank" rel="noopener">Check FA Full-Time</a>.</p>';
    } else {
      var days = Math.round((new Date(when(f).toDateString()) - new Date(new Date().toDateString())) / 864e5);
      var count = days <= 0 ? "Today" : days === 1 ? "Tomorrow" : "In " + days + " days";
      nm.innerHTML =
        '<div class="nm-top"><span class="nm-count">' + count + '</span><span>' + cup(f) + ' <span class="nm-ha nm-' + ha(f).toLowerCase() + '">' + ha(f) + '</span></span></div>' +
        '<div class="nm-vs"><span class="nm-us">Hawks</span><span class="nm-v">v</span><span class="nm-opp">' + esc(opp(f)) + '</span></div>' +
        '<dl class="nm-meta"><div><dt>Date</dt><dd>' + esc(longDay(f)) + '</dd></div><div><dt>Meet</dt><dd>' + meet(f) + '</dd><dt>Kick-off</dt><dd>' + esc(f[1]) + '</dd></div><div><dt>Venue</dt><dd>' + esc(f[4]) + '</dd></div></dl>' +
        (upcoming[1] ? '<p class="nm-after">After that: ' + esc(day(upcoming[1])) + ', ' + ha(upcoming[1]).toLowerCase() + ' v ' + esc(opp(upcoming[1])) + (upcoming[1][5] === "Cup" ? " (cup)" : "") + '</p>' : '');
    }
  }

  var lt = document.getElementById("leagueTable");
  if (lt) {
    lt.innerHTML =
      '<table class="lt"><caption class="sr">League table</caption><thead><tr><th scope="col">Pos</th><th scope="col" class="tm">Team</th><th scope="col">P</th><th scope="col">W</th><th scope="col">D</th><th scope="col">L</th><th scope="col">Pts</th></tr></thead><tbody>' +
      L.table.map(function(r, i){
        return '<tr' + (r[0] === L.us ? ' class="us"' : '') + '><td>' + (i + 1) + '</td><td class="tm">' + esc(r[0]) + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + r[4] + '</td><td class="pts">' + r[5] + '</td></tr>';
      }).join("") + '</tbody></table>' +
      '<p class="lt-note">Updated ' + esc(updated) + '. <a href="' + esc(L.tableLink) + '" target="_blank" rel="noopener">Live table on FA Full-Time →</a></p>';
  }

  /* our season: league totals, cup line, and every result */
  var os = document.getElementById("ourSeason");
  if (os && L.results) {
    function mine(r){ var home = r[1] === L.us; return { f: home ? r[3] : r[4], a: home ? r[4] : r[3], opp: home ? r[2] : r[1], ha: home ? "Home" : "Away" }; }
    function sum(rs){
      var t = { p: 0, w: 0, d: 0, l: 0, f: 0, a: 0 };
      rs.forEach(function(r){ var m = mine(r); t.p++; t.f += m.f; t.a += m.a; if (m.f > m.a) { t.w++; } else if (m.f < m.a) { t.l++; } else { t.d++; } });
      return t;
    }
    function gd(t){ var g = t.f - t.a; return (g > 0 ? "+" : "") + g; }
    var lg = sum(L.results.filter(function(r){ return r[5] !== "Cup"; }));
    var all = sum(L.results);
    var clean = L.results.filter(function(r){ return r[5] !== "Cup" && mine(r).a === 0; }).length;
    os.innerHTML =
      '<div class="os-stats">' +
        [["Played", lg.p], ["Won", lg.w], ["Drawn", lg.d], ["Lost", lg.l], ["Goals for", lg.f], ["Goals against", lg.a], ["Goal difference", gd(lg)], ["Clean sheets", clean]].map(function(s){
          return '<div><span class="os-n">' + s[1] + '</span><span class="os-l">' + s[0] + '</span></div>';
        }).join("") +
      '</div>' +
      '<p class="lt-note">League games only. Including cup ties: ' + all.p + ' played, ' + all.f + ' scored, ' + all.a + ' conceded (' + gd(all) + ').</p>' +
      '<ul class="fx os-res">' + L.results.map(function(r){
        var m = mine(r), res = m.f > m.a ? "W" : m.f < m.a ? "L" : "D", rc = { W: "win", D: "draw", L: "loss" }[res];
        var d = new Date(r[0] + "T12:00:00").toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"short" });
        return '<li><span class="fx-d">' + esc(d) + '</span><span class="fx-o"><span class="os-r os-' + rc + '">' + res + ' ' + m.f + '–' + m.a + '</span> <span class="nm-ha nm-' + m.ha.toLowerCase() + '">' + m.ha + '</span>' + cup(r) + ' v ' + esc(m.opp) + '</span>' + (r[6] ? '<span class="fx-v">' + esc(r[6]) + '</span>' : '') + '</li>';
      }).join("") + '</ul>';
  }

  var fl = document.getElementById("fixtureList");
  if (fl) {
    fl.innerHTML = upcoming.length ? '<ul class="fx">' + upcoming.map(function(f){
      return '<li><span class="fx-d">' + esc(day(f)) + ' · ' + esc(f[1]) + '</span><span class="fx-o"><span class="nm-ha nm-' + ha(f).toLowerCase() + '">' + ha(f) + '</span>' + cup(f) + ' v ' + esc(opp(f)) + '</span><span class="fx-v">' + esc(f[4]) + '</span></li>';
    }).join("") + '</ul>' : '<p class="sec-note">No more fixtures listed.</p>';
  }
})();
