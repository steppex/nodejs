import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class wxGetQueryDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  signature: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  echostr: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  nonce: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @Expose()
  timestamp: number;
}
