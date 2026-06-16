import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'ยินดีต้อนรับสู่ 9Supab API Service 🚀',
      status: 'online',
    };
  }
}
