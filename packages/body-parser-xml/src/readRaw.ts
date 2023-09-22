import { Request } from "express";
import * as zlib from "zlib";
import { IStreamRead, IXmlOptions, IReadRes } from "./typedefs";

/**
 * 读取body原始数据
 * @param req
 * @param opts
 * @returns
 */
export function read(req: Request, opts: IXmlOptions): Promise<IReadRes> {
    const content_encoding =
        req.headers["content-encoding"]?.toLowerCase() || "";
    let stream: IStreamRead = req;

    switch (content_encoding) {
        case "deflate":
            stream = zlib.createInflate();
            req.pipe(stream);
            break;
        case "gzip":
            stream = zlib.createGunzip();
            req.pipe(stream);
            break;
    }
    return new Promise((reslove) => {
        let complete = false;
        let rawBody = "";
        let received = 0;
        // 读取监听
        stream.on("data", onData);
        stream.on("end", onEnd);
        stream.on("error", onEnd);
        stream.on("aborted", onAborted);
        stream.on("close", cleanup);

        // 接收数据
        function onData(chunck) {
            if (complete) return;
            rawBody += chunck.toString(opts.charset);
            received += chunck.length;
            // body数据超过限制
            if (received > opts.limit) {
                done({ status: 413 });
            }
        }
        // 接收结束
        function onEnd(err) {
            if (complete) return;
            if (err) {
                return done({ sus: 400, msg: err?.message || "" });
            }
            done({ status: 200, rawBody });
        }
        // 接收终止
        function onAborted() {
            if (complete) return;
            done({ status: 400, msg: "Request Aborted" });
        }

        // 移除所有读取监听
        function cleanup() {
            stream.off("aborted", onAborted);
            stream.off("data", onData);
            stream.off("end", onEnd);
            stream.off("error", onEnd);
            stream.off("close", cleanup);
        }

        // 读取完成
        function done(result) {
            // 标记完成读取
            complete = true;
            // 移除监听
            cleanup();
            // 返回结果
            reslove(result);
        }
    });
}
