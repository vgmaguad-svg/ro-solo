export type Rng = () => number;

export interface PhysicalHitInput {
  attackerHit: number;
  defenderFlee: number;
  criticalChance: number;
  perfectDodge: number;
  defenderIsPlayer?: boolean;
  targetingMonsterCount?: number;
}

export type PhysicalHitResult =
  | { outcome: 'lucky'; hitChance: null }
  | { outcome: 'critical'; hitChance: null }
  | { outcome: 'hit'; hitChance: number }
  | { outcome: 'miss'; hitChance: number };

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

function randomPercent(rng: Rng): number {
  return rng() * 100;
}

export function randomInteger(
  minimum: number,
  maximum: number,
  rng: Rng,
): number {
  return Math.floor(rng() * (maximum - minimum + 1)) + minimum;
}

export function fleeAfterMobbing(
  defenderFlee: number,
  targetingMonsterCount: number,
): number {
  if (targetingMonsterCount <= 2) {
    return defenderFlee;
  }
  return Math.floor(
    defenderFlee * (1 - 0.1 * (targetingMonsterCount - 2)),
  );
}

export function physicalHitChance(
  attackerHit: number,
  defenderFlee: number,
): number {
  return clamp(80 + attackerHit - defenderFlee, 5, 100);
}

export function rollPhysicalHit(
  input: PhysicalHitInput,
  rng: Rng,
): PhysicalHitResult {
  if (
    input.defenderIsPlayer &&
    randomPercent(rng) < input.perfectDodge
  ) {
    return { outcome: 'lucky', hitChance: null };
  }

  if (randomPercent(rng) < input.criticalChance) {
    return { outcome: 'critical', hitChance: null };
  }

  const defenderFlee = input.defenderIsPlayer
    ? fleeAfterMobbing(input.defenderFlee, input.targetingMonsterCount ?? 1)
    : input.defenderFlee;
  const hitChance = physicalHitChance(input.attackerHit, defenderFlee);
  return randomPercent(rng) < hitChance
    ? { outcome: 'hit', hitChance }
    : { outcome: 'miss', hitChance };
}

export interface PhysicalDamageInput {
  weaponAttack: number;
  dexterity: number;
  sizeModifier: number;
  statusAttack: number;
  masteryAttack: number;
  hardDefense: number;
  softDefense: number;
  elementModifier: number;
  critical: boolean;
}

export function physicalDamage(
  input: PhysicalDamageInput,
  rng: Rng,
): number {
  const weaponRoll = input.critical
    ? input.weaponAttack
    : randomInteger(
        Math.min(input.dexterity, input.weaponAttack),
        input.weaponAttack,
        rng,
      );
  let damage =
    (weaponRoll * input.sizeModifier) / 100 +
    input.statusAttack +
    input.masteryAttack;

  if (!input.critical) {
    damage = (damage * (100 - input.hardDefense)) / 100 - input.softDefense;
  }

  damage = (damage * input.elementModifier) / 100;
  if (input.elementModifier === 0) {
    return 0;
  }
  return Math.max(1, Math.floor(damage));
}

export interface MonsterPhysicalDamageInput {
  attack: [minimum: number, maximum: number];
  hardDefense: number;
  softDefense: number;
  neutralElementModifier: number;
}

export function monsterPhysicalDamage(
  input: MonsterPhysicalDamageInput,
  rng: Rng,
): number {
  let damage = randomInteger(input.attack[0], input.attack[1], rng);
  damage = (damage * (100 - input.hardDefense)) / 100 - input.softDefense;
  damage = (damage * input.neutralElementModifier) / 100;
  if (input.neutralElementModifier === 0) {
    return 0;
  }
  return Math.max(1, Math.floor(damage));
}

export interface MagicDamageInput {
  magicAttack: [minimum: number, maximum: number];
  skillModifier: number;
  hardMagicDefense: number;
  softMagicDefense: number;
  elementModifier: number;
}

export function magicDamage(input: MagicDamageInput, rng: Rng): number {
  let damage =
    (randomInteger(input.magicAttack[0], input.magicAttack[1], rng) *
      input.skillModifier) /
    100;
  damage =
    (damage * (100 - input.hardMagicDefense)) / 100 -
    input.softMagicDefense;
  damage = (damage * input.elementModifier) / 100;
  return Math.floor(damage);
}
