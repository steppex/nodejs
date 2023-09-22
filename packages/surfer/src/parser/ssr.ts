import { Buffer } from "buffer";
/**
 * 解析ssr协议的订阅数据
 * @param subData 订阅数据
 */
export function parse(subData: string): string[] {
    const decodeSubData = Buffer.from(subData, "base64").toString("utf8");
    const subLists = decodeSubData.split("\n");

    const ssrList: string[] = [];
    const urlPrefix = "ssr://";
    for (const sub of subLists) {
        if (!sub.startsWith(urlPrefix)) {
            continue;
        }
        const urlSuffix = Buffer.from(
            sub.slice(urlPrefix.length),
            "base64",
        ).toString("utf8");
        const url = `${urlPrefix}${urlSuffix}`;
        // const urlObj = new URL(url);
        ssrList.push(url);
    }
    return ssrList;
}
