export type MessageHandler<T> = {
  (payload: T): Promise<any> | any;
};
