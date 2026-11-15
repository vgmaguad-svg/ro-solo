export type StatName = 'str' | 'agi' | 'vit' | 'int' | 'dex' | 'luk';
export type CharacterClass = 'novice' | 'swordman' | 'mage';
export type Element =
  | 'neutral'
  | 'water'
  | 'earth'
  | 'fire'
  | 'wind'
  | 'poison'
  | 'holy'
  | 'shadow'
  | 'ghost'
  | 'undead';
export type MonsterSize = 'small' | 'medium' | 'large';
export type WeaponType =
  | 'fist'
  | 'unarmed'
  | 'dagger'
  | 'sword1h'
  | 'sword2h'
  | 'spear'
  | 'axe'
  | 'mace'
  | 'rod'
  | 'bow'
  | 'katar'
  | 'book'
  | 'knuckle'
  | 'whip'
  | 'instrument';

export interface SourcedData {
  _source: string;
}

export interface ClassDefinition {
  hpA: number;
  hpB: number;
  spJob: number;
  maxJob: number;
  weapons: WeaponType[];
  btba: Partial<Record<WeaponType, number>>;
  next?: CharacterClass[];
  jobBonusTotalAt50?: Partial<Record<StatName, number>>;
}

export interface ClassesData extends SourcedData {
  classes: Record<CharacterClass, ClassDefinition>;
}

export type DropLine = [itemId: string, rate: number];

export interface DropsData extends SourcedData {
  drops: Record<string, DropLine[]>;
}

export interface ElementsData extends SourcedData {
  elements: Element[];
  table: Record<Element, Record<Element, number>>;
}

export interface BaseExpData extends SourcedData {
  toNext: Record<string, number>;
  maxLevel: number;
}

export interface JobExpTrack {
  maxJob: number;
  toNext: Record<string, number>;
}

export interface SampledJobExpTrack {
  maxJob: number;
  samples: Record<string, number>;
}

export interface JobExpData extends SourcedData {
  novice: JobExpTrack;
  first: SampledJobExpTrack;
}

export type ItemType = 'usable' | 'etc' | 'weapon' | 'armor' | 'card';

export interface ItemDefinition {
  id: string;
  name: string;
  type: ItemType;
  weight: number;
  buy?: number | null;
  sell: number;
  ro_ref?: string;
  subtype?: WeaponType;
  weaponLv?: number;
  atk?: number;
  matk?: number;
  def?: number;
  slots?: number;
  equip?: string;
  jobs?: CharacterClass[];
  slotType?: string;
  use?: {
    healHp?: [minimum: number, maximum: number];
    teleport?: 'random_on_map' | 'save_point';
  };
  effect?: Partial<Record<StatName | 'perfectDodge', number>>;
}

export interface ItemsData extends SourcedData {
  items: ItemDefinition[];
}

export type MonsterAi = 'passive' | 'passive_looter' | 'aggressive';

export interface MonsterDefinition {
  id: string;
  name: string;
  lv: number;
  hp: number;
  atk: [minimum: number, maximum: number];
  def: number;
  mdef: number;
  str: number;
  agi: number;
  vit: number;
  int: number;
  dex: number;
  luk: number;
  size: MonsterSize;
  element: Element;
  race: string;
  ai: MonsterAi;
  speedMs: number;
  attackDelayMs: number;
  attackRange: number;
  viewRange: number;
  chaseRange: number;
  baseExp: number;
  jobExp: number;
  ro_ref?: string;
  _note?: string;
}

export interface MonstersData extends SourcedData {
  monsters: MonsterDefinition[];
}

export interface SizesData extends SourcedData {
  order: MonsterSize[];
  table: Record<Exclude<WeaponType, 'unarmed'>, Record<MonsterSize, number>>;
}
