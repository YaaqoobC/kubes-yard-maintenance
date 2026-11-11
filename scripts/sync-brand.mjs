import { copyFile, mkdir } from 'node:fs/promises';

// Keep supplied originals separate from the replaceable public asset contract.
await mkdir('public/brand', { recursive: true });
for (const name of [
  'summer-logo.png',
  'winter-logo.png',
  'summer-wordmark-source.png',
]) {
  await copyFile(`logos/${name}`, `public/brand/${name}`);
}
