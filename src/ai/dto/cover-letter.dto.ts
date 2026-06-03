import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CoverLetterDto {
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  resumeText: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
