import { MessageHandler } from './interfaces/message-handler.interface';
import { Injectable, Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { AckErrors, TransportArgs, TransportError } from '@app/shared';

import * as amqplib from 'amqplib';

import {
  IRabbitMqService,
  RetryMessageParams,
} from './rabbitmq.service.interface';

/**
 * Retry limit for DLQ *
 */
const RETRY_LIMIT = 3;

@Injectable()
export class RabbitMqService implements IRabbitMqService {
  private readonly logger = new Logger(RabbitMqService.name);

  async processMessage<T>(
    context: RmqContext,
    payload: T,
    handler: MessageHandler<T>,
    method: string,
    callback?: any,
  ) {
    try {
      const channel = context.getChannelRef() as amqplib.Channel;
      const originalMsg = context.getMessage() as amqplib.Message;
      if (!payload) {
        this.logger.error(`${method}: Invalid message received`);
        channel.ack(originalMsg);
        return;
      }
      this.logger.log(`Processing ${method}`);

      //process message
      await handler(payload);

      //has  callback
      if (callback) {
        if (
          callback &&
          Object.keys(callback).length === 0 &&
          Object.getPrototypeOf(callback) === Object.prototype
        ) {
          await callback();
        } else {
          callback();
        }
      }
      //remove message from queue
      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`processMessage: Error: ${error.message}`);
      throw error;
    }
  }

  async saveMessage(params: TransportArgs) {
    try {
      const { context } = params;
      const originalMsg = context.getMessage();
      const pattern = context.getPattern();
      const queue = originalMsg.fields.routingKey;

      this.logger.log(`[AMQP] Save message ${queue}=>${pattern}`);
    } catch (error) {
      this.logger.error(`saveMessage: Error: ${error.message}`);
    }
  }

  retryMessage(context: RmqContext, options: RetryMessageParams): any;
  retryMessage(context: RmqContext, retryMax?: number): any;

  async retryMessage(context: RmqContext, options: unknown) {
    let messageOptions = {
      retryLimit: RETRY_LIMIT,
    } as RetryMessageParams;

    try {
      const message = context.getMessage() as amqplib.Message;
      const channel = context.getChannelRef() as amqplib.Channel;
      const pattern = context.getPattern();
      // routing key equivalent to queue name
      const queue = message.fields.routingKey;
      // headers parameters
      const headers = message.properties.headers;
      let retries = headers['x-retries'] || 0;
      // increment retry
      retries += 1;
      // concat paramters options message
      if (typeof options === 'number') {
        messageOptions.retryLimit = options;
      } else if (options) {
        messageOptions = options as RetryMessageParams;
        messageOptions.headers = {
          ...headers,
          ...messageOptions.headers,
          // Update headers for retry count
          'x-retries': retries,
        };
        //delay
        const xDelay = messageOptions.headers['x-delay'];
        messageOptions.retryLimit = messageOptions.retryLimit ?? RETRY_LIMIT;
        //double delay for next retry
        // when is not first retry
        if (retries > 1 && xDelay && messageOptions.headers.doubleRetry) {
          messageOptions.headers['x-delay'] = retries * xDelay;
        }
      }
      // handle retries
      if (retries > messageOptions.retryLimit) {
        this.logger.log(`[AMQP] Moving message ${queue}=>${pattern} to DLQ`);
        // Rejects the message without requeueing, moving it to the DLQ.
        // Reject without requeue
        channel.nack(message, false, false);
      } else {
        this.logger.log(
          `[AMQP] [${retries}] Retry ${retries} message ${queue}=>${pattern}`,
        );

        // Acknowledge successful processing
        channel.ack(message);

        // resend message with headers
        channel.sendToQueue(queue, message.content, messageOptions);
      }
    } catch (error) {
      this.logger.error(`retryMessage: Error: ${error.message}`);
    }
  }

  moveMessageToDLQ(context: RmqContext) {
    try {
      const message = context.getMessage() as amqplib.Message;
      const channel = context.getChannelRef() as amqplib.Channel;
      const pattern = context.getPattern();
      // routing key equivalent to queue name
      const queue = message.fields.routingKey;
      this.logger.log(`[AMQP] Moving message ${queue}=>${pattern} to DLQ`);
      // Rejects the message without requeueing, moving it to the DLQ.
      // Reject without requeue
      channel.nack(message, false, false);
      return true;
    } catch (error) {
      this.logger.error(`moveMessageToDLQ: Error: ${error.message}`);
      return false;
    }
  }

  /**
   * Handle error message
   */
  handleError(event: TransportError) {
    const { context, error, method } = event;
    const channel = context.getChannelRef() as amqplib.Channel;
    const originalMsg = context.getMessage() as amqplib.Message;
    try {
      const isAckError = AckErrors.some((err) => error.message.includes(err));
      if (isAckError) {
        // remove message from queue
        channel.ack(originalMsg);
      }
    } catch (ackError) {
      this.logger.error(
        `${method}: Failed to ack message: ${ackError.message}`,
      );
    }
    this.logger.error(`${method}: Error: ${error.message}`);
    return error;
  }
}
