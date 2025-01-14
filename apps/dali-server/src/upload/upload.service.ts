import {Injectable} from '@nestjs/common';
import {join} from 'path';
import {existsSync, mkdirSync} from 'node:fs';
import {UPLOAD_PATH} from "../constants";

@Injectable()
export class UploadService {

  constructor() {
    if (!existsSync(UPLOAD_PATH)) {
      mkdirSync(UPLOAD_PATH, {recursive: true});
    }
  }

  static ensureSessionDir(sessionId: string): string {
    const sessionDir = join(UPLOAD_PATH, sessionId);
    if (!existsSync(sessionDir)) {
      mkdirSync(sessionDir, {recursive: true});
    }
    return sessionDir;
  }

  handleFileUpload(sessionId: string, files: Express.Multer.File[]): { filename: string; url: string }[] {
    UploadService.ensureSessionDir(sessionId);
    return files.map((file) => ({
      filename: file.filename,
      url: `https://localhost:5000/uploads/${sessionId}/${file.filename}`,
    }));
  }
}
