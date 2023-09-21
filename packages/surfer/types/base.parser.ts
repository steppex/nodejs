export interface BaseParser {
    parse<T>(data: T): string[];
}
