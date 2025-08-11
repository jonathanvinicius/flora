import { Injectable } from '@nestjs/common';
import { I18nService as NestJsI18nService } from 'nestjs-i18n';
import { Languages } from '../enum';
import { Ii18nService } from '../interfaces';

@Injectable()
export class I18nService implements Ii18nService {
  private language: Languages;

  constructor(private readonly i18n: NestJsI18nService) {
    this.setDefaultLanguage(Languages.PT);
  }

  /**
   * Set the default language for translations
   * @param lang The language to set as default
   */
  setDefaultLanguage(lang: Languages): void {
    this.language = lang;
  }

  /**
   * Translates a key based on the provided language. If no language is provided,
   * it will fallback to the default language.
   * @param key The translation key
   * @param lang The language to translate into (optional)
   * @returns The translated string
   */
  async translate(key: string, lang?: Languages): Promise<string> {
    const language = lang || this.language;

    return await this.i18n.translate(key, {
      lang: language,
    });
  }

  /**
   * Set the default language for translations
   * @param lang The language to set as default
   */
  setLanguage(lang: Languages): void {
    this.language = lang;
  }

  /**
   * Returns the current language set for translations
   * @returns The current language
   */
  getLanguage(): string {
    return this.language;
  }
}
