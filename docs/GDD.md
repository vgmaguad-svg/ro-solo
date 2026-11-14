# Game Design Document — RO-Solo (working title)

Version 0.1 · Lead designer: Claude · Source research: "Ragnarok Online — Game Reconstruction Dossier" (Claude Sheets)

## 1. Vision
A cozy-but-grindy solo RPG that *feels* like 2003-era Ragnarok Online: click a monster, watch your character swing at it, pick up loot, sit to regen, go back to town, spend points, repeat. No online features.

**Pillars**
1. **Readable numbers.** Every hit shows a number; the Status window explains your power.
2. **Build choice matters.** Six stats + skill points let two Swordmen play differently.
3. **Loot hope.** Most drops are junk to sell; rare slotted gear and 0.01% cards keep you hunting.

## 2. Scope
**v0.1 "First Field" (MVP)** — 1 town, 1 field, 4 monsters, Novice → Swordman or Mage, Base Lv 1–20.
**Later**: dungeon, MVP boss, Archer/Acolyte, refining, cards, Kafra-style teleport.
**Cut forever**: party, guild, trade, chat, PvP, vending, cash shop.

## 3. Core loop
- **Moment (seconds):** click monster → auto-attack at ASPD → skill from hotbar → loot.
- **Session (minutes):** leave town → grind a field → HP/weight runs low → return (Return Feather) → sell, buy tonics, save.
- **Long term (hours):** Base/Job levels → job change at Job 10 → gear upgrades → stronger field.

## 4. Camera & world
- Top-down 3/4 (fake isometric) tile map, 32×32 px cells, Tiled JSON maps.
- Movement on cells, 8 directions, A* pathfinding. Player walk = 150 ms/cell.
- Fixed camera follows player; mouse wheel zoom 0.75×–1.5×.

## 5. Controls (KB/M)
| Action | Input |
|---|---|
| Move | Left-click cell (hold = keep walking toward cursor) |
| Attack | Left-click monster (continuous until target dies or you click elsewhere) |
| Pick up | Left-click ground item |
| Talk | Left-click NPC |
| Item/skill info | Right-click icon |
| Hotbar | F1–F9; F12 switches hotbar page (3 pages) |
| Sit/stand | Insert (also `X` as laptop-friendly alt) |
| Windows | Alt+V info, Alt+E inventory, Alt+Q equip+status, Alt+S skills, Alt+O options, F11 close all |
| Zoom | Mouse wheel |

## 6. Player systems
- Stats STR/AGI/VIT/INT/DEX/LUK, start at 1, 48 points at creation, cap 99. Costs and gains in FORMULAS.md.
- HP/SP from class tables; regen ticks; sitting doubles regen; overweight ≥50% stops regen, ≥90% blocks attacks/skills.
- **Death:** dialog "Return to save point" → respawn at save point with 50% HP (all classes; softer than classic for offline play). Lose 1% of Base EXP-to-next (0% for Novice). Can't de-level.

## 7. Combat
- Real-time. Attack interval = 50/(200−ASPD) hits per second.
- Each swing: hit roll → crit roll → damage pipeline (FORMULAS.md §Combat) → floating number (white you→enemy, red enemy→you, yellow crit, "Miss").
- Monsters flinch (stop moving ~300 ms) when hit.

## 8. Monsters & AI
- Finite-state machine: `idle → randomWalk → (aggro) chase → attack → (lose target) idle`; `dead → respawn timer`.
- Flags: passive, aggressive, looter, assist. Ranges: attackRange, viewRange (~10), chaseRange (~12).
- Random walk: pick a random reachable cell within 5 cells, walk, wait 2–6 s.
- Respawn: each spawn group has `count` and `respawnMs` (default 5,000–10,000 ms).
- Data: `data/monsters.json`, `data/drops.json`.

## 9. Loot & items
- On death, roll each drop line independently: `rand(1..10000) <= rate`.
- Ground items: owned by player for 3 s visually, vanish after 60 s.
- Inventory: 100 unique stacks max, tabs Usable / Equip / Etc. Weight limit = 2000 + 30×STR.
- Equipment slots (v0.1): Head (upper), Armor, Weapon, Shield, Garment, Shoes, Accessory×2.
- Card slots shown as `Name [N]`. Card compounding = later task.

## 10. Progression
- Base EXP table: `data/exp_base.json` (classic). Job EXP: `data/exp_job.json`.
- Novice Job max 10 → talk to Job NPC in town → Swordman or Mage (Job resets to 1).
- 1 skill point per Job level (Novice's 9 go into Basic Skill automatically in v0.1).
- Skills v0.1: Swordman — Bash, Magnum Break, Sword Mastery, Increase HP Recovery. Mage — Fire Bolt, Cold Bolt, Lightning Bolt, Napalm Beat, Increase SP Recovery. Numbers in FORMULAS.md §Skills.

## 11. Town (v0.1)
- **Saver** NPC (Kafra-style): Save point, Storage (later), Teleport (later).
- **Tool shop:** Apple, Red Tonic, Wing Feather, Return Feather. Buys any item at its `sell` price.
- **Weapon/armor shop:** Knife, Cotton Shirt.
- **Job Guide:** job change.
- Warp at town edge → Field 1.

## 12. UI (RO-classic look, original skin)
Windows: Basic Info (name, job, HP/SP bars, Base/Job Lv + EXP bars, weight, zeny), Inventory, Equipment + Status (stat "+" buttons with cost), Skill Tree, Hotbar, Minimap, Message log, NPC dialog, Shop, Options (BGM/SFX sliders). Small pixel font, blue-grey gradient title bars, translucent panels.

## 13. Save
`localStorage` JSON, autosave on map change, on level-up, and every 60 s.
