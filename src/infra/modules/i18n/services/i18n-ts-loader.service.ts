import { I18nLoader } from 'nestjs-i18n';
import * as path from 'path';
import { promises as fs } from 'fs';
import { Languages } from '../enum';
import { Observable } from 'rxjs';

/**
 * Custom loader service for loading i18n translation files written in TypeScript.
 * It implements the `I18nLoader` interface provided by nestjs-i18n.
 *
 * This loader supports dynamic import of translation files organized by language and domain.
 * For example:
 * - languages/pt/common.ts
 * - languages/en/error.ts
 */

export class I18nTsLoaderService implements I18nLoader {
  private readonly supportedLanguages = [Languages.PT, Languages.EN];

  /**
   * Returns the list of supported languages.
   * This method is required by the I18nLoader interface.
   *
   * @returns A Promise that resolves to an array of supported language codes.
   *
   * Example:
   * ```ts
   * ['pt-BR', 'en-US']
   * ```
   */
  languages(): Promise<string[] | Observable<string[]>> {
    return Promise.resolve(this.supportedLanguages);
  }

  /**
   * Dynamically loads all translation files from the `languages` directory,
   * organized by language and domain (e.g., `common`, `error`, etc).
   *
   * It scans each language folder, imports each `.ts` file (except `index.ts`),
   * and builds a nested translation object with the format:
   *
   * Example result:
   * ```ts
   * {
   *   pt-BR: {
   *     common: { ... },
   *     error: { ... }
   *   },
   *   en-US: {
   *     common: { ... },
   *     error: { ... }
   *   }
   * }
   * ```
   *
   * @returns A Promise that resolves to a nested translation object.
   */

  async load(): Promise<Record<string, any>> {
    const translations = {};
    const baseDir = path.join(__dirname, '../languages');

    for (const lang of this.supportedLanguages) {
      const langPath = path.join(baseDir, lang);
      const files = await fs.readdir(langPath);

      translations[lang] = {};

      for (const file of files) {
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);

        if (baseName === 'index' || ext !== '.js') continue;

        const filePath = path.join(langPath, file);
        const module = await import(filePath);

        translations[lang][baseName] = module[baseName];
      }
    }

    return translations;
  }
}
