import express, { Request } from 'express';
import multer, { StorageEngine } from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { UploadMediaController } from './upload/upload.media.controller.js';
import { UploadMediaService } from './upload/upload.media.service.js';
import { VideoController } from './video/video.controller.js';

const app = express();
export const PORT = 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_PATH = __dirname;

// Enable CORS for frontend communication
app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Directory to store uploaded files
const uploadDir = path.join(BASE_PATH, 'uploads');
const uploadController = new UploadMediaController();
const videoController = new VideoController();

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      return cb(new Error('Session ID is required'), '');
    }

    const sessionDir = UploadMediaService.ensureSessionDir(
      sessionId,
      uploadDir
    );
    cb(null, sessionDir); // Save files to the session-specific directory
  },
  filename: (req: Request, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB limit per file
  fileFilter: (req: Request, file, cb) => {
    console.log(
      'File MIME Type:',
      file.mimetype,
      'File Name:',
      file.originalname
    );
    const allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv', 'mp3'];

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Only video files are allowed.'));
    }
  },
});

// API route to upload videos
app.post(
  '/upload/:sessionId',
  upload.array('media', 10),
  uploadController.uploadVideo
);

// API route to process timeline data
app.post('/:sessionId/timeline', videoController.generateTimeline);

// API route to serve uploaded files (optional)
app.use('/uploads', express.static(uploadDir));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// function cli(){
//   const services = createDaliMovieServices(EmptyFileSystem);
//   const parse = parseHelper<Script>(services.DaliMovie);
//
//   const daliCode = "";
//   console.log("Code : ", daliCode);
//   const document = await parse(daliCode);
//
//   const model = document.parseResult.value;
//   const python = generateMoviePython(model, "./exemple.dali", "./result.py");
//
//   const command = `python3 ${python}`;
//   exec(command, (error: Error | null, stdout: string, stderr: string) => {
//     if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.error(`Standard Error: ${stderr}`);
//         return;
//     }
//     console.log(stdout);
//   });
// }
