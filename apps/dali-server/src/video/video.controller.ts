import {generateMovieFromServerPython} from '@dali-movie/generator';
import {createDaliMovieServices, Script} from '@dali-movie/language';
import {spawn} from 'child_process';
import {EmptyFileSystem} from 'langium';
import {parseHelper} from 'langium/test';
import path from 'path';
import {DALI_MOVIE_LIB_PATH, FONT_PATH, GENERATED_PATH} from '../constants.js';
import {VideoService} from './video.service.js';
import {Request, Response} from 'express';

export class VideoController {

  // Helper function to handle missing session ID
  static validateSessionId = (req: Request, res: Response): string | null => {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      res
        .status(400)
        .json({success: false, message: 'Session ID is required'});
      return null;
    }
    return sessionId;
  };

  // Helper function to parse the Dali code
  static parseDaliCode = async (services: any, daliCode: string): Promise<any> => {
    const parse = parseHelper<Script>(services.DaliMovie);
    return await parse(daliCode);
  };

  // Helper function to generate the Python script path
  static generatePythonScriptPath = (model: any, sessionId: string): string => {
    return generateMovieFromServerPython(
      model,
      path.join(GENERATED_PATH, 'python', sessionId),
      'response.py',
      FONT_PATH.replace(/\\/g, '\\\\')
    );
  };

  // Helper function to execute the Python script
  static executePythonScript = (
    command: string,
    env: NodeJS.ProcessEnv,
    params: string[]
  ): Promise<{ output: string; errorOutput: string; exitCode: number }> => {
    return new Promise((resolve) => {
      const subprocess = spawn(command, params, {
        shell: true,
        env,
      });

      let output = '';
      let errorOutput = '';

      subprocess.stdout.on('data', (data: Buffer) => {
        output += data.toString();
      });

      subprocess.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString();
      });

      subprocess.on('close', (code: number) => {
        resolve({output, errorOutput, exitCode: code});
      });
    });
  };

  // Main function
  generateTimeline = async (req: Request, res: Response) => {
    try {
      const sessionId = VideoController.validateSessionId(req, res);
      if (!sessionId) return;

      const pythonScriptPath = await VideoController.generatePythonScript(req, sessionId);
      const command = `${
        process.env.PYTHON_PATH || 'python'
      } ${pythonScriptPath}`;

      const env = {
        ...process.env,
        PYTHONUNBUFFERED: '1',
        PYTHONPATH: (process.env['PYTHON_PATH'] || '') + DALI_MOVIE_LIB_PATH,
      };

      const {output, errorOutput, exitCode} = await VideoController.executePythonScript(
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

  static async generatePythonScript(req: Request, sessionId: string) {
    const services = createDaliMovieServices(EmptyFileSystem);
    const requestBody = req.body;
    const daliCode = requestBody.langium;

    console.log('Code : ', daliCode);
    const document = await VideoController.parseDaliCode(services, daliCode);
    VideoService.updateFilePath(document, sessionId);

    const model = document.parseResult.value;
    console.log('Code : ', model);

    return VideoController.generatePythonScriptPath(model, sessionId);
  }
}
