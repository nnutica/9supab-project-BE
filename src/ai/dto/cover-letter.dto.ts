import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CoverLetterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000, { message: 'Job Description ต้องไม่เกิน 5,000 ตัวอักษร' })
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000, { message: 'Resume Text ต้องไม่เกิน 10,000 ตัวอักษร' })
  resumeText: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000, { message: 'ข้อมูลเพิ่มเติมต้องไม่เกิน 2,000 ตัวอักษร' })
  additionalInfo?: string;
}
