import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert, Box, CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import axios from "axios";
import { useEditorStore } from "./state";
function sanitizeInput(inputString: string) {
    /**
     * Sanitizes the input string to ensure it only contains characters matching the regex:
     * /[a-zA-Z0-9\-_\\/.]+/
     *
     * @param {string} inputString - The input string to be sanitized.
     * @returns {string} A sanitized string containing only valid characters.
     */

    const pattern = /[a-zA-Z0-9\-_\\/.]+/g;
    const matches = inputString.match(pattern);
    return (matches ? matches.join('') : '').replaceAll(/[\/\\\.\-]/g, "_");
}
const VideoDropzone = ({ uploadUrl, maxFiles = 5, maxSize = 524288000 }: {
    uploadUrl: string,
    maxFiles?: number,
    maxSize?: number
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null as any);
    const [uploadedFiles, setUploadedFiles] = useState([] as { name: string }[]);
    const editor = useEditorStore((state) => state.editor);

    useEffect(() => {
        if (editor) {
            // Extract file names from uploaded files
            const files = uploadedFiles.map((file) => file.name);
            const code = editor.getValue();

            // Regex to match import statements and capture file names
            const regex = /import (video|audio) [a-zA-Z0-9\-_]+ ['"]([^'"]+)['"]/g;
            const matches: string[] = [];
            let match;

            // Extract all file names from the code
            while ((match = regex.exec(code)) !== null) {
                matches.push(match[2]); // Add the captured file name (second group)
            }

            // Find all uploaded files that are not in the code
            const newFiles = files.filter((file) => !matches.includes(file));

            // Add the new files to the code
            if (newFiles.length > 0) {
                const newCode = newFiles
                    .map((file) => `import video ${sanitizeInput(file)} "${file}"`)
                    .join("\n");
                editor.setValue(`${code}\n${newCode}`);
            }
        }
    }, [editor, uploadedFiles]);

    const handleFileUpload = async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("media", file));
        try {
            setUploading(true);
            setError(null as any);

            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Assuming the server returns a list of file names or URLs.
            setUploadedFiles((prevFiles: {
                name: string
            }[]) => [
                    ...(response.data.files.map((file: {
                        filename: string
                    }) => ({ name: file.filename }))),
                ]);
        } catch (err) {
            setError("Some files failed to upload. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        handleFileUpload(acceptedFiles).then(r => { });
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: {
            "video/*": [],
            "audio/*": [],
         }, // Allow video file types
        maxFiles,
        maxSize,
    });

    return (
        <Box
            {...getRootProps()}
            sx={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
                backgroundColor: isDragActive
                    ? "#e3f2fd"
                    : isDragReject
                        ? "#ffebee"
                        : "#fafafa",
                cursor: "pointer",
                transition: "background-color 0.2s ease-in-out",
            }}
        >
            <input {...getInputProps()} />
            <Typography variant="h6">
                {isDragActive
                    ? "Drop the videos here..."
                    : isDragReject
                        ? "Unsupported file type"
                        : "Drag & drop videos here, or click to select files"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {`Max files: ${maxFiles}, Max size per file: ${(maxSize / 1024 / 1024).toFixed(
                    2
                )} MB`}
            </Typography>

            {uploading && (
                <Box mt={2}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary">
                        Uploading...
                    </Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {uploadedFiles.length > 0 && (
                <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                        Uploaded videos:
                    </Typography>
                    <List style={
                        {
                            maxHeight: "40vh",
                            overflowY: "auto"
                        }
                    }>
                        {uploadedFiles.map((file, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={file.name} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default VideoDropzone;
