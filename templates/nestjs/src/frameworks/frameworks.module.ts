import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LoggerProviders } from './logger/logger.provider';

@Module({
  imports: [ConfigModule],
  providers: [...LoggerProviders],
  exports: [...LoggerProviders],
})
export class FrameworksModule {}
