const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Enable CORS for frontend communication
app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({extended: true})); // Parse URL-encoded payloads

// Directory to store uploaded files
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Create a directory for each session ID if it doesn't exist
const ensureSessionDir = (sessionId) => {
    const sessionDir = path.join(uploadDir, sessionId);
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir);
    }
    return sessionDir;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const sessionId = req.params.sessionId;
        if (!sessionId) {
            return cb(new Error("Session ID is required"));
        }

        const sessionDir = ensureSessionDir(sessionId);
        cb(null, sessionDir); // Save files to the session-specific directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({
    storage,
    limits: {fileSize: 500 * 1024 * 1024}, // 500 MB limit per file
    fileFilter: (req, file, cb) => {
        console.log("File MIME Type:", file.mimetype, "File Name:", file.originalname);
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
app.post("/upload-videos/:sessionId", upload.array("videos", 10), (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        if (!sessionId) {
            return res.status(400).json({success: false, message: "Session ID is required"});
        }

        // return all files in the folder
        const sessionDir = ensureSessionDir(sessionId);
        const files = fs.readdirSync(sessionDir).map((filename) => ({
            filename,
            url: `http://localhost:${PORT}/uploads/${sessionId}/${filename}`,
        }));
        res.status(200).json({success: true, files});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
});

// API route to serve uploaded files (optional)
app.use("/uploads", express.static(uploadDir));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
