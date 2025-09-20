import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { excelFilter } from './helpers/file-filter.helper';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../../static/uploads',
        filename: (req, file, cb) => {
          const extention = path.extname(file.originalname);
          cb(null, `${uuid()}${extention}`);
        },
      }),
      fileFilter: excelFilter,
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB máximo
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const result = await this.filesService.processFile(file.path);
    return result;
  }
}
