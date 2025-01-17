import {DALI_MOVIE_LIB_PATH} from '../constants.js';
import {Request, Response} from 'express';
import { DaliMovieUtils } from '../service/dali.movie.utils.js';

export class VideoController {
  private readonly daliMovieUtils: DaliMovieUtils
  constructor() {
    this.daliMovieUtils = new DaliMovieUtils();
  }

  // Helper function to handle missing session ID
  generateTimeline = async (req: Request, res: Response) => {
    try {
      const sessionId = this.daliMovieUtils.validateSessionId(req, res);
      if (!sessionId) return;

      const pythonScriptPath = await this.daliMovieUtils.generatePythonScript(req, sessionId);
      const command = `${
        process.env.PYTHON_PATH || 'python'
      } ${pythonScriptPath}`;

      const env = {
        ...process.env,
        PYTHONUNBUFFERED: '1',
        PYTHONPATH: (process.env['PYTHON_PATH'] || '') + DALI_MOVIE_LIB_PATH,
      };

      const {output, errorOutput, exitCode} = await this.daliMovieUtils.executePythonScript(
        command,
        env,
        ['timeline']
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

      const parts = output.split('-----');
      const lastPart = parts[parts.length - 1]?.trim();

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
            {name: 'Video', data: []},
            {name: 'Sound', data: []},
            {name: 'Subtitles', data: []},
          ],
          errors: ['Failed to parse output'],
        });
      }
    } catch (error: any) {
      res.status(500).json({success: false, message: error.message});
    }
  };
}
