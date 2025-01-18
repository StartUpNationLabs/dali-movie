import path, { dirname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const UPLOAD_PATH = join(__dirname, '..', 'uploads');
export const GENERATED_PATH = join(__dirname, '..', 'generated');
export const EXPORTED_PATH = join(GENERATED_PATH, 'videos');

export const PYTHON_PATH = process.env.PYTHON_PATH || 'python';
export const DALI_MOVIE_LIB_PATH = join(
  __dirname,
  '..',
  '..',
  'libs',
  'python'
);
export const FONT_PATH = path.join(__dirname, 'src', 'assets', 'futura.otf');

if (!existsSync(UPLOAD_PATH)) {
  mkdirSync(UPLOAD_PATH, { recursive: true });
}

if (!existsSync(GENERATED_PATH)) {
  mkdirSync(GENERATED_PATH, { recursive: true });
}
