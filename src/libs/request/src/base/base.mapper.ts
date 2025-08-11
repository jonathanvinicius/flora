/**
 * Property to custom mapper
 */
export type IMapperProperty = {
  fromJson: (data: any) => any | any[];
};

/**
 * Mapper interface
 */
export interface IMapper {
  /**
   * Parse data from map to T
   */
  fromJson(data: any): any;
}

/**
 * Base mapper
 */
export abstract class BaseMapper<T> implements IMapper {
  /**
   * Parse data from map to T
   */
  abstract fromJson(data: any): T;
}
