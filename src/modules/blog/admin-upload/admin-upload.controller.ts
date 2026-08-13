import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminUploadService } from './admin-upload.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// @UseGuards(AdminTokenGuard)
@Controller('admin/uploads')
export class AdminUploadController {
  constructor(private readonly adminUploadService: AdminUploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const filename = await this.adminUploadService.saveImage(file);

    return {
      data: {
        url: `/api/uploads/${filename}`,
      },
    };
  }
}
