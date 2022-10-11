import { randomUUID } from 'crypto';
import { getCallbackQueue, getRMQ } from '.';

// TODO broadcast

const standardTimeout = 5 * 1000;

interface SendOptions {
  queue: string;
  body?: Record<string, any>;
  reply?: boolean;
  headers?: Record<string, string>;
  timeout?: number;
}

interface CallbackQueueItem {
  resolve: (reply: any) => void;
  reject: (err: Error) => void;
  id: string;
  timeout: number;
}

const callbackQueue: Map<string, CallbackQueueItem> = new Map();

export async function sendDirectMessage<T>(options: SendOptions) {
  let message: Buffer = Buffer.from('');
  if (options.body) message = Buffer.from(JSON.stringify(options.body));

  const headers = {};
  if (options.headers) Object.assign(headers, options.headers);

  const shouldReply = !!options.reply;
  let correlationId: undefined | string;
  let queueItem: CallbackQueueItem | undefined;
  let prom: Promise<T> | undefined;
  if (shouldReply) {
    correlationId = randomUUID();
    let promResolve: CallbackQueueItem['resolve'];
    let promReject: CallbackQueueItem['reject'];
    prom = new Promise<T>((resolve, reject) => {
      promReject = reject;
      promResolve = resolve;
    });
    queueItem = {
      id: correlationId,
      resolve: promResolve,
      reject: promReject,
      timeout: options.timeout ?? standardTimeout,
    };
  }

  const success = getRMQ().publish('', options.queue, message, {
    replyTo: getCallbackQueue(),
    correlationId,
    headers,
  });
  if (!success) throw new Error('failed to publish');

  // return value without reply
  if (!shouldReply) {
    return true;
  }

  addToCallbackQueue(queueItem);

  // return value with reply
  const msg = await prom;
  return msg; // TODO parse message
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

    callbackQueue.delete(id);
    queueItem.resolve(msg);
  });
}
