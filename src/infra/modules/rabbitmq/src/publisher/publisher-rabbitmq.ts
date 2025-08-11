import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMqPublisher {
  private readonly logger = new Logger(RabbitMqPublisher.name);

  constructor(private readonly client: ClientProxy) {}

  async emit(pattern: string, payload: any): Promise<void> {
    this.logger.log(`Emit -> ${pattern}`);
    await lastValueFrom(this.client.emit(pattern, payload));
  }

  async send<T = any, R = any>(pattern: string, payload: T): Promise<R> {
    this.logger.log(`Send -> ${pattern}`);
    return await lastValueFrom(this.client.send<R, T>(pattern, payload));
  }
}
