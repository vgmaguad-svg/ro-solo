import type { StatName } from '../data';

export const MAX_STAT = 99;
export const MAX_ASPD = 190;

export function statRaiseCost(currentValue: number): number {
  return Math.floor((currentValue - 1) / 10) + 2;
}

export function totalStatRaiseCost(from: number, to: number): number {
  let total = 0;
  for (let value = from; value < to; value += 1) {
    total += statRaiseCost(value);
  }
  return total;
}

export function statPointsForLevelUp(currentLevel: number): number {
  return Math.floor(currentLevel / 5) + 3;
}

export function totalStatPoints(fromLevel: number, toLevel: number): number {
  let total = 0;
  for (let level = fromLevel; level < toLevel; level += 1) {
    total += statPointsForLevelUp(level);
  }
  return total;
}

export function jobBonusStats(
  jobLevel: number,
  totalsAt50: Partial<Record<StatName, number>>,
): Partial<Record<StatName, number>> {
  return Object.fromEntries(
    Object.entries(totalsAt50).map(([stat, total]) => [
      stat,
      Math.floor((total * jobLevel) / 50),
    ]),
  );
}

export function maximumHp(
  level: number,
  hpA: number,
  hpB: number,
  vitality: number,
): number {
  let baseHp = 35 + level * hpB;
  for (let currentLevel = 2; currentLevel <= level; currentLevel += 1) {
    baseHp += Math.round(hpA * currentLevel);
  }
  return Math.floor(baseHp * (1 + vitality / 100));
}

export function maximumSp(
  level: number,
  spJob: number,
  intelligence: number,
): number {
  const baseSp = 10 + level * spJob;
  return Math.floor(baseSp * (1 + intelligence / 100));
}

export function hit(baseLevel: number, dexterity: number): number {
  return baseLevel + dexterity;
}

export function flee(baseLevel: number, agility: number): number {
  return baseLevel + agility;
}

export function criticalChance(luck: number, targetLuck = 0): number {
  return 1 + Math.floor(luck * 0.3) - Math.floor(targetLuck / 5);
}

export function perfectDodge(luck: number): number {
  return 1 + Math.floor(luck / 10);
}

export function meleeStatusAttack(
  strength: number,
  dexterity: number,
  luck: number,
): number {
  return (
    strength +
    Math.floor(strength / 10) ** 2 +
    Math.floor(dexterity / 5) +
    Math.floor(luck / 5)
  );
}

export function bowStatusAttack(
  strength: number,
  dexterity: number,
  luck: number,
): number {
  return (
    dexterity +
    Math.floor(dexterity / 10) ** 2 +
    Math.floor(strength / 5) +
    Math.floor(luck / 5)
  );
}

export interface MagicAttackRange {
  minimum: number;
  maximum: number;
}

export function magicAttack(
  intelligence: number,
  weaponMagicAttack = 0,
): MagicAttackRange {
  return {
    minimum:
      intelligence +
      Math.floor(intelligence / 7) ** 2 +
      weaponMagicAttack,
    maximum:
      intelligence +
      Math.floor(intelligence / 5) ** 2 +
      weaponMagicAttack,
  };
}

export function softDefense(vitality: number): number {
  return Math.floor(vitality * 0.8);
}

export function hardDefense(armorDefense: readonly number[]): number {
  return armorDefense.reduce((total, defense) => total + defense, 0);
}

export function softMagicDefense(intelligence: number): number {
  return intelligence;
}

export function hardMagicDefense(gearMagicDefense: readonly number[]): number {
  return gearMagicDefense.reduce((total, defense) => total + defense, 0);
}

export function weightLimit(baseStrength: number): number {
  return 2000 + 30 * baseStrength;
}

export interface WeightState {
  canRegenerate: boolean;
  canAttackOrUseSkills: boolean;
  canPickUp: boolean;
}

export function weightState(currentWeight: number, limit: number): WeightState {
  const ratio = currentWeight / limit;
  return {
    canRegenerate: ratio < 0.5,
    canAttackOrUseSkills: ratio < 0.9,
    canPickUp: ratio <= 1,
  };
}

export function weaponDelay(baseTimeBetweenAttacks: number): number {
  return 50 * baseTimeBetweenAttacks;
}

export function attackSpeed(
  baseTimeBetweenAttacks: number,
  agility: number,
  dexterity: number,
  speedModifier = 0,
): number {
  const delay = weaponDelay(baseTimeBetweenAttacks);
  const agilityReduction = Math.round((delay * agility) / 25);
  const dexterityReduction = Math.round((delay * dexterity) / 100);
  const speed =
    200 -
    (delay - (agilityReduction + dexterityReduction) / 10) *
      (1 - speedModifier);
  return Math.min(MAX_ASPD, Math.floor(speed));
}

export function attackInterval(aspd: number): number {
  return Math.floor(20 * (200 - aspd));
}
