export type ILoggerType = 'request' | 'task' | 'launch' | 'logical';

export class Log {
  constructor(log?: Log) {
    log && Object.assign(this, log);
  }
  type?: ILoggerType;
  context?: string;
  trace?: string;
  level?: string;

  start?: Date;
  end?: Date;
  duration?: string;

  desc?: string;
}
