# AGENTS.md — rules for Codex (and any coding agent)

You are the **builder**. Claude is the **lead game designer**. James is the **producer** (approves and merges).

## Read first, every task
1. `docs/GDD.md` — what the game is.
2. `docs/FORMULAS.md` — the math. Implement it exactly; do not invent your own.
3. `docs/TASKS.md` — do ONLY the task you were given (e.g. "T03"). Don't start the next one.
4. `data/*.json` — all game numbers live here. **Never hard-code stats, EXP, drop rates or prices in code.**

## Stack (do not change without a design note)
- Phaser 3 + TypeScript + Vite. Package manager: npm.
- Tests: Vitest for pure logic (`src/systems/*`).
- Target: desktop browsers (Chrome/Edge/Firefox), 1280×720 logical canvas, scales to window.
- Deploy: GitHub Pages via GitHub Actions (`vite build`, `base: './'`).

## Folder layout
```
src/
  main.ts            # Phaser game config
  scenes/            # Boot, Preload, Town, Field, UI (UI scene runs on top)
  systems/           # PURE logic, no Phaser imports: stats, combat, exp, loot, ai, pathfinding, inventory
  entities/          # Player, Monster, GroundItem (Phaser objects that call systems/)
  ui/                # RO-style windows: BasicInfo, Inventory, Equip, Status, Skills, Hotbar, Dialog, Shop
  data/              # typed loaders for /data/*.json
public/assets/       # art + audio (placeholders allowed)
tests/               # vitest specs mirroring systems/
```

## Hard rules
- **Original names and art only.** No Ragnarok Online sprites, sounds, music, logos or exact names in the shipped game. `ro_ref` fields in data are for designers only — never display them.
- Placeholder art = simple colored shapes/rects with a text label until real art lands in `public/assets/`.
- Logic in `systems/` must be pure and unit-tested. Every formula in FORMULAS.md that you implement gets at least one test with a worked example.
- All UI windows stay **inside the game canvas**, are draggable, and cannot be resized below a readable minimum.
- Save game = `localStorage` key `rosolo.save.v1`, JSON. Version the schema.
- Keep each PR to the one task. Small commits, clear messages.

## Definition of done (every task)
- `npm run build` passes, `npm test` passes, no TypeScript errors.
- Acceptance criteria in TASKS.md all met.
- Append one entry to `docs/PROGRESS.md`: date, task id, what was built, anything you couldn't do, open questions for the designer.
- If the spec is ambiguous, pick the simplest reading, note it under "Open questions" in PROGRESS.md, and continue.
