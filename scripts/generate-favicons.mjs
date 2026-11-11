import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Offline macOS asset preparation only. Committed outputs need no tools at build/runtime.
const temporary = await mkdtemp(join(tmpdir(), 'kubes-favicons-'));
const manifest = {};
await mkdir('public/favicons', { recursive: true });
try {
  for (const season of ['summer', 'winter']) {
    const images = [];
    manifest[season] = {};
    for (const size of [16, 32, 64]) {
      const target = join(temporary, `${season}-${size}.png`);
      execFileSync(
        'sips',
        ['-Z', String(size), `logos/${season}-logo.png`, '--out', target],
        { stdio: 'pipe' },
      );
      execFileSync(
        'sips',
        [
          '--padToHeightWidth',
          String(size),
          String(size),
          '--padColor',
          season === 'summer' ? 'FFFFFF' : '080817',
          target,
        ],
        { stdio: 'pipe' },
      );
      const png = await readFile(target);
      const hash = createHash('sha256').update(png).digest('hex').slice(0, 10);
      const path = `/favicons/${season}-${size}-${hash}.png`;
      await writeFile(`public${path}`, png);
      manifest[season][size] = path;
      images.push({ size, png });
    }
    if (season === 'summer') {
      // ICO directory with PNG entries; the explicit seasonal PNG remains the active tab icon.
      const header = Buffer.alloc(6 + images.length * 16);
      header.writeUInt16LE(1, 2);
      header.writeUInt16LE(images.length, 4);
      let offset = header.length;
      images.forEach(({ size, png }, index) => {
        const entry = 6 + index * 16;
        header[entry] = size;
        header[entry + 1] = size;
        header.writeUInt16LE(1, entry + 4);
        header.writeUInt16LE(32, entry + 6);
        header.writeUInt32LE(png.length, entry + 8);
        header.writeUInt32LE(offset, entry + 12);
        offset += png.length;
      });
      await writeFile(
        'public/favicon.ico',
        Buffer.concat([header, ...images.map((image) => image.png)]),
      );
    }
  }
  await writeFile(
    'app/content/favicons.json',
    JSON.stringify(manifest, null, 2) + '\n',
  );
  console.log(
    'Generated original-artwork favicons (16, 32, 64px), manifest, and fallback ICO.',
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
