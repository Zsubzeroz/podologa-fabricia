import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const indexFile = join(distDir, 'index.html');

if (!existsSync(indexFile)) {
  console.error('dist/index.html not found. Run build first.');
  process.exit(1);
}

const copyTo = (subdir) => {
  const targetDir = join(distDir, subdir);
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(indexFile, join(targetDir, 'index.html'));
};

copyTo('cliente');
copyTo('admin');
console.log('Copied dist/index.html to cliente/index.html and admin/index.html');
