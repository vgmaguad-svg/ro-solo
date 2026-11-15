import type {
  BaseExpData,
  ClassesData,
  DropsData,
  ElementsData,
  ItemsData,
  JobExpData,
  MonstersData,
  SizesData,
} from './types';

export interface DataLoaderOptions {
  basePath?: string;
  fetch?: typeof globalThis.fetch;
}

const DEFAULT_BASE_PATH = './data';

async function loadJson<T>(
  fileName: string,
  options: DataLoaderOptions = {},
): Promise<T> {
  const fetcher = options.fetch ?? globalThis.fetch;
  const basePath = (options.basePath ?? DEFAULT_BASE_PATH).replace(/\/$/, '');
  const response = await fetcher(`${basePath}/${fileName}`);

  if (!response.ok) {
    throw new Error(
      `Could not load ${fileName}: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

export const loadClasses = (options?: DataLoaderOptions): Promise<ClassesData> =>
  loadJson('classes.json', options);

export const loadDrops = (options?: DataLoaderOptions): Promise<DropsData> =>
  loadJson('drops.json', options);

export const loadElements = (options?: DataLoaderOptions): Promise<ElementsData> =>
  loadJson('elements.json', options);

export const loadBaseExp = (options?: DataLoaderOptions): Promise<BaseExpData> =>
  loadJson('exp_base.json', options);

export const loadJobExp = (options?: DataLoaderOptions): Promise<JobExpData> =>
  loadJson('exp_job.json', options);

export const loadItems = (options?: DataLoaderOptions): Promise<ItemsData> =>
  loadJson('items.json', options);

export const loadMonsters = (
  options?: DataLoaderOptions,
): Promise<MonstersData> => loadJson('monsters.json', options);

export const loadSizes = (options?: DataLoaderOptions): Promise<SizesData> =>
  loadJson('sizes.json', options);

export async function loadAllData(options?: DataLoaderOptions) {
  const [classes, drops, elements, baseExp, jobExp, items, monsters, sizes] =
    await Promise.all([
      loadClasses(options),
      loadDrops(options),
      loadElements(options),
      loadBaseExp(options),
      loadJobExp(options),
      loadItems(options),
      loadMonsters(options),
      loadSizes(options),
    ]);

  return { classes, drops, elements, baseExp, jobExp, items, monsters, sizes };
}
