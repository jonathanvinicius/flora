import amqplib from 'amqplib';
/**
 * Payload message
 */
export interface TMessage extends Record<string, any> {}
/**
 * Options message
 */
export interface TMessageOptions extends amqplib.Options.Publish {}

//headers => x-delay
//headers => x-retries

/**
 * Exchange type
 */
export type RabbitMqAssertExchange =
  | 'direct'
  | 'topic'
  | 'headers'
  | 'fanout'
  | 'match'
  | string;
