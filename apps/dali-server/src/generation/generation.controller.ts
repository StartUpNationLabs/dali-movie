import { Request, Response } from 'express';
import { DALI_MOVIE_LIB_PATH, EXPORTED_PATH } from '../constants.js';
import path from 'path';
import { VideoController } from '../video/video.controller.js';
import { PORT } from '../main.js';
import fs from 'fs';

export class GenerationController {

    async generateVideo(req: Request, res: Response) {
        try {
            const sessionId = req.params.sessionId;
            if (!sessionId) {
              res
                .status(400)
                .json({ success: false, message: 'Session ID is required' });
              return;
            }
            const outputDir = path.join(EXPORTED_PATH,sessionId);

            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }

            const pythonScriptPath = await VideoController.generatePythonScript(req, sessionId);

            const command = `${
                    process.env.PYTHON_PATH || 'python'
                  } ${pythonScriptPath}`;

                  const env = {
                    ...process.env,
                    PYTHONUNBUFFERED: '1',
                    PYTHONPATH: (process.env['PYTHON_PATH'] || '') + DALI_MOVIE_LIB_PATH,
                  };

                  const { output, errorOutput, exitCode } = await VideoController.executePythonScript(
                    command,
                    env,
                    []
                  );

                  if (exitCode !== 0) {
                    console.error(`Subprocess exited with code ${exitCode}`);
                    res.status(500).json({
                      success: false,
                      message: 'Error executing Python script',
                      error: errorOutput,
                    });
                    return;
                  }

                  const parts = output.split("-----");
                  const outputPath = parts[parts.length - 1]?.trim();
                  const suffix = outputPath?.split(EXPORTED_PATH)[1].replaceAll('\\','/');

                  if (!suffix || suffix === '') {
                    res.status(500).json({
                      success: false,
                      message: 'Error executing Python script',
                      error: "No output path found",
                    });
                    return;
                  }

                  res.status(200).json({
                    success: true,
                    message: 'Python script executed successfully',
                    video: `http://localhost:${PORT}/output${suffix}`,
                  })


        } catch (error: any) {
            console.error(error);
            res.status(500).json({ success: false, message: 'error' });
        }
      };
    }
