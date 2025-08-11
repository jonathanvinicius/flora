import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { RabbitMqPublisher } from '../publisher/publisher-rabbitmq';

@Injectable()
export class RabbitMqPublisherFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  create(token: string): RabbitMqPublisher {
    const client = this.moduleRef.get<ClientProxy>(token, { strict: false });
    if (!client) {
      throw new Error(`ClientProxy not found for token: ${token}`);
    }
    return new RabbitMqPublisher(client);
  }
}
