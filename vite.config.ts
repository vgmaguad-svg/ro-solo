import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

function copyGameData(): Plugin {
  return {
    name: 'copy-game-data',
    apply: 'build',
    closeBundle() {
      const destination = resolve(import.meta.dirname, 'dist/data');
      mkdirSync(destination, { recursive: true });
      cpSync(resolve(import.meta.dirname, 'data'), destination, {
        recursive: true,
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [copyGameData()],
  test: {
    environment: 'node',
  },
});
