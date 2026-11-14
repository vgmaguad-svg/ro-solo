# TASKS.md — build queue (do in order, one task per PR)

Status: ⬜ todo · 🟨 in progress · ✅ merged

| ID | Task | Status |
|---|---|---|
| T01 | Project scaffold + deploy | ⬜ |
| T02 | Data loaders + stat/formula systems (tested) | ⬜ |
| T03 | Tile map, camera, click-to-move with A* | ⬜ |
| T04 | Monsters: spawn, random walk, AI FSM | ⬜ |
| T05 | Combat loop + floating damage | ⬜ |
| T06 | EXP, level-up, death/respawn | ⬜ |
| T07 | Loot drops, ground items, inventory + weight | ⬜ |
| T08 | RO-style UI windows (Basic Info, Inventory, Equip+Status, Hotbar) | ⬜ |
| T09 | Town: NPC dialog, shops, save point, warp | ⬜ |
| T10 | Regen, sitting, items use, Return/Wing Feather | ⬜ |
| T11 | Job change + Skills (Swordman, Mage) + Skill window | ⬜ |
| T12 | Save/load, Options window, polish pass | ⬜ |

---

## T01 — Project scaffold + deploy
**Do:** Vite + TypeScript + Phaser 3 + Vitest. Scenes: Boot, Preload, Field (empty green grid), UI (overlay). Canvas 1280×720, `Scale.FIT`. GitHub Actions workflow builds and deploys to GitHub Pages on push to `main`. Copy `/data` into the build so it's fetchable at runtime.
**Accept:** `npm run dev` shows a grid and "RO-Solo v0.1" text; `npm test` runs one sample test; Pages URL loads the same. README updated with the live URL.

## T02 — Data loaders + systems
**Do:** Typed loaders for every `data/*.json`. Implement `src/systems/stats.ts` (stat costs, points per level, maxHP/SP, HIT/FLEE/CRIT/PD, statusATK, MATK, DEF, weight, ASPD, attack interval) and `combat.ts` (hit roll, physical + magic damage pipeline) exactly per FORMULAS.md, with an injectable RNG.
**Accept:** ≥ 1 Vitest per formula with worked examples, including: stat cost 1→99 total = 628; points 1→99 = 1225; Lv 60→61 base EXP = 365,914; Water attack vs Fire target = 150%; ASPD cap 190.

## T03 — Map + movement
**Do:** Load a Tiled JSON map (`public/assets/maps/field01.json`, 60×60 cells, 32 px, with a "blocked" layer — generate a simple placeholder map with trees/rocks). 3/4 top-down view, Y-sorted sprites. Click-to-move with 8-dir A*, 150 ms/cell; hold mouse = re-path toward cursor every 300 ms. Cursor turns red over blocked cells. Camera follows; wheel zoom 0.75–1.5.
**Accept:** Player (placeholder sprite) walks around obstacles smoothly; diagonal moves don't cut corners.

## T04 — Monsters + AI
**Do:** `spawns` config per map: `{monsterId, count, area:{x,y,w,h}, respawnMs}`. Field01: 12 jellybop, 6 emberbop, 6 fluffkit, 3 thornpup. FSM per GDD §8 with flags passive/aggressive/looter/assist. Monsters show name on hover and an HP bar after being hit.
**Accept:** Passive monsters wander and ignore player; thornpup chases when player within viewRange and gives up past chaseRange; killed monsters respawn after respawnMs (use a debug "kill" key K for now).

## T05 — Combat
**Do:** Click monster → walk into range → attack on interval from ASPD. Monster attacks back on its `attackDelayMs`. Use `systems/combat.ts`. Floating numbers (white/red/yellow crit/"Miss"). Hit flinch 300 ms. Monster death fade 500 ms. Player starts as Novice Lv1 with the 48 points pre-spent as STR 9 / AGI 9 / DEX 9 / VIT 1 / INT 1 / LUK 1 (exactly 48 by stat cost) and a Knife equipped.
**Accept:** You can kill a jellybop in ~5–8 swings at Lv1; thornpup is dangerous at Lv1.

## T06 — EXP, level-up, death
**Do:** Base/Job EXP gain, chained level-ups, stat points + skill points granted, level-up effect (ring + "Level Up!" text). Death → modal "Return to save point" → respawn 50% HP, EXP penalty per FORMULAS.md.
**Accept:** Unit tests for EXP carry-over and penalty; Novice capped at Job 10.

## T07 — Loot + inventory
**Do:** Drops per FORMULAS.md, ground item sprites with name label, click to pick up (walk to it). Inventory model: stacks, 100 unique max, weight. Looter monsters pick up items.
**Accept:** Overweight 50%/90% rules enforced and shown (red weight text).

## T08 — UI windows
**Do:** RO-classic-style windows (original skin): Basic Info, Inventory (tabs Usable/Equip/Etc), Equipment + Status (stat "+" with cost, derived stats list), Hotbar F1–F9 with 3 pages (F12), message log. Draggable, stay inside canvas, min size. Hotkeys from GDD §5. Double-click to use/equip; right-click for info tooltip.
**Accept:** Matches layout notes in GDD §12; equip changes ATK/DEF live.

## T09 — Town
**Do:** Town map (40×40 placeholder) with NPCs: Saver (save point), Tool shop, Weapon shop, Job Guide (stub dialog). Dialog window with Next/Close/menu. Shop Buy/Sell windows. Warp portals town↔field01.
**Accept:** Buy Red Tonics, sell Jelly Goo, set save point, die in field → wake in town.

## T10 — Regen, sitting, consumables
**Do:** Regen ticks, Insert/X to sit (sprite change), consumable use with VIT/INT bonus, Wing Feather (random teleport on map), Return Feather (to save point).
**Accept:** Regen stops at ≥50% weight.

## T11 — Job change + skills
**Do:** Job Guide changes Novice (Job 10) to Swordman or Mage. Skill tree window, learn with points, drag to hotbar. Skills per FORMULAS.md table, cast bar, after-cast delay, SP cost, ground/target modes.
**Accept:** Swordman Bash and Mage Fire Bolt work end-to-end.

## T12 — Save + options + polish
**Do:** Save/load per AGENTS.md, autosave rules (GDD §13). Options window: BGM/SFX volume, "auto-attack continuous" toggle, show monster HP bars toggle. Fix any open questions from PROGRESS.md.
**Accept:** Reload page restores character, inventory, position, map.
