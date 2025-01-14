import {Injectable} from "@nestjs/common";
import {MoviePyGeneratorService} from "./movie.py.generator.service";
import {MoviePyRunnerService} from "./movie.py.runner.service";

@Injectable()
export class VideoService {
  constructor(
    private moviePyGeneratorService: MoviePyGeneratorService,
    private moviePyRunnerService: MoviePyRunnerService,
  ) {
  }

  async processTimeline(sessionId: string, daliCode: string): Promise<any> {
    // Generate the movie.py script
    const moviePyScriptPath = await this.moviePyGeneratorService.generateMoviePyScript(daliCode, sessionId);

    // Process the timeline
    return this.moviePyRunnerService.processTimeline(sessionId, moviePyScriptPath);

  }
}
