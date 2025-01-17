import { generateMovieFromServerPython } from "@dali-movie/generator";
import { createDaliMovieServices, Script } from "@dali-movie/language";
import { spawn } from "child_process";
import { EmptyFileSystem } from "langium";
import path from "path";
import { GENERATED_PATH, FONT_PATH } from "../constants.js";
import { VideoService } from "../video/video.service.js";
import {Request, Response} from 'express';
import { parseHelper } from "langium/test";

export class DaliMovieUtils {
     // Helper function to handle missing session ID
      validateSessionId = (req: Request, res: Response): string | null => {
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
      parseDaliCode = async (services: any, daliCode: string): Promise<any> => {
        const parse = parseHelper<Script>(services.DaliMovie);
        return await parse(daliCode);
      };
    
      // Helper function to generate the Python script path
      generatePythonScriptPath = (model: any, sessionId: string): string => {
        return generateMovieFromServerPython(
          model,
          path.join(GENERATED_PATH, 'python', sessionId),
          'response.py',
          FONT_PATH.replace(/\\/g, '\\\\')
        );
      };
    
      // Helper function to execute the Python script
      executePythonScript = (
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

      async generatePythonScript(req: Request, sessionId: string) {
          const services = createDaliMovieServices(EmptyFileSystem);
          const requestBody = req.body;
          const daliCode = requestBody.langium;
      
          console.log('Code : ', daliCode);
          const document = await this.parseDaliCode(services, daliCode);
          VideoService.updateFilePath(document, sessionId);
      
          const model = document.parseResult.value;
          console.log('Code : ', model);
      
          return this.generatePythonScriptPath(model, sessionId);
        }
}