export class StringUtil {
  /**
   * 过滤字符串前后的"/'
   * @param str 字符串 例：'"abcdefg"'/"'abcdefg'" => 'abcdefg'
   */
  static filterQuotes(str = '') {
    const [firstChar, lastChar] = [str[0], str[str.length - 1]];
    if (firstChar === lastChar && ["'", '"'].includes(firstChar)) {
      str = str.slice(1, -1);
    }
    return str;
  }
}
