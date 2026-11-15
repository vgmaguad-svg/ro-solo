# RO-Solo (working title)

An offline, single-player, browser game inspired by classic (pre-Renewal) Ragnarok Online mechanics: click-to-move on a grid, auto-attack combat, Base/Job levels, six stats, element/size tables, card slots, refining. Original names and art.

**Play:** [https://vgmaguad-svg.github.io/ro-solo/](https://vgmaguad-svg.github.io/ro-solo/)

## Team relay
| Role | Who | Does |
|---|---|---|
| Producer | James | Pastes tasks into Codex, plays builds, merges PRs |
| Lead designer | Claude | GDD, formulas, data, tasks, reviews PRs |
| Builder | Codex | Writes code, one task = one PR |
| Art | Gemini (Nano Banana) | Generates art from `docs/ART_BRIEFS.md` |

## Where things are
- `docs/GDD.md` — game design
- `docs/FORMULAS.md` — all math
- `docs/TASKS.md` — build queue (do in order)
- `docs/PROGRESS.md` — relay log
- `docs/ART_BRIEFS.md` — prompts for art
- `data/` — all numbers (monsters, items, drops, EXP, elements, sizes, classes)

## Run locally

```sh
npm install
npm run dev
```

Run the automated checks with `npm test` and create a production build with
`npm run build`. The root `data/` files are available at `/data/*.json` during
development and copied to `dist/data/` for production runtime loading.
