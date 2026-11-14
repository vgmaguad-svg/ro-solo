import { describe, expect, it } from 'vitest';
import { APP_TITLE, GAME_HEIGHT, GAME_WIDTH } from '../src/config';

describe('game scaffold', () => {
  it('uses the v0.1 title and logical canvas size', () => {
    expect(APP_TITLE).toBe('RO-Solo v0.1');
    expect([GAME_WIDTH, GAME_HEIGHT]).toEqual([1280, 720]);
  });
});
