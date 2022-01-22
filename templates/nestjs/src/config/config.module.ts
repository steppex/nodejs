import { Module } from '@nestjs/common';
import { ConfigServiceProvider } from './config.service';

@Module({
  providers: [ConfigServiceProvider],
  exports: [ConfigServiceProvider],
})
export class ConfigModule {}
