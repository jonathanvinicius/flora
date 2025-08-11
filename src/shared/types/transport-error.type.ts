import { RmqContext } from '@nestjs/microservices';

export const AckErrors: string[] = ['E11000'];

export interface TransportError {
  error: any;
  context: RmqContext;
  method: string;
}

export interface TransportArgs {
  key: string;
  context: RmqContext;
  message?: string;
  error?: any;
}

export type TransportMessageArgs = {
  key: string;
  message: string;
  method: string;
  payload: any;
  context: RmqContext;
  callback: any;
};
