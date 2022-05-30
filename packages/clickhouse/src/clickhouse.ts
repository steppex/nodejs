import * as axios from 'axios';
import { URL } from 'url';
import {
  ClickHouseConfig,
  ClickHouseResponse,
  ClickHouseOptions,
  CHInsertOptions,
  CHFormatType,
} from './types';

export const defaultOptions: ClickHouseOptions = {
  mode: 'run',
  protocol: 'http',
  host: '127.0.0.1',
  port: 8123,
  query: {
    database: 'default',
    user: 'default',
    password: '',
    default_format: 'JSON',
    max_result_rows: 1000,
    max_result_bytes: 10000000,
    result_overflow_mode: 'break',
  },
};

export class ClickHouse {
  private url: URL;
  constructor(private config: ClickHouseConfig) {
    config.mode = config?.mode || 'run';
    config.client = { ...defaultOptions?.client, ...config?.client };
    config.query = { ...defaultOptions?.query, ...config?.query };
    const url = (this.url = new URL(config.url));
    const searchParams = url.searchParams;
    Object.keys(config.query).forEach((k) => {
      if (!searchParams.has(k)) searchParams.set(k, config.query![k]);
    });
  }

  private async send<T>(sql: string): Promise<ClickHouseResponse<T>> {
    const response = await axios.default
      .post<T>(this.url.toString(), sql, {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
        },
      })
      .catch((err) => {
        // 业务层错误可以返回请求信息，即：状态码 !== 200
        const res = err.response as axios.AxiosResponse<T>;
        if (res) {
          return res;
        }
        throw err;
      });
    return {
      data: response.data as any,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async exec<T>(sql: string): Promise<ClickHouseResponse<T>> {
    return await this.send<T>(sql);
  }

  private encodeData(data: any = {}, format: CHFormatType) {
    switch (format) {
      case CHFormatType.JSONEachRow:
        return JSON.stringify(data);
      default:
        return '';
    }
  }

  async insertOne<T>(
    tableName: string,
    data: any,
    opts: CHInsertOptions = { format: CHFormatType.JSONEachRow },
  ): Promise<ClickHouseResponse<T>> {
    const sql = `insert into ${tableName} format ${
      opts.format
    } ${this.encodeData(data, opts.format)}`;
    return await this.exec<T>(sql);
  }

  async insertMany<T = any>(
    tableName: string,
    list: any[],
    opts: CHInsertOptions = { format: CHFormatType.JSONEachRow },
  ): Promise<ClickHouseResponse<T>> {
    let dataStr = `${this.encodeData(list.pop(), opts.format)}`;
    for (const data of list) {
      dataStr += ` ${this.encodeData(data, opts.format)}`;
    }
    const sql = `insert into ${tableName} format ${opts.format} ${dataStr}`;
    return await this.exec<T>(sql);
  }
}
