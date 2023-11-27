import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // ... Specify options here.
  },
  resolve: {
    alias: {
      '~~': fileURLToPath(new URL('./', import.meta.url))
    }
  }
});
