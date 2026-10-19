/* League data for the home page and the Table page, copied from FA Full-Time.
   FA Full-Time can't be read live from this site, so update this file after each matchday:
   - "updated": the date you copied the table
   - "table": one line per team, in league position order
   - "fixtures": our league fixtures; a date that has passed drops off automatically.
     Postponed? Delete the line, or add it again with the new date. */
window.HAWKS_LEAGUE = {
  updated: "2026-10-19",
  us: "AFC Tickton U12 Hawks",
  league: "East Riding Girls Football League · U12 Whites",
  link: "https://fulltime.thefa.com/displayTeam.html?divisionseason=416865769&teamID=802136243",
  tableLink: "https://fulltime.thefa.com/table.html?league=498851&selectedSeason=552569340&selectedFixtureGroupAgeGroup=11&previousSelectedFixtureGroupAgeGroup=11&selectedDivision=674437591&selectedCompetition=0&selectedFixtureGroupKey=1_416865769",

  /* [team, played, won, drawn, lost, points] */
  table: [
    ["Hull United Juniors CIC U12 Whites Girls", 4, 4, 0, 0, 12],
    ["South Cave Sporting Club U12 Panthers", 4, 4, 0, 0, 12],
    ["Cottingham Rangers AFC U12 Lionesses", 5, 4, 0, 1, 12],
    ["AFC Tickton U12 Hawks", 4, 3, 0, 1, 9],
    ["Parks AFC U12", 3, 1, 0, 2, 3],
    ["Cottingham Rangers AFC U12 Girls Eagles", 4, 1, 0, 3, 3],
    ["AFC Preston U12 Girls", 5, 0, 0, 5, 0],
    ["Brandesburton AFC U12 Girls", 5, 0, 0, 5, 0]
  ],

  /* [date YYYY-MM-DD, kick-off, home team, away team, venue] */
  fixtures: [
    ["2026-10-31", "09:15", "AFC Tickton U12 Hawks", "Parks AFC U12", "East Riding Leisure Beverley"],
    ["2026-11-07", "10:30", "Brandesburton AFC U12 Girls", "AFC Tickton U12 Hawks", "Brandesburton Recreation Ground"],
    ["2026-11-14", "09:15", "AFC Tickton U12 Hawks", "Cottingham Rangers AFC U12 Girls Eagles", "East Riding Leisure Beverley"],
    ["2026-11-21", "09:15", "AFC Tickton U12 Hawks", "Cottingham Rangers AFC U12 Lionesses", "East Riding Leisure Beverley"],
    ["2026-11-28", "09:15", "AFC Tickton U12 Hawks", "Brandesburton AFC U12 Girls", "East Riding Leisure Beverley"],
    ["2027-01-09", "10:30", "Cottingham Rangers AFC U12 Lionesses", "AFC Tickton U12 Hawks", "Allam Sport Centre, Grass 3"],
    ["2027-01-16", "11:00", "South Cave Sporting Club U12 Panthers", "AFC Tickton U12 Hawks", "South Cave Sporting Club"],
    ["2027-01-23", "09:15", "AFC Tickton U12 Hawks", "Cottingham Rangers AFC U12 Girls Eagles", "East Riding Leisure Beverley"],
    ["2027-01-30", "10:30", "Hull United Juniors CIC U12 Whites Girls", "AFC Tickton U12 Hawks", "Haworth Park"],
    ["2027-02-13", "09:15", "AFC Tickton U12 Hawks", "AFC Preston U12 Girls", "East Riding Leisure Beverley"],
    ["2027-02-20", "09:15", "AFC Tickton U12 Hawks", "Hull United Juniors CIC U12 Whites Girls", "East Riding Leisure Beverley"],
    ["2027-02-27", "10:30", "Cottingham Rangers AFC U12 Lionesses", "AFC Tickton U12 Hawks", "Allam Sport Centre, Grass 3"],
    ["2027-03-13", "11:00", "South Cave Sporting Club U12 Panthers", "AFC Tickton U12 Hawks", "South Cave Sporting Club"],
    ["2027-04-03", "10:30", "Brandesburton AFC U12 Girls", "AFC Tickton U12 Hawks", "Brandesburton Recreation Ground"],
    ["2027-04-17", "09:15", "AFC Tickton U12 Hawks", "Parks AFC U12", "East Riding Leisure Beverley"]
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

  function opp(f){ return f[2] === L.us ? f[3] : f[2]; }
  function ha(f){ return f[2] === L.us ? "Home" : "Away"; }

  var nm = document.getElementById("nextMatch");
  if (nm) {
    var f = upcoming[0];
    if (!f) {
      nm.innerHTML = '<p class="nm-none">No more league fixtures listed. <a href="' + esc(L.link) + '" target="_blank" rel="noopener">Check FA Full-Time</a>.</p>';
    } else {
      var days = Math.round((new Date(when(f).toDateString()) - new Date(new Date().toDateString())) / 864e5);
      var count = days <= 0 ? "Today" : days === 1 ? "Tomorrow" : "In " + days + " days";
      nm.innerHTML =
        '<div class="nm-top"><span class="nm-count">' + count + '</span><span class="nm-ha nm-' + ha(f).toLowerCase() + '">' + ha(f) + '</span></div>' +
        '<div class="nm-vs"><span class="nm-us">Hawks</span><span class="nm-v">v</span><span class="nm-opp">' + esc(opp(f)) + '</span></div>' +
        '<dl class="nm-meta"><div><dt>Date</dt><dd>' + esc(longDay(f)) + '</dd></div><div><dt>Kick-off</dt><dd>' + esc(f[1]) + '</dd></div><div><dt>Venue</dt><dd>' + esc(f[4]) + '</dd></div></dl>' +
        (upcoming[1] ? '<p class="nm-after">After that: ' + esc(day(upcoming[1])) + ', ' + ha(upcoming[1]).toLowerCase() + ' v ' + esc(opp(upcoming[1])) + '</p>' : '');
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

  var fl = document.getElementById("fixtureList");
  if (fl) {
    fl.innerHTML = upcoming.length ? '<ul class="fx">' + upcoming.map(function(f){
      return '<li><span class="fx-d">' + esc(day(f)) + ' · ' + esc(f[1]) + '</span><span class="fx-o"><span class="nm-ha nm-' + ha(f).toLowerCase() + '">' + ha(f) + '</span> v ' + esc(opp(f)) + '</span><span class="fx-v">' + esc(f[4]) + '</span></li>';
    }).join("") + '</ul>' : '<p class="sec-note">No more league fixtures listed.</p>';
  }
})();
