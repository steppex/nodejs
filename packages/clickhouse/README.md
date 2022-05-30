# `@justajwolf/clickhouse`

The pkg is clickhouse client for nodejs. in the next, the pkg will add more feature, for example support grpc ……

## Installation

```shell
$ npm install @justajwolf/clickhouse
```

## Usage

```ts
import {
  ClickHouse,
  ColumnDefInfo,
  ResponseData,
} from '@justajwolf/clickhouse';
// import * as assert from 'assert';
const driver = new ClickHouse({
  url: 'http://127.0.0.1:8123/?database=default&user=default&password=',
});

const create_table = `
  CREATE TABLE IF NOT EXISTS codec_example
  (
      id UInt32,
      dt Date CODEC(ZSTD),
      ts DateTime CODEC(LZ4HC),
      float_value Float32 CODEC(NONE),
      double_value Float64 CODEC(LZ4HC(9)),
      value Float32 CODEC(Delta, ZSTD)
  )
  ENGINE = MergeTree() PRIMARY KEY (id)
`;
const res1 = await driver.exec<string>(create_table);
// assert.equal(res1.status, 200);
// assert.equal(res1.data, '');

const res2 = await driver.exec<ResponseData<ColumnDefInfo>>(
  'describe table codec_example',
);
// assert.equal(res2.status, 200);
// assert.equal(res2.data.data.length, 6);

const res3 = await driver.insertOne<string>('codec_example', {});
// assert.equal(res3.status, 200);
// assert.equal(res3.data, '');

const res4 = await driver.insertMany<string>('codec_example', [{}]);
// assert.equal(res4.status, 200);
// assert.equal(res4.data, '');
```

## License

MIT
