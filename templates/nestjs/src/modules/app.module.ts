import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../config/config.module';
import { FrameworksModule } from '../frameworks/frameworks.module';
import { FormatInterceptor } from '../aop/format.interceptor';
import { CustomExceptionFilter } from '../aop/exception.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValidationPipe } from '../aop/validation.pipe';

@Module({
  imports: [HttpModule, ConfigModule, FrameworksModule],
  controllers: [AppController],
  providers: [
    AppService,
    FormatInterceptor,
    CustomExceptionFilter,
    ValidationPipe,
  ],
})
export class AppModule {}
