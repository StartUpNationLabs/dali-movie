import {Body, Controller, Param, Post} from "@nestjs/common";
import {VideoService} from "./video.service";

@Controller()
export class VideoController {
  constructor(
    private videoService: VideoService,
  ) {
  }

  @Post(':sessionId/timeline')
  async processTimeline(
    @Param('sessionId') sessionId: string,
    @Body() langium: string,
  ) {
    return this.videoService.processTimeline(sessionId, langium);
  }
}
