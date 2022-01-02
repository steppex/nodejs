import * as request from 'supertest';
import * as assert from 'assert';
import app from './server';

describe('XMLBodyParser (e2e)', () => {
  const xmlRaw = `
  <xml>
    <ToUserName>jwolf</ToUserName>
    <FromUserName>青青草原</FromUserName>
    <CreateTime>1640563650026</CreateTime>
    <MsgType>text</MsgType>
    <Content>hello</Content>
    <MsgId>1234567890123456</MsgId>
  </xml>
  `;
  const jsonBody = {
    ToUserName: 'jwolf',
    FromUserName: '青青草原',
    CreateTime: '1640563650026',
    MsgType: 'text',
    Content: 'hello',
    MsgId: '1234567890123456',
  };
  it('POST: /test', async () => {
    const res = await request(app)
      .post('/test')
      .set('content-type', 'text/xml')
      .send(xmlRaw)
      .expect(200);
    assert.strictEqual(res.text, JSON.stringify(jsonBody));
  });
});
