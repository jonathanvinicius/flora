/**
 * Enum that defines the prefix used in i18n translation files.
 * These prefixes help identify the domain of the messages,
 * such as 'common', 'error', etc.
 *
 * Example:
 * - pt-BR/common.ts
 * - pt-BR/error.ts
 * - en-US/error.ts
 */
export enum TranslationFilePrefix {
  COMMON = 'common',
  ERROR = 'error',
}
