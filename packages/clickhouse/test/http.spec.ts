/* eslint-disable @typescript-eslint/no-unused-vars */
import * as assert from "assert";
import { ClickHouse, ColumnDefInfo, ResponseData } from "../src";

describe("test http", () => {
    const driver = new ClickHouse({
        url: "http://127.0.0.1:8123/?database=default&user=default&password=",
    });

    // beforeAll(async () => {
    //   const test_table = `
    //   CREATE TABLE IF NOT EXISTS codec_example
    //   (
    //       id UInt32,
    //       dt Date CODEC(ZSTD),
    //       ts DateTime CODEC(LZ4HC),
    //       float_value Float32 CODEC(NONE),
    //       double_value Float64 CODEC(LZ4HC(9)),
    //       value Float32 CODEC(Delta, ZSTD)
    //   )
    //   ENGINE = MergeTree() PRIMARY KEY (id)
    // `;
    //   const { data, status } = await driver.exec<string>(test_table);
    //   assert.equal(status, 200);
    //   assert.equal(data, '');
    // });
    // it('exec: describe', async () => {
    //   const { data, status } = await driver.exec<ResponseData<ColumnDefInfo>>(
    //     'describe table codec_example',
    //   );
    //   assert.equal(status, 200);
    //   assert.equal(data.data.length, 6);
    // });
    // it('insertOne', async () => {
    //   const { data, status } = await driver.insertOne<string>(
    //     'codec_example',
    //     {},
    //   );
    //   assert.equal(status, 200);
    //   assert.equal(data, '');
    // });
    // it('insertMany', async () => {
    //   const { data, status } = await driver.insertMany<string>('codec_example', [
    //     {},
    //   ]);
    //   assert.equal(status, 200);
    //   assert.equal(data, '');
    // });
});
