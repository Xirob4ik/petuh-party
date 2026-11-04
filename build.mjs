// Сборка: клиент (React) → dist/public, сервер → dist/server.js
// node build.mjs        — продакшен-сборка
// node build.mjs --dev  — сборка с пересборкой при изменениях + запуск сервера
import { spawn } from 'node:child_process';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import * as esbuild from 'esbuild';

const dev = process.argv.includes('--dev');

await rm('dist', { recursive: true, force: true });
await mkdir('dist/public', { recursive: true });
await cp('public', 'dist/public', { recursive: true });

const writeIndex = {
  name: 'index-html',
  setup(build) {
    build.onEnd(async (result) => {
      if (result.errors.length || !result.metafile) return;
      const outputs = Object.keys(result.metafile.outputs).map((p) => '/' + p.replace(/^dist\/public\//, ''));
      const js = outputs.find((p) => p.endsWith('.js'));
      const css = outputs.find((p) => p.endsWith('.css'));
      let html = await readFile('index.html', 'utf8');
      html = html
        .replace('<!--CSS-->', css ? `<link rel="stylesheet" href="${css}">` : '')
        .replace('<!--JS-->', `<script type="module" src="${js}"></script>`);
      await writeFile('dist/public/index.html', html);
      if (dev) console.log('[build] клиент собран');
    });
  },
};

const clientOptions = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outdir: 'dist/public/assets',
  entryNames: dev ? 'app' : 'app-[hash]',
  format: 'esm',
  target: ['es2020', 'safari15'],
  jsx: 'automatic',
  minify: !dev,
  sourcemap: dev,
  metafile: true,
  legalComments: 'none',
  external: ['/fonts/*'],
  define: { 'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production') },
  logLevel: 'warning',
  plugins: [writeIndex],
};

const serverOptions = {
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  packages: 'external',
  outfile: 'dist/server.js',
  sourcemap: dev,
  logLevel: 'warning',
};

if (!dev) {
  await Promise.all([esbuild.build(clientOptions), esbuild.build(serverOptions)]);
  console.log('Готово: dist/server.js и dist/public. Запуск: npm start');
} else {
  const client = await esbuild.context(clientOptions);
  const server = await esbuild.context(serverOptions);
  await Promise.all([client.rebuild(), server.rebuild()]);
  await Promise.all([client.watch(), server.watch()]);
  const child = spawn(process.execPath, ['--watch', 'dist/server.js'], { stdio: 'inherit' });
  const stop = () => {
    child.kill();
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
