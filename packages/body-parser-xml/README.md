# `express-body-parser-xml`

The pkg is a extension relative to the [body-parser](https://github.com/expressjs/body-parser) library. you can use it to parser xml data and convert into JavaScript Object, mounting on req.body.

The config options is highly opened：

- you can use your `read` to extract raw body from request stream if you think the default is not satisfied with your case.
- you can custom parser xml, just to set the parser into options, passing in middleware.

## Installation

```shell
$ npm install express-body-parser-xml
```

## Usage

for js

```js
const { XMLParseMiddleware } = require('express-body-parser-xml');
app.use(XMLParseMiddleware());
```

for ts

```ts
import { XMLParseMiddleware } from 'express-body-parser-xml';
app.use(XMLParseMiddleware());
```

### Options

- types
  - an array of types to match incoming request `content-type`.
- limit
  - only parser `content-length` less than limit body.
- charset
  - ascii
  - utf8
  - utf-8
  - utf16le
  - ucs2
  - ucs-2
  - base64
  - base64url
  - latin1
  - binary
  - hex
- parser
  - parser text to js object, the default is xml2js.
- defaultParserOpts
  - parserOpts for xml2js parser
- read
  - extract data from request stream.

### Default Options

```ts
{
  types: ['*/xml', '+xml'],
  limit: '1mb',
  charset: 'utf8',
  parser: defaultParser,
  defaultParserOpts: { async: true, explicitArray: false },
  read: defaultRead,
}
```

### Custom Parser type

```ts
type IParser = (xmlRaw: string) => Promise<Record<string, any>>;
```

### Custom Read

It will be considered to be right, when only the readRes.status === 200.

```ts
interface IReadRes {
  status: number;
  msg?: string;
  rawBody: string;
}
type IRead = (req: Request, opts: IXmlOptions) => Promise<IReadRes>;
```

## Example

for js

```js
const express = require('express');
const { XMLParseMiddleware } = require('express-body-parser-xml');
const app = express();
app.use(XMLParseMiddleware({ limit: '2mb' }));
app.post('/test', async (req, res) => {
  res.end(JSON.stringify(req.body));
});
```

for ts

```ts
import * as express from 'express';
import { XMLParseMiddleware } from 'express-body-parser-xml';
const app = express();
app.use(
  XMLParseMiddleware({
    types: ['text/xml'],
    limit: '2mb',
  }),
);
app.post('/test', async (req: express.Request, res: express.Response) => {
  res.end(JSON.stringify(req.body));
});
```

## Motivation

The chance to build this pkg is that i failed to find one pkg to use easily that parser xml as middleware, when i develop my wechat account service.

After refer to relevant packages, such as [body-parser-xml](https://www.npmjs.com/package/body-parser-xml), [body-parser](https://www.npmjs.com/package/body-parser), [xml2js](https://www.npmjs.com/package/xml2js), [type-is](https://www.npmjs.com/package/type-is) and so on. i write this pkg by ts.

In brief, thanks a lot, owing to the above pkgs, this pkg can born.

## License

MIT
