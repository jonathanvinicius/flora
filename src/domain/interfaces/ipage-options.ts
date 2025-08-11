/**
 * Pagination options
 */
export interface IPageOptions {
  /**
   * Page to be filter
   */
  page: number;
  /**
   * Limit of records
   */
  limit: number;
  /**
   * Offset from page
   */
  offset: number;
  /**
   * Indicates whether it will be paginated
   */
  paginate?: boolean;
}
