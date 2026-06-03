import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class RefineTextDto {
  @IsString()
  @IsNotEmpty()
  rawText: string;

  @IsString()
  @IsIn(['boss', 'professor', 'client'])
  recipient: 'boss' | 'professor' | 'client';

  @IsString()
  @IsIn(['semi-formal', 'formal'])
  formality: 'semi-formal' | 'formal';
}
