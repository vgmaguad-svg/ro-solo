import { describe, expect, it } from 'vitest';
import {
  attackInterval,
  attackSpeed,
  bowStatusAttack,
  criticalChance,
  flee,
  hardDefense,
  hardMagicDefense,
  hit,
  jobBonusStats,
  magicAttack,
  maximumHp,
  maximumSp,
  meleeStatusAttack,
  perfectDodge,
  softDefense,
  softMagicDefense,
  statPointsForLevelUp,
  statRaiseCost,
  totalStatPoints,
  totalStatRaiseCost,
  weaponDelay,
  weightLimit,
  weightState,
} from '../../src/systems/stats';

describe('stat progression', () => {
  it('calculates raise costs, including 628 points from stat 1 to 99', () => {
    expect(statRaiseCost(1)).toBe(2);
    expect(statRaiseCost(11)).toBe(3);
    expect(totalStatRaiseCost(1, 99)).toBe(628);
  });

  it('calculates level-up points, including 1,225 from level 1 to 99', () => {
    expect(statPointsForLevelUp(10)).toBe(5);
    expect(totalStatPoints(1, 99)).toBe(1_225);
  });

  it('linearly interpolates and floors job bonuses', () => {
    expect(jobBonusStats(25, { str: 7, agi: 2 })).toEqual({
      str: 3,
      agi: 1,
    });
  });
});

describe('HP and SP', () => {
  it('calculates max HP from class growth and VIT', () => {
    // Base = 35 + 5*5 + round(.7*2..5) = 70; 20 VIT => 84.
    expect(maximumHp(5, 0.7, 5, 20)).toBe(84);
  });

  it('calculates max SP from class growth and INT', () => {
    // Base = 10 + 10*6 = 70; 30 INT => 91.
    expect(maximumSp(10, 6, 30)).toBe(91);
  });
});

describe('derived combat stats', () => {
  it('calculates HIT', () => {
    expect(hit(20, 15)).toBe(35);
  });

  it('calculates FLEE', () => {
    expect(flee(20, 12)).toBe(32);
  });

  it('calculates target-adjusted critical chance', () => {
    expect(criticalChance(30, 10)).toBe(8);
  });

  it('calculates perfect dodge', () => {
    expect(perfectDodge(30)).toBe(4);
  });

  it('calculates melee status ATK', () => {
    expect(meleeStatusAttack(20, 15, 10)).toBe(29);
  });

  it('calculates bow status ATK', () => {
    expect(bowStatusAttack(15, 20, 10)).toBe(29);
  });

  it('calculates MATK min and max with weapon MATK', () => {
    expect(magicAttack(35, 15)).toEqual({ minimum: 75, maximum: 99 });
  });

  it('calculates soft and hard DEF', () => {
    expect(softDefense(20)).toBe(16);
    expect(hardDefense([1, 4, 2])).toBe(7);
  });

  it('calculates soft and hard MDEF', () => {
    expect(softMagicDefense(25)).toBe(25);
    expect(hardMagicDefense([5, 3])).toBe(8);
  });
});

describe('weight', () => {
  it('calculates the weight limit from base STR', () => {
    expect(weightLimit(9)).toBe(2_270);
  });

  it('applies the 50%, 90%, and over-100% thresholds', () => {
    expect(weightState(500, 1_000)).toEqual({
      canRegenerate: false,
      canAttackOrUseSkills: true,
      canPickUp: true,
    });
    expect(weightState(900, 1_000).canAttackOrUseSkills).toBe(false);
    expect(weightState(1_001, 1_000).canPickUp).toBe(false);
  });
});

describe('attack speed', () => {
  it('converts class/weapon BTBA into weapon delay', () => {
    expect(weaponDelay(0.65)).toBe(32.5);
  });

  it('calculates ASPD and caps it at 190', () => {
    expect(attackSpeed(0.65, 9, 9)).toBe(169);
    expect(attackSpeed(0.5, 99, 99, 1)).toBe(190);
  });

  it('converts ASPD into attack interval milliseconds', () => {
    expect(attackInterval(169)).toBe(620);
  });
});
