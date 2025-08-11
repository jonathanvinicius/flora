import * as moment from 'moment';

export class DateUtil {
  /**
   * Subtract 3 hours from current date - GMT-3
   *
   * @returns {Date}
   */
  static getDateGMT3Offset(): Date {
    try {
      const date = new Date();
      return new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
    } catch {
      return null;
    }
  }

  /**
   * Get current date with GMT-3 offset and add days
   *
   * @param {number} days - number of days to add to the current date
   * @returns {Date}
   */
  static addDaysToCurrentDate(days: number): Date {
    try {
      const date = new Date();
      const gmt3Date = new Date(
        date.valueOf() - date.getTimezoneOffset() * 60000,
      );
      gmt3Date.setDate(gmt3Date.getDate() + days);
      return gmt3Date;
    } catch {
      return null;
    }
  }

  /**
   * Format the given date using the specified format
   *
   * @param {Date} date - the date to be formatted
   * @param {string} format - the format in which the date should be returned (ex: 'DD/MM/YYYY')
   * @returns {string} - the formatted date string
   */
  static formatDate(date: Date, format: string): string {
    try {
      return moment.utc(date).format(format);
    } catch (error) {
      throw new Error(`Error formatting date ${error.message}`);
    }
  }
}
