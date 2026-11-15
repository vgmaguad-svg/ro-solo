import { cpSync, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

function gameDataPlugin(): Plugin {
  const source = resolve(import.meta.dirname, 'data');

  return {
    name: 'game-data',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://vite.local')
          .pathname;
        const match = pathname.match(/^\/data\/([a-z0-9_-]+\.json)$/);
        if (!match) {
          next();
          return;
        }

        void readFile(resolve(source, match[1]))
          .then((contents) => {
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.setHeader('Cache-Control', 'no-cache');
            response.end(contents);
          })
          .catch(() => {
            response.statusCode = 404;
            response.end('Not found');
          });
      });
    },
    writeBundle() {
      const destination = resolve(import.meta.dirname, 'dist/data');
      mkdirSync(destination, { recursive: true });
      cpSync(source, destination, { recursive: true });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [gameDataPlugin()],
  test: {
    environment: 'node',
  },
});
