import {Injectable} from "@nestjs/common";
import {spawn} from 'child_process';
import {DALI_MOVIE_LIB_PATH, PYTHON_PATH} from "../constants";

@Injectable()
export class MoviePyRunnerService {

  async processTimeline(sessionId: string, moviePyScriptPath: string): Promise<any> {

    const command = `${PYTHON_PATH} ${moviePyScriptPath}`;
    const subprocess = spawn(command, ['timeline'], {
      shell: true,
      env: {
        ...process.env,
        PYTHONUNBUFFERED: '1',
        PYTHONPATH: PYTHON_PATH + DALI_MOVIE_LIB_PATH
      },
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
      if (code !== 0) {
        console.error(`Subprocess exited with code ${code}`);
        return {
          success: false,
          message: 'Error executing Python script',
          error: errorOutput,
        };
      } else {
        // Use a regular expression to extract the desired portion
        const parts = output.split('-----');
        let lastPart = parts[parts.length - 1].trim();
        if (lastPart) {
          return {
            success: true,
            timeline: JSON.parse(lastPart.replace(/'/g, '"')),
            errors: [],
          };
        } else {
          throw new Error('Failed to parse output');
        }
      }
    });
  }
}
