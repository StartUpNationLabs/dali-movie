import fs from 'fs';
import { Request, Response } from 'express';
import { UploadMediaService } from './upload.media.service.js';
import { PORT } from '../main.js';
import { UPLOAD_PATH } from '../constants.js';

export class UploadMediaController {
  constructor() {}

  uploadVideo = (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId) {
        res
          .status(400)
          .json({ success: false, message: 'Session ID is required' });
        return;
      }

      // return all files in the folder
      const sessionDir = UploadMediaService.ensureSessionDir(
        sessionId,
        UPLOAD_PATH
      );
      const files = fs.readdirSync(sessionDir).map((filename) => ({
        filename,
        url: `http://localhost:${PORT}/uploads/${sessionId}/${filename}`,
      }));
      res.status(200).json({ success: true, files });
    } catch (error: any) {}
    res.status(500).json({ success: false, message: 'error' });
  };
}
