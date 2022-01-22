import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
// import { Socket } from 'socket.io';

import { LABELS, START_NOW, REQ_ID, SKIP_FORMAT_RES } from './constant';
import { isObject } from '../utils';
import { CustomLogger } from '../frameworks/logger/logger.service';
import { RequestLog } from '../config/dto/request-log.dto';
import {
  HttpArgumentsHost,
  RpcArgumentsHost,
  WsArgumentsHost,
} from '@nestjs/common/interfaces';

interface IHandleOpt {
  isSkip: boolean;
  logCtx: string;
}
@Injectable()
export class FormatInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(execCtx: ExecutionContext, next: CallHandler): Observable<any> {
    const logCtx = this.constructor.name;
    const isSkip = this.reflector.get<boolean>(
      SKIP_FORMAT_RES,
      execCtx.getHandler(),
    );
    const opt: IHandleOpt = {
      isSkip,
      logCtx,
    };
    switch (execCtx.getType()) {
      case 'http':
        return HttpHandler(execCtx.switchToHttp(), next, opt);
      case 'ws':
        return WsHandler(execCtx.switchToWs(), next, opt);
      case 'rpc':
        return RpcHandler(execCtx.switchToRpc(), next, opt);
    }
  }
}

function HttpHandler(
  http: HttpArgumentsHost,
  next: CallHandler,
  opt: IHandleOpt,
) {
  const request = http.getRequest<Request>();
  const labels = request[LABELS];
  http.getResponse<Response>().send('success');
  return next.handle().pipe(
    map((x) => {
      let resBody = x;
      if (!opt.isSkip) {
        const body: { code: number; msg: string; data?: any } = {
          code: 0,
          msg: 'ok',
        };
        if (isObject(x) as any) {
          _.has(x, 'code') && ((body.code = x.code), delete x.code);
          _.has(x, 'msg') && ((body.msg = x.msg), delete x.msg);
          switch (_.size(x)) {
            case 0:
              break;
            case 1:
              if (_.has(x, 'data')) {
                body.data = x.data;
                break;
              }
            default:
              body.data = x;
          }
        } else {
          body.data = x;
        }
        resBody = body;
      }
      const now = Date.now();
      CustomLogger.loggerLogical.verbose(
        new RequestLog({
          way: 'HTTP',
          headers: request.headers,
          method: request.method,
          route: request.path,
          reqId: labels[REQ_ID],
          start: new Date(labels[START_NOW]),
          end: new Date(now),
          duration: `+${now - labels[START_NOW]}ms`,
          req: {
            query: request.query,
            params: request.params,
            body: request.body,
          },
          res: resBody,
          code: resBody?.code ?? 0,
          desc: resBody?.msg ?? 'ok',
        }),
        opt.logCtx,
      );
      return resBody;
    }),
  );
}

// todo
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WsHandler(ws: WsArgumentsHost, next: CallHandler, opt: IHandleOpt) {
  // const socket = ws.getClient(); // as Socket;
  return next.handle();
}

// todo
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RpcHandler(rpc: RpcArgumentsHost, next: CallHandler, opt: IHandleOpt) {
  return next.handle();
}
