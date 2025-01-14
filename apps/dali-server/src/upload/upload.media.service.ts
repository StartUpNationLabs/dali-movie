import { join } from 'path';
import { existsSync, mkdirSync } from 'node:fs';

export class UploadMediaService {
  constructor() {}

  static ensureSessionDir(sessionId: string, uploadDir: string): string {
    const sessionDir = join(uploadDir, sessionId);
    if (!existsSync(sessionDir)) {
      mkdirSync(sessionDir, { recursive: true });
    }
    return sessionDir;
  }
}
