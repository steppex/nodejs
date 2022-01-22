export class DateUtil {
  static HOUR = 3600 * 1000;
  /**
   * 返回日期对象对应的本地时间字符串
   * @param date 日期对象 例：2021-01-01 00:00:00.000
   */
  static format2Locale(date = new Date()) {
    return new Date(date.getTime() + 8 * this.HOUR)
      .toISOString()
      .replace('T', ' ')
      .slice(0, -1);
  }

  /**
   * 返回日期对象对应的本地日期字符串
   * @param date 日期对象 例：2021-01-01
   */
  static getDate2Locale(date = new Date()) {
    return new Date(date.getTime() + 8 * this.HOUR).toISOString().slice(0, 10);
  }
}
