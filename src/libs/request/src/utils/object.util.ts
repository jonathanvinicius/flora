import { isDefined } from 'class-validator';

export class ObjectUtil {
  static isEmpty(obj: any): boolean {
    if (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    ) {
      return true;
    }
    return false;
  }
  static isPromise(p: any) {
    if (
      p.constructor.name === 'AsyncFunction' ||
      (typeof p === 'object' &&
        typeof p.then === 'function' &&
        typeof p.catch === 'function')
    ) {
      return true;
    }
    return false;
  }

  /**
   * Remove undefined keys
   *
   * Metadata is a map for ensure a valid key
   *
   * > metadata contains all keys for obj
   */
  static ensure(obj: any, metadata?: any) {
    if (!obj) return {};
    if (metadata) {
      Object.keys(obj).forEach((k) => {
        if (!metadata.includes(k)) {
          delete obj[k];
        }
      });
    }
    //remove undefined values
    Object.keys(obj).forEach((key) => {
      if (!isDefined(obj[key])) {
        delete obj[key];
      }
    });
  }
}
