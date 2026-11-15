import { readFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  loadAllData,
  loadBaseExp,
  loadElements,
  type DataLoaderOptions,
} from '../../src/data';

const dataDirectory = resolve(import.meta.dirname, '../../data');

const diskFetch: typeof fetch = async (input) => {
  const fileName = basename(String(input));
  try {
    const body = await readFile(resolve(dataDirectory, fileName), 'utf8');
    return new Response(body, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(null, { status: 404, statusText: 'Not Found' });
  }
};

const options: DataLoaderOptions = { fetch: diskFetch };

describe('typed data loaders', () => {
  it('loads every game data file', async () => {
    const data = await loadAllData(options);

    expect(Object.keys(data.classes.classes)).toEqual([
      'novice',
      'swordman',
      'mage',
    ]);
    expect(data.classes.classes.novice.btba.dagger).toBe(0.65);
    expect(data.drops.drops.jellybop[0]).toEqual(['jelly_goo', 7000]);
    expect(data.elements.elements).toContain('fire');
    expect(data.baseExp.maxLevel).toBe(99);
    expect(data.jobExp.novice.maxJob).toBe(10);
    expect(data.items.items).toHaveLength(12);
    expect(data.monsters.monsters).toHaveLength(4);
    expect(data.sizes.table.dagger.medium).toBe(75);
  });

  it('provides the level 60 to 61 Base EXP value', async () => {
    const baseExp = await loadBaseExp(options);
    expect(baseExp.toNext['60']).toBe(365_914);
  });

  it('looks up Water attacking a Fire target as 150%', async () => {
    const elements = await loadElements(options);
    expect(elements.table.fire.water).toBe(150);
  });

  it('reports a useful error when a data request fails', async () => {
    const failingFetch: typeof fetch = async () =>
      new Response(null, { status: 503, statusText: 'Unavailable' });

    await expect(loadBaseExp({ fetch: failingFetch })).rejects.toThrow(
      'Could not load exp_base.json: 503 Unavailable',
    );
  });
});
