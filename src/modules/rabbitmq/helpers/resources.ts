import { sendParsedDirectMessage } from '../parsed';
import { Request } from './types';

/**
 * send to and receive from resource queue
 */
export async function requestFromResources<T, K>(
  options: Request<K>,
): Promise<T> {
  return await sendParsedDirectMessage<T>({
    routingKey: `resource`,
    body: options.body,
    headers: options.headers,
    reply: true,
  });
}

/**
 * send to resource queue, no reply
 */
export async function sendToResources<K>(options: Request<K>): Promise<void> {
  await sendParsedDirectMessage({
    routingKey: `resource`,
    body: options.body,
    headers: options.headers,
    reply: false,
  });
}
