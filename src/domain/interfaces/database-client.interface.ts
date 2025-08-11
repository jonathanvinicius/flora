export abstract class IDatabaseClient<T = unknown, TConfig = unknown> {
  startConnection: (config: TConfig) => Promise<void>;
  closeConnection: () => Promise<void>;
  getClient: () => T;
  healthCheck?: () => Promise<boolean>;
  initializeSchemas?: () => Promise<void>;
}
