export class JsonUtil {
  /**
   * 字符串转json, 失败则设置为默认值
   */
  static tryParse(jsonString: string, defaultValue: any = {}) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return defaultValue;
    }
  }
}
