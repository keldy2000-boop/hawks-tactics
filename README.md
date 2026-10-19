# AFC Tickton Hawks U12s — Playbook

The playbook site for the Hawks: U12 girls, 9-a-side, playing 3-4-1 and 2-4-2. Players open the home page, pick the formation, and find their job and every restart in one place.

**Rule: no players' names anywhere on this site.** Use shirt numbers if a player has to be identified.

## Pages

```
index.html            Home: pick the formation, links to every topic
roles.html            How we play, your role in each position, three team rules
board.html            Animated tactics board (shape, build-up, press, defend, attack)
set-piece-roles.html  Every position's job at every restart
goal-kicks.html       Building from our goal kicks + pressing theirs
corners.html          Attacking and defending corners
throw-ins.html        Throw-in options
quiz.html             10-question quiz for your position
parents.html          Parents' guide
vote.html             Player of the Month voting
table.html            League table and fixtures (FA Full-Time)
assets/               crest, formation diagrams, shared styles and scripts
```

No build step and no dependencies. Open any page in a browser, or publish the folder with GitHub Pages.

## Editing

| To change… | Edit |
|---|---|
| Page tabs, team name, footer name | `assets/site.js` (top of the file) |
| Team colours | `assets/site.css`: `--maroon` (claret) and `--sky` (sky blue) at the top, taken from the crest |
| Message of the week | `assets/messages.js` (one line per week, changes every Monday) |
| Board animations | `board.html`: the `FORMS` block |
| Set-piece jobs per position | `set-piece-roles.html`: the `JOBS` block |
| Quiz questions | `quiz.html`: `GENERAL`, `TEAM` and `ROLES` |
| Squad numbers, vote link, season months | `vote.html`: the `SETTINGS` block |

The formation picked on the home page is remembered on each phone. Content for one formation only goes inside `data-form="f341"` or `data-form="f242"`. A link can force a formation: `roles.html?f=242`.

Dashed sky-blue boxes mark content that's waiting on the coaches' meeting.

## Player of the Month: storing votes

Votes go to a Google Sheet that you own:

1. Create a Google Sheet and open **Extensions → Apps Script**.
2. Replace the code with:

   ```js
   function doPost(e) {
     var sheet = SpreadsheetApp.getActive().getSheets()[0];
     if (sheet.getLastRow() === 0) {
       sheet.appendRow(["Time", "Month", "Vote type", "Voter's number", "Vote", "Why"]);
     }
     var p = e.parameter;
     sheet.appendRow([new Date(), p.month, p.voteType, p.voterNumber, p.vote, p.why]);
     return ContentService.createTextOutput("ok");
   }
   ```

3. **Deploy → New deployment → Web app**. Execute as: *Me*. Who has access: *Anyone*.
4. Copy the web app URL into `SCRIPT_URL` in `vote.html`.

Voting opens the Sunday after the last Saturday of each month during the season (September–May) and stays open for 7 days.
