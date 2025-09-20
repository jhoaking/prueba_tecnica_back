import { IsString } from 'class-validator';

export class FilesDto {
  @IsString()
  firstNme: string;

  @IsString()
  lastName: string;

  @IsString()
  email1: string;

  @IsString()
  email2: string;

  @IsString()
  profession: string;
}
