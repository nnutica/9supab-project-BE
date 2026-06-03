import { IsString, IsNotEmpty } from 'class-validator';

export class CoverLetterDto {
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  resumeText: string;
}
