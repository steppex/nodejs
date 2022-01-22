import { Injectable } from '@nestjs/common';
import { DateUtil } from '../utils';
@Injectable()
export class AppService {
  getHello(): string {
    return `[${DateUtil.format2Locale()}] Hello World!`;
  }
}
