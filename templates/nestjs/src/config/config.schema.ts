import { Expose, Type } from 'class-transformer';
import { IsString, ValidateNested, IsNotEmpty, IsPort } from 'class-validator';

export class ServerInfo {
  @IsString()
  @IsNotEmpty()
  @Expose()
  appID: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  appSecret: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  token: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  encodingAESKey: string;
}

export class Config {
  @IsString()
  @IsNotEmpty()
  @Expose()
  appName: string;

  @IsPort()
  @Expose()
  port: number;

  @IsString()
  @IsNotEmpty()
  @Expose()
  env: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ServerInfo)
  @Expose()
  serverInfo: ServerInfo;
}
