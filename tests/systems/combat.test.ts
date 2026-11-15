import { describe, expect, it } from 'vitest';
import {
  fleeAfterMobbing,
  magicDamage,
  monsterPhysicalDamage,
  physicalDamage,
  physicalHitChance,
  randomInteger,
  rollPhysicalHit,
  type Rng,
} from '../../src/systems/combat';

function sequenceRng(...values: number[]): Rng {
  let index = 0;
  return () => values[index++] ?? 0;
}

describe('physical hit roll', () => {
  it('rolls inclusive integer ranges with injected RNG', () => {
    expect(randomInteger(10, 20, () => 0.5)).toBe(15);
  });

  it('checks player perfect dodge before all other rolls', () => {
    expect(
      rollPhysicalHit(
        {
          attackerHit: 100,
          defenderFlee: 1,
          criticalChance: 100,
          perfectDodge: 4,
          defenderIsPlayer: true,
        },
        () => 0.03,
      ),
    ).toEqual({ outcome: 'lucky', hitChance: null });
  });

  it('lets critical hits skip the normal hit roll', () => {
    expect(
      rollPhysicalHit(
        {
          attackerHit: 1,
          defenderFlee: 999,
          criticalChance: 10,
          perfectDodge: 0,
        },
        () => 0.05,
      ),
    ).toEqual({ outcome: 'critical', hitChance: null });
  });

  it('clamps normal hit chance between 5% and 100%', () => {
    expect(physicalHitChance(1, 999)).toBe(5);
    expect(physicalHitChance(999, 1)).toBe(100);
  });

  it('reduces player FLEE by 10% per monster beyond two', () => {
    expect(fleeAfterMobbing(100, 5)).toBe(70);
  });

  it('returns hit or miss from the adjusted normal hit chance', () => {
    const input = {
      attackerHit: 50,
      defenderFlee: 100,
      criticalChance: 0,
      perfectDodge: 0,
      defenderIsPlayer: true,
      targetingMonsterCount: 5,
    };
    // Rolls: perfect dodge fails, crit fails, 60% normal hit succeeds.
    expect(rollPhysicalHit(input, sequenceRng(0.99, 0.99, 0.39))).toEqual({
      outcome: 'hit',
      hitChance: 60,
    });
    expect(rollPhysicalHit(input, sequenceRng(0.99, 0.99, 0.6))).toEqual({
      outcome: 'miss',
      hitChance: 60,
    });
  });
});

describe('physical damage', () => {
  const input = {
    weaponAttack: 20,
    dexterity: 10,
    sizeModifier: 75,
    statusAttack: 20,
    masteryAttack: 4,
    hardDefense: 20,
    softDefense: 5,
    elementModifier: 150,
    critical: false,
  };

  it('runs weapon, size, ATK, DEF, and element steps in order', () => {
    // Roll 15; (15*.75+20+4)*.8-5 = 23.2; *1.5 => floor 34.
    expect(physicalDamage(input, () => 0.5)).toBe(34);
  });

  it('uses full weapon ATK and ignores DEF for a critical hit', () => {
    expect(physicalDamage({ ...input, critical: true }, () => 0)).toBe(58);
  });

  it('returns zero when the element modifier is zero', () => {
    expect(physicalDamage({ ...input, elementModifier: 0 }, () => 0.5)).toBe(0);
  });

  it('deals at least one damage when a nonzero element is resisted', () => {
    expect(
      physicalDamage(
        { ...input, hardDefense: 100, softDefense: 999 },
        () => 0.5,
      ),
    ).toBe(1);
  });

  it('calculates monster attacks through player DEF and element', () => {
    expect(
      monsterPhysicalDamage(
        {
          attack: [10, 20],
          hardDefense: 20,
          softDefense: 3,
          neutralElementModifier: 100,
        },
        () => 0.5,
      ),
    ).toBe(9);
  });
});

describe('magic damage', () => {
  it('runs MATK, skill, MDEF, and element steps in order', () => {
    // Roll 55 * 200% = 110; * .9 - 20 = 79; * 1.5 => floor 118.
    expect(
      magicDamage(
        {
          magicAttack: [50, 60],
          skillModifier: 200,
          hardMagicDefense: 10,
          softMagicDefense: 20,
          elementModifier: 150,
        },
        () => 0.5,
      ),
    ).toBe(118);
  });
});
