import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as typeis from 'type-is';
import * as bytes from 'bytes';
import { IXmlOptions } from './typedefs';
import { read } from './readRaw';
import { SAXParser } from './saxParser';

const BODY_LIMIT = 1048576; // 限制body大小为1mb
const OPTS_KEYS = [
  'types',
  'limit',
  'charset',
  'parser',
  'defaultParserOpts',
  'read',
];
const defaultOpts: IXmlOptions = {
  types: ['*/xml', '+xml'],
  limit: '1mb',
  charset: 'utf8',
  parser: SAXParser,
  defaultParserOpts: { async: true, explicitArray: false },
  read,
};

export const defaultParser = SAXParser;
export const defaultRead = read;
/**
 * 解析简单xml类型body
 * @param opts
 * @returns
 */
export function XMLParseMiddleware(options: IXmlOptions = {}): RequestHandler {
  const opts = OPTS_KEYS.reduce((opts, k) => {
    if (k !== 'defaultParserOpts') {
      opts[k] = options[k] ? options[k] : defaultOpts[k] || undefined;
    }
    return opts;
  }, {} as IXmlOptions);
  opts.limit = bytes.parse(opts.limit) || BODY_LIMIT;

  if (!options.defaultParserOpts) {
    opts.defaultParserOpts = defaultOpts.defaultParserOpts;
  } else {
    opts.defaultParserOpts = Object.keys(defaultOpts.defaultParserOpts).reduce(
      (pOpts, k) => {
        pOpts[k] = pOpts[k]
          ? pOpts[k]
          : defaultOpts.defaultParserOpts[k] || undefined;
        return pOpts;
      },
      options.defaultParserOpts,
    );
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    // content-type 不匹配 skip
    if (typeis(req, opts.types) === false) {
      return next();
    }

    // content-length === 0， skip
    if (!typeis.hasBody(req) || !parseInt(req.headers['content-length'])) {
      req.body = {};
      return next();
    }

    // 读取body原始数据
    const readRes = await opts.read(req, opts);
    if (readRes.status !== 200) {
      // 读取body数据失败，响应错误
      return next(readRes);
    }

    // 解析xml
    const [err, body] = await opts
      .parser(readRes.rawBody, opts.defaultParserOpts)
      .then((data: any) => [null, data])
      .catch((err: any) => [err]);
    if (err) {
      err.status = 400;
      return next(err);
    }
    req.body = body?.xml || {};
    next();
  };
}
