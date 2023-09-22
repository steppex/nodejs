import * as zlib from "zlib";
import { Request } from "express";
import { ParserOptions } from "xml2js";

export type IStreamRead = zlib.Gunzip | zlib.Inflate | Request;
export type IParser = (
    xmlRaw: string,
    opts?: ParserOptions,
) => Promise<Record<string, any>>;

export interface IReadRes {
    status: number;
    msg?: string;
    rawBody: string;
}
export type IRead = (req: Request, opts: IXmlOptions) => Promise<IReadRes>;

export interface IXmlOptions {
    types?: string[] | undefined;
    limit?: number | string | undefined;
    charset?: BufferEncoding;
    parser?: IParser;
    defaultParserOpts?: ParserOptions;
    read?: IRead;
}
