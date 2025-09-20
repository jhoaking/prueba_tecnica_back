import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/entiti-file';
import { parse } from 'fast-csv';
import { FilesDto } from './Dto/files.dto';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async processFile(filePath: string) {
    const size = 1000;

    const lote: Partial<User>[] = [];

    const guardarLote = async (row: Partial<User>[]) => {
      if (!row.length) return;

      try {
        const query = await this.userRepository.createQueryBuilder('users');
        await query.insert().into(User).values(row).orIgnore().execute();
        this.logger.log(`Inserted batch of ${row.length} rows`);
      } catch (error) {
        this.logger.error('Error saving batch', error);
      }
    };
    return new Promise((res, rej) => {
      const csv = parse({ headers: true, trim: true })
        .on('error', (error) => rej(error))
        .on('data', async (row: FilesDto) => {
          lote.push({
            ...row,
          });
          if (lote.length >= size) {
            csv.pause(); // pausamos para que no se siga acumulando memoria
            await guardarLote(lote.splice(0, lote.length)); // insertamos y vaciamos batch
            csv.resume(); // reanudamos
          }
        })
        .on('end', async (rowCount: number) => {
          if (lote.length) await guardarLote(lote); // insertamos lo que queda
          fs.unlink(filePath, () => {}); // borramos archivo temporal
          res({ importedRows: rowCount });
        });
      fs.createReadStream(filePath).pipe(csv);
    });
  }
}
