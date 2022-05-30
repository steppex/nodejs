export interface ClickHouseConfig {
  url: string;
  mode?: 'explain' | 'run';
  client?: {
    compression?: string;
    keep_alive_timeout?: number;
    session_timeout?: number;
  };
  query?: {
    database?: string;
    user?: string;
    password?: string;
    format?: string;
    default_format?: string;
    max_result_rows?: number;
    max_result_bytes?: number;
    result_overflow_mode?: string;
  };
}
export interface ClickHouseOptions {
  host?: string;
  port?: number;
  protocol?: string;
  query?: ClickHouseConfig['query'];
  mode?: ClickHouseConfig['mode'];
  client?: ClickHouseConfig['client'];
}

export enum CHFormatType {
  JSONEachRow = 'JSONEachRow',
}

export interface CHInsertOptions {
  format: CHFormatType;
}

export interface ResponseData<T = { [k: string]: any }> {
  meta: { [k: string]: string }[];
  data: T[];
  rows: number;
}

export interface ClickHouseResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ColumnDefInfo {
  name: string;
  type: string;
  default_type: string;
  default_expression: string;
  comment: string;
  codec_expression: string;
  ttl_expression: string;
  is_subcolumn: string;
}
