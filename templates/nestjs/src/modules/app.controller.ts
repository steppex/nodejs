import * as crypto from 'crypto';
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '../config/config.service';
import { wxGetQueryDto } from './dto/app.wx.dto';
import { SkipFormatRes } from '../aop/format.decorator';

@Controller('/')
export class AppController {
  constructor(
    private readonly config: ConfigService,
    private readonly appService: AppService,
  ) {}

  @Get('/healthz')
  healthz(): string {
    return this.appService.getHello();
  }

  @Get('/wx')
  @SkipFormatRes()
  wxGet(@Query() query: wxGetQueryDto): string {
    const sign = crypto
      .createHash('sha1')
      .update(
        [query.timestamp, query.nonce, this.config.serverInfo.token]
          .sort()
          .join(''),
      )
      .digest('hex');
    return sign === query.signature ? query.echostr : 'Failed';
  }

  @Post('/wx')
  @SkipFormatRes()
  wxPost(@Body() data: any): string {
    console.log(data);
    return 'success';
  }
}
