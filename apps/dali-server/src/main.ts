import express, {Request, Response} from "express";
import multer, {StorageEngine} from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import {spawn} from "child_process";

import {EmptyFileSystem, LangiumDocument} from "langium";
import {parseHelper} from "langium/test";
import {createDaliMovieServices, Script} from "@dali-movie/language";
import {generateMoviePython} from "@dali-movie/generator";
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const app = express();
const PORT = 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_PATH = __dirname;
// Enable CORS for frontend communication
app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({extended: true})); // Parse URL-encoded payloads

// Directory to store uploaded files
const uploadDir = path.join(BASE_PATH, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir,
    {recursive: true});
}

// Create a directory for each session ID if it doesn't exist
const ensureSessionDir = (sessionId: string): string => {
  const sessionDir = path.join(uploadDir, sessionId);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir);
  }
  return sessionDir;
};

// Configure multer for file uploads
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      return cb(new Error("Session ID is required"), "");
    }

    const sessionDir = ensureSessionDir(sessionId);
    cb(null, sessionDir); // Save files to the session-specific directory
  },
  filename: (req: Request, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {fileSize: 500 * 1024 * 1024}, // 500 MB limit per file
  fileFilter: (req: Request, file, cb) => {
    console.log(
      "File MIME Type:",
      file.mimetype,
      "File Name:",
      file.originalname
    );
    const allowedExtensions = [".mp4", ".avi", ".mov", ".mkv"];

    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Only video files are allowed."));
    }
  },
});

// API route to upload videos
app.post(
  "/upload-videos/:sessionId",
  upload.array("videos", 10),
  (req: Request, res: Response) => {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId) {
        res
          .status(400)
          .json({success: false, message: "Session ID is required"});
        return;
      }

      // return all files in the folder
      const sessionDir = ensureSessionDir(sessionId);
      const files = fs.readdirSync(sessionDir).map((filename) => ({
        filename,
        url: `http://localhost:${PORT}/uploads/${sessionId}/${filename}`,
      }));
      res.status(200).json({success: true, files});
    } catch (error: any) {
    }
    res.status(500).json({success: false, message: "error"});
  }
);

// API route to process timeline data
app.post("/:sessionId/timeline", async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      res
        .status(400)
        .json({success: false, message: "Session ID is required"});
      return;
    }

    const services = createDaliMovieServices(EmptyFileSystem);
    const parse = parseHelper<Script>(services.DaliMovie);

    const requestBody = req.body;
    const daliCode = requestBody.langium;
    console.log("Code : ", daliCode);

    const document = await parse(daliCode);
    updateFilePath(document, "out/uploads/" + sessionId + "/");
    const model = document.parseResult.value;

    console.log("Code : ", model);
    const pythonScriptPath = generateMoviePython(
      model,
      BASE_PATH + "/python",
      BASE_PATH + "/python/" + sessionId
    );

    const command = `${
      process.env.PYTHON_PATH || "python"
    } ${pythonScriptPath}`;
    const subprocess = spawn(command, [], {
      shell: true,
      env: {
        ...process.env, // Conservez les variables d'environnement existantes
        PYTHONUNBUFFERED: "1", // Pour éviter les problèmes de buffering
        PYTHONPATH:
          (process.env["PYTHON_PATH"] || "") +
          path.join(BASE_PATH, "../../libs/python/"), // Ajoutez le chemin du script Python
      },
    });
    let output = "";
    let errorOutput = "";

    subprocess.stdout.on("data", (data: Buffer) => {
      output += data.toString();
    });

    subprocess.stderr.on("data", (data: Buffer) => {
      errorOutput += data.toString();
    });

    subprocess.on("close", (code: number) => {
      if (code !== 0) {
        console.error(`Subprocess exited with code ${code}`);
        res.status(500).json({
          success: false,
          message: "Error executing Python script",
          error: errorOutput,
        });
      } else {
        // Use a regular expression to extract the desired portion
        const parts = output.split("-----");
        let lastPart = parts[parts.length - 1].trim();
        if (lastPart) {
          res.status(200).json({
            success: true,
            timeline: JSON.parse(lastPart.replace(/'/g, '"')),
            errors: [],
          });
        } else {
          res.status(400).json({
            success: false,
            timeline: [
              {
                name: "Video",
                data: [],
              },
              {
                name: "Sound",
                data: [],
              },
              {
                name: "Subtitles",
                data: [],
              },
            ],
            errors: ["Failed to parse output"],
          });
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({success: false, message: error.message});
  }
});

// API route to serve uploaded files (optional)
app.use("/uploads", express.static(uploadDir));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Update file paths
function updateFilePath(
  document: LangiumDocument<Script>,
  prefix: string
): void {
  const rootNode = document.parseResult?.value;
  if (!rootNode) {
    console.error("Failed to parse the document.");
    return;
  }

  document.parseResult.value.commands.forEach((command) => {
    switch (command.$type) {
      case "LoadVideo":
      case "LoadAudio":
        command.file = prefix + command.file;
    }
  });

  const exportValue = document.parseResult.value.export;
  if (exportValue) {
    exportValue.file = prefix + exportValue.file;
  }
}

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
