export interface IRabbitMqConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  vhost: string;
  /**
   * Exchange type: topic
   */
  exchange: string;
  /**
   * Queue
   */
  queue: string;
  /**
   * DLQ
   */
  deadLetterQueue: string;
  deadLetterExchange: string;

  get heartbeat(): number;
  get uri(): string;
}
export class RabbitMqConfig implements IRabbitMqConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  vhost: string;
  exchange: string;
  queue: string;
  deadLetterQueue: string | null;
  /**
   * Create Rabbitmq config
   */
  constructor(
    virtualhost: string,
    exchange: string,
    queue: string,
    deadLetterQueue?: string,
    deadLetterExchange?: string,
  ) {
    this.username = process.env.RABBITMQ_USERNAME;
    this.password = process.env.RABBITMQ_PASSWORD;
    this.host = process.env.RABBITMQ_HOST;
    this.port = +process.env.RABBITMQ_PORT;
    /**
     * Virtual host
     */
    this.vhost = virtualhost;
    this.exchange = exchange;
    this.queue = queue;
    this.deadLetterQueue =
      typeof deadLetterQueue === 'string' ? deadLetterQueue : null;
    this.deadLetterExchange =
      typeof deadLetterExchange === 'string' ? deadLetterExchange : null;
  }

  deadLetterExchange: string;

  /**
   * Connection string amqp
   */
  get uri() {
    return `amqp://${this.username}:${this.password}@${this.host}:${this.port}/${this.vhost}`;
  }
  get heartbeat() {
    return 60;
  }
}
