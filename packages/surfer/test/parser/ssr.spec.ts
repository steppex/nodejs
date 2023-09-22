import { readFileSync, writeFileSync } from "fs";
import { ssrParse } from "../../src";

writeFileSync(
    `${__dirname}/b.txt`,
    JSON.stringify(
        ssrParse(readFileSync(`${__dirname}/a.txt`, { encoding: "utf8" })),
        null,
        4,
    ),
);
