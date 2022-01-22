import { LoggerService, LogLevel } from '@nestjs/common';
import { clc, yellow } from '@nestjs/common/utils/cli-colors.util';
import { ILoggerType, Log } from '../../config/dto/log.dto';
import { RequestLog } from '../../config/dto/request-log.dto';
import { TaskLog } from '../../config/dto/task-log.dto';
import { DateUtil, isObject } from '../../utils/index';

type IMessage = RequestLog | TaskLog | string;
interface ICustomLoggerOptions {
  context?: string;
  isTimestampEnabled?: boolean;
  type: ILoggerType;
}

export class CustomLogger implements LoggerService {
  private static logLevels: LogLevel[] = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ];
  private static lastTimestamp?: number;
  private static _instanceLoggerLaunch: CustomLogger;
  private static _instanceLoggerLogical: CustomLogger;

  /**
   * launch logger
   */
  static get loggerLaunch() {
    if (!this._instanceLoggerLaunch) {
      this._instanceLoggerLaunch = new CustomLogger({
        isTimestampEnabled: true,
        type: 'launch',
      });
    }
    return this._instanceLoggerLaunch;
  }

  /**
   * logical logger
   */
  static get loggerLogical() {
    if (!this._instanceLoggerLogical) {
      this._instanceLoggerLogical = new CustomLogger({
        isTimestampEnabled: false,
        type: 'logical',
      });
    }
    return this._instanceLoggerLogical;
  }

  private context: string;
  private isTimestampEnabled: boolean;
  private type: ILoggerType;
  constructor(options = {} as ICustomLoggerOptions) {
    this.context = options.context || '';
    this.isTimestampEnabled = options.isTimestampEnabled;
    this.type = options.type;
  }
  setContext(context: string) {
    this.context = context || '';
    return this;
  }
  error(message: IMessage, trace = '', context?: string) {
    this.callFunction('error', message, context, trace);
  }

  log(message: IMessage, context?: string) {
    this.callFunction('log', message, context);
  }

  warn(message: IMessage, context?: string) {
    this.callFunction('warn', message, context);
  }

  debug(message: IMessage, context?: string) {
    this.callFunction('debug', message, context);
  }

  verbose(message: IMessage, context?: string) {
    this.callFunction('verbose', message, context);
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return CustomLogger.logLevels.includes(level);
  }

  private callFunction(
    name: 'error' | 'log' | 'warn' | 'debug' | 'verbose',
    message: any,
    context?: string,
    trace?: string,
  ) {
    if (!this.isLogLevelEnabled(name)) {
      return;
    }
    const isTimestampEnabled = this.isTimestampEnabled;
    let writeStreamType: any = 'stdout',
      color;
    switch (name) {
      case 'error':
        color = clc.red;
        writeStreamType = 'stderr';
        break;
      case 'log':
        color = clc.green;
        break;
      case 'warn':
        color = clc.yellow;
        break;
      case 'debug':
        color = clc.magentaBright;
        break;
      case 'verbose':
        color = clc.cyanBright;
        break;
    }
    !context && (context = message?.context || this.context || 'UNKNOWN');

    // output text, only when local develop
    if (process.env.LOG_TEXT) {
      const duration = CustomLogger.updateAndGetTimestampDiff(
        this.type === 'launch'
          ? {
              isTimestampEnabled,
              isColor: true,
            }
          : {
              duration: message?.duration || '',
              isColor: true,
            },
      );
      CustomLogger.printMessageText(
        name,
        message,
        color,
        context,
        duration,
        writeStreamType,
      );
      if (name === 'error') {
        CustomLogger.printStackTrace(trace);
      }
      return;
    }

    // output json, default
    if (!isObject(message)) {
      message = new Log({
        type: this.type,
        desc: message,
        start: new Date(),
        duration:
          (this.type === 'launch' &&
            CustomLogger.updateAndGetTimestampDiff({ isTimestampEnabled })) ||
          '',
      });
    }
    if (name === 'error' && trace) {
      message.trace = trace;
    }
    CustomLogger.printMessageJSON(name, message, context, writeStreamType);
  }

  private static printMessageJSON(
    name: string,
    message: RequestLog | TaskLog,
    context: string,
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    !message.context && (message.context = context);
    message.level = name;
    process[writeStreamType ?? 'stdout'].write(JSON.stringify(message) + '\n');
  }

  private static printMessageText(
    name: string,
    message: any,
    color: (message: string) => string,
    context: string,
    duration: string,
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    const output = isObject(message)
      ? `${color('LogDto:')}\n${JSON.stringify(message, null, 2)}\n`
      : color(message);

    const pidMessage = color(`[Nest] ${process.pid} - `);
    const contextMessage = yellow(`[${context}] `);
    const timestamp = DateUtil.format2Locale();
    const logName = color(`[${name.toUpperCase()}]`);
    const computedMessage = `${pidMessage}${timestamp} ${logName} ${contextMessage}${output} ${duration}\n`;

    process[writeStreamType ?? 'stdout'].write(computedMessage);
  }

  private static updateAndGetTimestampDiff(opt: {
    duration?: string;
    isTimestampEnabled?: boolean;
    isColor?: boolean;
  }): string {
    if (opt.duration) {
      return opt.isColor ? yellow(opt.duration) : opt.duration;
    }

    const includeTimestamp =
      CustomLogger.lastTimestamp && opt.isTimestampEnabled;
    const result = includeTimestamp
      ? `+${Date.now() - CustomLogger.lastTimestamp}ms`
      : '';
    CustomLogger.lastTimestamp = Date.now();
    return opt.isColor ? yellow(result) : result;
  }

  private static printStackTrace(trace: string) {
    if (!trace) {
      return;
    }
    process.stderr.write(`${trace}\n`);
  }
}
