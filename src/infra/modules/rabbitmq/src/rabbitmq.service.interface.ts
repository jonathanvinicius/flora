import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { TransportArgs, TransportError } from '@app/shared';
import { MessageHandler } from './interfaces/message-handler.interface';

export type RetryMessageParams = {
  retryLimit?: number;
  headers?:
    | Record<string, any>
    | {
        /** Retry limit for messages */
        'x-retries': number;
        /** Delay for message (Time in miliseconds) */
        'x-delay': number;
        /** Double Retry
         * > When the value is equal to true, doubles the timeout delay value based on the number of message retries.
         */
        doubleRetry: true;
      };
};

export type ProcessMessageProps<T> = {
  context: RmqContext;
  payload: T;
  handler: MessageHandler<T>;
  /**
   * Require all fields from interface
   */
  metadata?: boolean;
  method: string;
  callback?: any;
};

@Injectable()
export abstract class IRabbitMqService {
  /**
   * Handle message from channel
   *
   * > Remove or retry message to queue
   */
  // abstract processMessage<T>(
  //   options: ProcessMessageProps<T>,
  // ): any | Promise<any>;
  /**
   * Handle message from channel
   *
   * > Remove or retry message to queue
   */
  abstract processMessage<T>(
    context: RmqContext,
    payload: T,
    handler: MessageHandler<T>,
    method: string,
    callback?: any,
  ): any | Promise<any>;
  /**
   * Handle message and print logs
   */
  abstract handleError(event: TransportError): string;
  /**
   * Persist message received
   */
  abstract saveMessage(params: TransportArgs): Promise<void>;
  /**
   * Move message to Dead Letter Queue
   * > Retry default: 3
   */
  abstract retryMessage(
    context: RmqContext,
    options?: RetryMessageParams,
  ): any | Promise<any>;
  /**
   * Reprocess message if fail, move message to Dead Letter Queue (DLQ)
   * > Retry default: 3
   */
  abstract retryMessage(
    context: RmqContext,
    retryMax?: number,
  ): any | Promise<any>;
  /**
   * Move message to Dead Letter Queue (DLQ)
   */
  abstract moveMessageToDLQ(context: RmqContext): boolean;
}
