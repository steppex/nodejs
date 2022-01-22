export * from './date-util';
export * from './string-util';
export * from './json-util';

/**
 * 判断是否是Object
 * @param {*} obj
 * @returns {boolean}
 */
export function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
