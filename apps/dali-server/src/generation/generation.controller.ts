import { Request, Response } from 'express';
import { DALI_MOVIE_LIB_PATH, EXPORTED_PATH } from '../constants.js';
import path from 'path';
import { PORT } from '../main.js';
import fs from 'fs';
import { DaliMovieUtils } from '../service/dali.movie.utils.js';

export class GenerationController {
  private readonly daliMovieUtils: DaliMovieUtils
  constructor() {
    this.daliMovieUtils = new DaliMovieUtils();
  }
    generateVideo = async (req: Request, res: Response) => {
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

            const pythonScriptPath = await this.daliMovieUtils.generatePythonScript(req, sessionId);

            const command = `${
                    process.env.PYTHON_PATH || 'python'
                  } ${pythonScriptPath}`;

                  const env = {
                    ...process.env,
                    PYTHONUNBUFFERED: '1',
                    PYTHONPATH: (process.env['PYTHON_PATH'] || '') + DALI_MOVIE_LIB_PATH,
                  };

                  const { output, errorOutput, exitCode } = await this.daliMovieUtils.executePythonScript(
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
