import { config } from '@config';
import { scopedLogger } from '@logger';
import { connect, Connection, Channel } from 'amqplib';
import { startCallbackConsumer } from './response';

const log = scopedLogger('rabbitmq');

let connection: Connection | null = null;
let channel: Channel | null = null;
let callbackQueue: string | null = null;

export async function setupRabbitMQ() {
  log.info(`connecting to rabbitmq...`, { evt: 'connect' });
  connection = await connect(config.rabbitmq.url);
  channel = await connection.createChannel();

  const callbackQueueRes = await channel.assertQueue('', {
    autoDelete: true,
    exclusive: true,
  });
  callbackQueue = callbackQueueRes.queue;

  startCallbackConsumer();

  log.info(`Connected to RabbitMQ!`, { evt: 'success' });
}

export function getRMQ(): Channel | null {
  return channel;
}

export function getCallbackQueue(): string | null {
  return callbackQueue;
}
