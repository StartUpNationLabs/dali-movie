import {Controller, Param, Post, Res, UploadedFiles, UseInterceptors} from "@nestjs/common";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {UploadService} from "./upload.service";
import {Response} from "express";

@Controller('upload-videos')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) {
  }

  @Post(':sessionId')
  @UseInterceptors(
    FilesInterceptor('videos', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const sessionId = req.params.sessionId;
          const sessionDir = UploadService.ensureSessionDir(sessionId); // Arrow function keeps `this` context
          cb(null, sessionDir);
        },
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
      limits: { fileSize: 500 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedExtensions = ['mp4', 'avi', 'mov', 'mkv'];
        const ext = file.originalname.split('.').pop() || '';
        if (allowedExtensions.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type. Only video files are allowed.'), false);
        }
      },
    }) as any,
  )
  async uploadVideos(
    @Param('sessionId') sessionId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    try {
      const uploadedFiles = this.uploadService.handleFileUpload(sessionId, files);
      res.status(200).json({success: true, files: uploadedFiles});
    } catch (error: any) {
      res.status(500).json({success: false, message: error.message});
    }
  }

}
