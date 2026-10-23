# AFC Tickton Hawks U12s — Playbook

The playbook site for the Hawks: U12 girls, 9-a-side, playing 3-4-1 and 2-4-2. Players open the home page, pick the formation, and find their job and every restart in one place.

**Rule: no players' names anywhere on this site.** Use shirt numbers if a player has to be identified.

## Pages

```
index.html            Home: next match, league table, and all our fixtures at the bottom
roles.html            Game Day tab opens here: how we play, your role in each position, three team rules
game-day.html         Old Game Day page, now a redirect to roles.html so old links keep working
board.html            Tactics Board: animated moments (shape, build-up, press, defend, attack) with
                      draggable counters, plus a free board (both teams, draw runs and passes, full screen,
                      start from kick-off, our corner or their corner)
play-forward.html     The Ten Rules: ten attacking principles, each with a clip from assets/clips/
set-piece-roles.html  Every position's job at every restart
goal-kicks.html       Our goal kicks and pressing theirs, with diagrams
corners.html          Attacking and defending corners, with diagrams
throw-ins.html        Our throw-ins, with diagrams
training.html         Training: when and where, this block's focus, what to bring, practise at home
parents.html          Parents' guide
table.html            Old Fixtures page, now a redirect to the fixtures on Home so old links keep working
assets/               crest, diagrams, clips, shared styles and scripts
```

The opposition is always shown as a 3-4-1 (Tactics Board, The Ten Rules and the set-piece diagrams).

No build step and no dependencies. Open any page in a browser, or publish the folder with GitHub Pages.

## Editing

| To change… | Edit |
|---|---|
| Page tabs, team name, footer name | `assets/site.js` (top of the file) |
| Cold-weather snowflake | `assets/site.js`: `COLD` (8°C feels-like), `TRAINING` (day, times, place) and `VENUES` (a map point for each match venue; add any new venue here). Forecast from Open-Meteo, no key needed |
| Team colours | `assets/site.css`: `--maroon` (claret) and `--sky` (sky blue) at the top, taken from the crest |
| League table, fixtures, next match | `assets/league.js` (copy from FA Full-Time after each matchday; FA Full-Time can't be read live from the site) |
| Meet time | `assets/league.js`: `MEET_BEFORE` (30 minutes before kick-off) |
| Home-screen icon | `assets/icon-*.png` (made from the crest) and `manifest.webmanifest` |
| Message of the week | `assets/messages.js` (one line per week, changes every Monday) |
| Board animations | `board.html`: the `FORMS` block |
| Set-piece jobs per position | `set-piece-roles.html`: the `JOBS` block |
| Set-piece diagrams | `assets/goalkick-*.svg`, `theirkick-*.svg`, `corner-*.svg`, `defcorner-*.svg`, `throwin-*.svg` (one per formation). Swap a file to change a diagram. To redraw one, set it out on the free board first |
| The Ten Rules and clips | `play-forward.html`: one `<article class="pcard">` per rule. Clips go in `assets/clips/` as `name.mp4` with a poster frame `name.jpg` (360px wide). Add a row to the session log at the bottom after each session |

The formation is picked with the 3-4-1 / 2-4-2 switch at the right-hand end of the top tab bar on every page, and is remembered on each phone. Content for one formation only goes inside `data-form="f341"` or `data-form="f242"`. A link can force a formation: `roles.html?f=242`.
