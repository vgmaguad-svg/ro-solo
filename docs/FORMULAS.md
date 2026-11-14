# FORMULAS.md — implement exactly

`floor` everywhere unless stated. All functions live in `src/systems/` and are unit-tested.
Tags: **[S]** sourced from classic RO research · **[D]** design value (ours, tune later).

## Stats
- Raise stat x→x+1 costs `floor((x-1)/10) + 2` points. [S]
- Level-up L→L+1 grants `floor(L/5) + 3` stat points. Start: 48 points, all stats = 1. Cap 99. [S]
- Job bonus stats: linear interpolation of `jobBonusTotalAt50` over Job 1–50 (floor). [D]

## HP / SP
- `baseHP = 35 + Lv*hpB + Σ(i=2..Lv) round(hpA*i)` ; `maxHP = floor(baseHP * (1 + VIT/100))` [S]
- `baseSP = 10 + Lv*spJob` ; `maxSP = floor(baseSP * (1 + INT/100))` [S for Mage, D for others]
- HP regen tick: every 6000 ms standing, 3000 ms sitting. Amount `max(1, floor(maxHP/200) + floor(VIT/5))`. [S]
- SP regen tick: every 8000 ms standing, 4000 ms sitting. Amount `1 + floor(maxSP/100) + floor(INT/6)`. [S]
- No regen while walking, while weight ≥ 50%, or within 3 s of taking damage [last part D].

## Weight
- `weightLimit = 2000 + 30*baseSTR` [S for STR part, D for 2000]
- ≥ 50%: no natural regen. ≥ 90%: cannot attack or use skills. > 100%: cannot pick up. [S]

## Derived combat stats
- `HIT = BaseLv + DEX` [S]  ·  monster HIT = `lv + dex`
- `FLEE = BaseLv + AGI` [S]  ·  monster FLEE = `lv + agi`
- `CRIT% = 1 + floor(LUK*0.3)` [S]; target reduces it by `floor(targetLUK/5)`
- `perfectDodge% = 1 + floor(LUK/10)` [S approx]
- `statusATK (melee) = STR + floor(STR/10)^2 + floor(DEX/5) + floor(LUK/5)` [S]
- `statusATK (bow) = DEX + floor(DEX/10)^2 + floor(STR/5) + floor(LUK/5)` [S]
- `MATK min = INT + floor(INT/7)^2` · `MATK max = INT + floor(INT/5)^2` (+ weapon matk) [S]
- `softDEF = floor(VIT*0.8)` (cap note: fine for v0.1) [S approx] · `hardDEF` = sum of armor def (+ refine later)
- `softMDEF = INT` · `hardMDEF` = sum of gear mdef [S approx]

## ASPD
- `WD = 50 * BTBA` where BTBA (s) per class+weapon: Novice dagger 0.65, Novice sword1h 0.70, Swordman dagger 0.65, Swordman sword1h 0.70, Swordman sword2h 0.75, Mage rod 0.75, Mage dagger 0.70, unarmed 0.50 [D — classic-like]
- `ASPD = 200 - (WD - (round(WD*AGI/25) + round(WD*DEX/100))/10) * (1 - SM)` ; cap 190 [S]
- Attack interval ms = `20 * (200 - ASPD)` (= 1000 × (200−ASPD)/50) [S]

## Hit roll (physical)
1. `if rand100 < perfectDodge` → "Lucky!" miss (player defender only).
2. Crit roll: `rand100 < CRIT%` → crit (skips step 3 and ignores DEF).
3. `hit% = clamp(80 + attackerHIT - defenderFLEE, 5, 100)`; miss → show "Miss". [S]
4. Mobbing: if >2 monsters targeting player, player FLEE ×(1 − 0.1×(n−2)). [S]

## Physical damage pipeline (in this order) [order D, parts S]
1. `weaponRoll = rand(min(DEX, weaponATK) .. weaponATK)` (non-crit) or `weaponATK` (crit).
2. `base = weaponRoll * sizeMod[weaponType][targetSize]/100 + statusATK + masteryATK`
3. Non-crit: `base = base * (100 - hardDEF)/100 - softDEF`
4. `base = base * element[targetElement][attackElement]/100`
5. Card % bonuses (later). `damage = max(1, floor(base))` (element 0% → 0, show "0").
6. Crit: ×1.0 (classic) but always full weaponATK and no DEF.
- Monster attack: `rand(atk[0]..atk[1])`, then step 3 vs player DEF, element neutral.

## Magic damage
`dmg = rand(MATKmin..MATKmax) * skillPct/100`, then `*(100-hardMDEF)/100 - softMDEF`, then element. Never misses. [S parts, D order]

## Cast time
`cast = baseCast * (1 - DEX/150)`, min 0. After-cast delay locks all skills, not movement. [S]

## EXP
- Kill gives monster `baseExp`, `jobExp`. Level-ups can chain. Excess EXP carries over. [S]
- First-class Job EXP between sample levels: geometric interpolation of `samples` in exp_job.json. [D]

## Death
- Novice: no loss. Others: lose `floor(baseToNext * 0.01)` base EXP, min 0 in current level. [S]

## Drops
- Per drop line: `rand(1..10000) <= rate` → drop. [S]

## Skills v0.1 [S where noted, else D]
| Skill | Lv | SP | Effect |
|---|---|---|---|
| Bash | 1–10 | 8 (Lv1–5), 15 (Lv6–10) [S] | dmg × (100 + 30×Lv)% , HIT +5%×Lv; instant |
| Magnum Break | 1–10 | 30 | 5×5 around self, fire, dmg × (100 + 20×Lv)%, knockback 2 cells, costs 20−Lv HP |
| Sword Mastery | 1–10 | — | +4 ATK × Lv with dagger/sword1h |
| Increase HP Recovery | 1–10 | — | +5×Lv HP every 10 s while standing still |
| Fire/Cold/Lightning Bolt | 1–10 | 10 + 2×Lv | Lv hits of 100% MATK, element fire/water/wind, cast 0.7 s × Lv, delay 0.8 s + 0.2 s×Lv |
| Napalm Beat | 1–10 | 9 + Lv | ghost, 3×3 splash, (70 + 10×Lv)% MATK, cast 1 s, delay 1 s |
| Increase SP Recovery | 1–10 | — | +3×Lv SP every 10 s while standing still |
