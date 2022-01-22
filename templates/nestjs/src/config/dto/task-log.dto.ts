import { Log } from './log.dto';

export class TaskLog extends Log {
  constructor(log: TaskLog) {
    super();
    log.type = 'task';
    Object.assign(this, log);
  }
  declare end: Date;
  declare duration: string;
  declare desc: string;

  reqId: string;
}
