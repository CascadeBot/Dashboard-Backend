import { sendParsedDirectMessage } from '../parsed';
import { cascadeActions } from './actions';
import { Request } from './types';

/**
 * send to and receive from resource queue
 */
export async function requestFromResources<T, K = Record<string, any>>(
  action: cascadeActions,
  options: Request<K>,
): Promise<T> {
  return await sendParsedDirectMessage<T>({
    routingKey: 'resource',
    body: options.body,
    headers: {
      ...options.headers,
      action,
    },
    reply: true,
  });
}

/**
 * send to resource queue, no reply
 */
export async function sendToResources<K = Record<string, any>>(
  action: cascadeActions,
  options: Request<K>,
): Promise<void> {
  await sendParsedDirectMessage({
    routingKey: 'resource',
    body: options.body,
    headers: {
      ...options.headers,
      action,
    },
    reply: false,
  });
}
