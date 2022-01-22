import { Log } from './log.dto';

export class RequestLog extends Log {
  constructor(log: RequestLog) {
    super();
    log.type = 'request';
    Object.assign(this, log);
  }
  declare end: Date;
  declare duration: string;
  declare desc: string;

  way: string;
  method?: string;
  reqId: string;
  headers: Record<string, any>;
  route: string;
  req: Record<string, any>;
  res: any;
  code: number;
}
