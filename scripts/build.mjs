import { build } from 'vite';
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const bundleDir = resolve(root, '.standalone-build');
const bundleFile = resolve(bundleDir, 'brickcraft.bundle.js');

await build({
  root,
  configFile: false,
  build: {
    outDir: bundleDir,
    emptyOutDir: true,
    minify: 'esbuild',
    lib: {
      entry: resolve(root, 'app.js'),
      name: 'BrickCraft',
      formats: ['iife'],
      fileName: () => 'brickcraft.bundle.js',
    },
  },
});

await copyFile(bundleFile, resolve(root, 'brickcraft.bundle.js'));

await build({
  root,
  configFile: false,
  publicDir: false,
  build: {
    outDir: resolve(root, 'dist'),
    emptyOutDir: true,
    minify: 'esbuild',
  },
});

await mkdir(resolve(root, 'dist'), { recursive: true });
await copyFile(bundleFile, resolve(root, 'dist', 'brickcraft.bundle.js'));
await rm(bundleDir, { recursive: true, force: true });
