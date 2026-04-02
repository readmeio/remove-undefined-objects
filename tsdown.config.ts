import { defineConfig } from 'tsdown';

// biome-ignore lint/style/noDefaultExport: `tsup` requires a default export.
export default defineConfig(options => ({
  ...options,

  cjsInterop: true,
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  minify: false,
  shims: true,
  silent: !options.watch,
  sourcemap: true,
  splitting: true,
}));
