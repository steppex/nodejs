import { CustomLogger } from './logger.service';

export const LoggerProviders = [
  {
    provide: CustomLogger,
    useValue: CustomLogger.loggerLogical,
  },
];
