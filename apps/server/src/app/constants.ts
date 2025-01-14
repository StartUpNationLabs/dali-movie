import path, {join} from "node:path";
import {existsSync, mkdirSync} from "node:fs";

export const UPLOAD_PATH = join(__dirname, '..', 'uploads');
export const GENERATED_PATH = join(__dirname, '..', 'generated');
export const EXPORTED_PATH = join(__dirname, '..', 'exported');

export const PYTHON_PATH = process.env.PYTHON_PATH || 'python';
export const DALI_MOVIE_LIB_PATH = join(__dirname, '..', '..', 'libs', 'python');
export const FONT_PATH = path.join(__dirname, 'src', 'assets', 'arial.TTF');

if (!existsSync(UPLOAD_PATH)) {
  mkdirSync(UPLOAD_PATH, {recursive: true});
}

if (!existsSync(GENERATED_PATH)) {
  mkdirSync(GENERATED_PATH, {recursive: true});
}
