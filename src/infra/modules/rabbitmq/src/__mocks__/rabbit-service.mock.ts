export const MockChannel = {
  ack: jest.fn(),
  nack: jest.fn(),
  sendToQueue: jest.fn(),
};

export const MockMessage = {
  content: Buffer.from(JSON.stringify({ test: 'payload' })),
  fields: { routingKey: 'test_queue' },
  properties: { headers: { 'x-retries': 0 } },
};

export const MockRmqContext = {
  getChannelRef: () => MockChannel,
  getMessage: () => MockMessage,
  getPattern: () => 'test-pattern',
};
