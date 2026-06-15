import { IsString, IsNotEmpty, IsIn, MaxLength } from 'class-validator';

export class RefineTextDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000, { message: 'ข้อความต้องไม่เกิน 5,000 ตัวอักษร' })
  rawText: string;

  @IsString()
  @IsIn(['boss', 'professor', 'client'])
  recipient: 'boss' | 'professor' | 'client';

  @IsString()
  @IsIn(['semi-formal', 'formal'])
  formality: 'semi-formal' | 'formal';
}
