import * as fs from 'fs';
import * as Yaml from 'js-yaml';
import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Config } from './config.schema';

export class ConfigService extends Config {
  private readonly origin_config: Config;

  constructor(filePath: string) {
    super();
    this.origin_config = this.validate(
      Yaml.load(fs.readFileSync(filePath, 'utf8')),
    );
    Object.assign(this, this.origin_config);
  }

  private validate(config: Config): Config {
    config = plainToClass(Config, config, { excludeExtraneousValues: true });
    const errors = validateSync(config);
    if (errors.length > 0) {
      throw new Error(`Config validation error: ${errors}`);
    }
    return plainToClass(Config, config);
  }

  get<T>(key: string): T {
    return this.origin_config[key];
  }
}

export const ConfigServiceProvider = {
  provide: ConfigService,
  useValue: new ConfigService(`${process.cwd()}/config.yaml`),
};
