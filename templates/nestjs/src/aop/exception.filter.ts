/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { yellow, clc } from '@nestjs/common/utils/cli-colors.util';
import { MESSAGES } from '@nestjs/core/constants';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { CustomLogger } from '../frameworks/logger/logger.service';
import { LABELS, START_NOW, REQ_ID } from './constant';
import { RequestLog } from '../config/dto/request-log.dto';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: CustomLogger) {}
  catch(exception: Error, host: ArgumentsHost) {
    if (!(exception instanceof Error)) {
      exception = new Error(`${exception}`);
    }
    const logCtx = this.constructor.name;
    switch (host.getType()) {
      case 'http':
        return HttpHandler(exception, host, this.logger, logCtx);
      case 'ws':
        return WsHandler(exception, host, this.logger, logCtx);
      case 'rpc':
        return RpcHandler(exception, host, this.logger, logCtx);
      default:
        CustomLogger.loggerLogical.error(
          `[UNKNOWN:HostType] ${exception.constructor.name}: ${exception.message}`,
          clc.red(exception.stack.slice(exception.stack.indexOf('\n') + 1)),
          logCtx,
        );
    }
  }
}

function HttpHandler(
  exception: Error,
  host: ArgumentsHost,
  logger: CustomLogger,
  logCtx: string,
) {
  const ctx = host.switchToHttp();
  const request = ctx.getRequest<Request>();
  const response = ctx.getResponse<Response>();
  const reqId = request[LABELS][REQ_ID];
  const reqStart = request[LABELS][START_NOW];

  let resBody;
  if (!(exception instanceof HttpException)) {
    // 非http-exception，统一处理
    resBody = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
    };
    // 防止重复response，造成报错
    !response.writableEnded &&
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(resBody);
  } else {
    const status = exception.getStatus();
    const msg = exception.getResponse();
    if (isObject(msg)) {
      const obj = msg as any;
      resBody = {
        code: obj.code || obj.statusCode,
        msg: obj.msg || obj.message,
        data: obj.data || obj.error,
      };
    } else {
      resBody = { code: status, msg };
    }
    // 防止重复response，造成报错
    !response.writableEnded && response.status(status).json(resBody);
  }

  const now = Date.now();
  logger.error(
    new RequestLog({
      reqId,
      route: request.originalUrl,
      start: new Date(reqStart),
      end: new Date(now),
      duration: `+${now - reqStart}ms`,
      req: {
        query: request.query,
        params: request.params,
        body: request.body,
      },
      res: resBody,
      code: resBody?.code ?? -1,
      desc: exception?.message ?? resBody?.msg ?? 'unknown',
      headers: request.headers,
      way: 'HTTP',
    }),
    exception.stack.slice(exception.stack.indexOf('    at ')),
    logCtx,
  );
}

function WsHandler(
  exception: Error,
  host: ArgumentsHost,
  logger: CustomLogger,
  logCtx: string,
) {
  // todo
}

function RpcHandler(
  exception: Error,
  host: ArgumentsHost,
  logger: CustomLogger,
  logCtx: string,
) {
  // todo
}
