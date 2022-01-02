import * as xml from 'xml2js';

export async function SAXParser(
  xmlRaw: string,
  opts?: xml.ParserOptions,
): Promise<Record<string, any>> {
  const parser = new xml.Parser(opts || {});
  return await parser.parseStringPromise(xmlRaw);
}
