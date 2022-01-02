import * as express from 'express';
import { Express, Request, Response } from 'express';
import { XMLParseMiddleware } from '../src';

const app: Express = express();
app.use(XMLParseMiddleware());
app.post('/test', async (req: Request, res: Response) => {
  res.end(JSON.stringify(req.body || {}));
});

export default app;
