import { Message } from 'amqplib';
import { randomUUID } from 'crypto';
import { getCallbackQueue, getRMQ } from '.';

const standardTimeout = 5 * 1000; // 5 seconds

interface CallbackQueueItem {
  resolve: (reply: any) => void;
  reject: (err: Error) => void;
  id: string;
  timeout: number;
  amount: number;
  messages: any[];
}

interface MessageOptions {
  headers?: Record<string, string>;
  body?: Record<string, any>;
}

interface MessageData {
  headers: Record<string, string>;
  body: Buffer;
}

interface CallbackOptions {
  timeout?: number;
  reply?: boolean;
}

interface CallbackExtraOptions {
  replyAmount: number;
}

interface CallbackData<T = any> {
  promise?: Promise<T>;
  item?: CallbackQueueItem;
  reply: boolean;
}

export interface SendOptions extends MessageOptions, CallbackOptions {
  routingKey: string;
}

export interface BroadcastOptions
  extends MessageOptions,
    CallbackOptions,
    CallbackExtraOptions {
  routingKey: string;
}

const callbackQueue: Map<string, CallbackQueueItem> = new Map();

function buildMessage(options: MessageOptions): MessageData {
  let message: Buffer = Buffer.from('');
  if (options.body) message = Buffer.from(JSON.stringify(options.body));

  const headers = {};
  if (options.headers) Object.assign(headers, options.headers);

  return {
    body: message,
    headers,
  };
}

function buildCallback(
  options: CallbackOptions & Partial<CallbackExtraOptions>,
): CallbackData {
  const shouldReply = !!options.reply;
  if (!shouldReply) {
    return {
      reply: false,
    };
  }

  const correlationId = 'dash-' + randomUUID();

  let promResolve: CallbackQueueItem['resolve'];
  let promReject: CallbackQueueItem['reject'];
  const prom = new Promise<Message>((resolve, reject) => {
    promReject = reject;
    promResolve = resolve;
  });

  const queueItem: CallbackQueueItem = {
    id: correlationId,
    resolve: promResolve,
    reject: promReject,
    timeout: options.timeout ?? standardTimeout,
    amount: options.replyAmount ?? 1,
    messages: [],
  };

  return {
    reply: true,
    item: queueItem,
    promise: prom,
  };
}

export async function sendDirectMessage(
  options: SendOptions,
): Promise<true | Message> {
  const message = buildMessage(options);
  const callback = buildCallback(options);

  const success = getRMQ().publish('', options.routingKey, message.body, {
    replyTo: getCallbackQueue(),
    correlationId: callback.item.id,
    headers: message.headers,
  });
  if (!success) throw new Error('failed to publish');

  // return value without reply
  if (!callback.reply) {
    return true;
  }

  // return value with reply
  addToCallbackQueue(callback.item);
  return await callback.promise;
}

export async function sendBroadcastMessage(
  options: BroadcastOptions,
): Promise<true | Message[]> {
  const message = buildMessage(options);
  const callback = buildCallback(options);

  const success = getRMQ().publish('', options.routingKey, message.body, {
    replyTo: getCallbackQueue(),
    correlationId: callback.item.id,
    headers: message.headers,
  });
  if (!success) throw new Error('failed to publish');

  // return value without reply
  if (!callback.reply) {
    return true;
  }

  // return value with reply
  addToCallbackQueue(callback.item);
  return await callback.promise;
}

function addToCallbackQueue(item: CallbackQueueItem) {
  const id = item.id;
  callbackQueue.set(id, item);
  setTimeout(() => {
    const queueItem = callbackQueue.get(id);
    if (!queueItem) return;
    callbackQueue.delete(id);
    queueItem.reject(new Error('reply timed out'));
  }, item.timeout);
}

export function startCallbackConsumer() {
  getRMQ().consume(getCallbackQueue(), (msg) => {
    const id = msg.properties.correlationId;
    if (!id) return; // no correlation, ignore

    const queueItem = callbackQueue.get(id);
    if (!queueItem) return; // not meant for us? ignore

    queueItem.messages.push(msg);
    if (queueItem.messages.length < queueItem.amount) return; // haven't received all messages, continue

    // all messages received, remove from queue and resolve
    callbackQueue.delete(id);
    queueItem.resolve(queueItem.messages);
  });
}
