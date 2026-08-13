import { Injectable } from '@nestjs/common';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class AdminUploadService {
  async saveImage(file: Express.Multer.File): Promise<string> {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const extension = extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
    const filepath = join(UPLOAD_DIR, filename);

    await writeFile(filepath, file.buffer);

    return filename;
  }
}
