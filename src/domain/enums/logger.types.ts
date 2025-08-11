import { HttpStatus } from '@nestjs/common';

/**
 * Módulos/Serviços
 **/
export enum LogEnum {
  /**
   * template
   */
  TPL = 'TPL',
}

export type LogPrefix = keyof typeof LogEnum;

/**
 * Módulos/Serviços
 **/
export type LogType = `${LogEnum}`;
/**
 * Types
 */

export enum LogCodeTypeEnum {
  /**
   * Success
   **/
  S = 'S',
  /*
   * Error
   */
  E = 'E',
  /**
   * Info
   */
  I = 'I',
  /**
   * Hist
   */
  H = 'H',
}

export type LogCodeType = `${LogCodeTypeEnum}`;
/**
 * Status codes (type)
 */
export type LogStatusCodeType = HttpStatus;

export type LogCode =
  `${LogPrefix}-${LogCodeType}${LogStatusCodeType}${string}`;

export enum LogLevelEnum {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  FATAL = 'fatal',
}

export type LogLevel = `${LogLevelEnum}`;

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
}
