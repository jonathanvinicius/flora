import { Languages } from '../enum';

export interface Ii18nService {
  translate(key: string, lang: Languages): Promise<string>;
  setLanguage(lang: Languages): void;
  getLanguage(): string;
}
