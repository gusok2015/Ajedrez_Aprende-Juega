import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative asset paths for GitHub Pages & custom hosting
  build: {
    outDir: 'dist',
  }
});
