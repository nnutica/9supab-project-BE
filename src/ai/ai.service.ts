import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RefineTextDto } from './dto/refine-text.dto';
import { CoverLetterDto } from './dto/cover-letter.dto';
import { AiResponse } from '../types/ai-response.interface';

@Injectable()
export class AiService {
  private readonly model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is required');

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });
  }

  /* แปลงข้อความดิบ → ภาษาทางการ */
  async refineText(dto: RefineTextDto): Promise<AiResponse> {
    const recipientMap: Record<string, string> = {
      boss: 'หัวหน้า/ผู้บังคับบัญชา',
      professor: 'อาจารย์/คณาจารย์',
      client: 'ลูกค้า/พาร์ทเนอร์ธุรกิจ',
    };

    const formalityMap: Record<string, string> = {
      'semi-formal': 'กึ่งทางการ (สุภาพแต่ไม่เป็นทางการเกินไป)',
      formal: 'ทางการมาก (ภาษาราชการ/องค์กร)',
    };

    const prompt = `คุณคือ "นายสุภาพ" ผู้เชี่ยวชาญด้านการสื่อสารอย่างมืออาชีพ
ภารกิจ: แปลงข้อความดิบให้กลายเป็นข้อความทางการที่สุภาพและเหมาะสม

ข้อมูล:
- ข้อความดิบ: "${dto.rawText}"
- ผู้รับ: ${recipientMap[dto.recipient]}
- ระดับความทางการ: ${formalityMap[dto.formality]}

กฎ:
1. รักษาใจความสำคัญเดิมให้ครบถ้วน
2. ปรับภาษาให้สุภาพ เหมาะสมกับผู้รับและระดับความทางการ
3. ใช้คำลงท้ายที่เหมาะสม
4. เสนอทางเลือก 2 แบบ

ตอบเป็น JSON ตาม schema นี้เท่านั้น:
{
  "status": "success",
  "convertedText": "ข้อความที่แปลงแล้ว",
  "explanation": "อธิบายสั้นๆ ว่าเปลี่ยนอะไรบ้าง",
  "alternatives": ["ทางเลือกที่ 1", "ทางเลือกที่ 2"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text) as AiResponse;
    } catch (error) {
      console.error('Gemini refine error:', error);
      throw new InternalServerErrorException('AI processing failed');
    }
  }

  /* สร้าง Cover Letter จาก JD + Resume */
  async generateCoverLetter(dto: CoverLetterDto): Promise<AiResponse> {
    const additionalBlock = dto.additionalInfo?.trim()
      ? `\n- ข้อมูลเพิ่มเติมจากผู้สมัคร: "${dto.additionalInfo}"`
      : '';

    const prompt = `คุณคือ "นายสมัครงาน" ผู้เชี่ยวชาญด้านการเขียน Cover Letter ระดับมืออาชีพ
ภารกิจ: สร้าง Cover Letter จาก Resume และ Job Description

ข้อมูล:
- Job Description: "${dto.jobDescription}"
- Resume/CV: "${dto.resumeText}"${additionalBlock}

กฎ:
1. วิเคราะห์ JD แล้วเลือก highlight จุดแข็งจาก Resume ที่ตรงกับ JD
2. เขียนเป็นภาษาเดียวกับ JD (ถ้า JD ภาษาอังกฤษ ให้เขียนภาษาอังกฤษ)
3. โครงสร้าง: เปิด-แนะนำตัว, กลาง-จุดแข็งที่ตรง JD, ปิด-แสดงความกระตือรือร้น
4. เสนอทางเลือก 2 แบบ

ตอบเป็น JSON ตาม schema นี้เท่านั้น:
{
  "status": "success",
  "convertedText": "Cover Letter ฉบับเต็ม",
  "explanation": "อธิบายสั้นๆ ว่าเลือก highlight อะไรจาก Resume",
  "alternatives": ["Cover Letter แบบที่ 2", "Cover Letter แบบที่ 3"]
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text) as AiResponse;
    } catch (error) {
      console.error('Gemini cover letter error:', error);
      throw new InternalServerErrorException('AI processing failed');
    }
  }
}
