import { getShardCount, updateShardCount } from './meta';
import {
  ResponseError,
  sendParsedBroadcastMessage,
  sendParsedDirectMessage,
} from '../parsed';
import { Request } from './types';
import { cascadeActions, cascadeErrors } from './actions';

export async function retryShard<T>(run: () => T) {
  let res;
  try {
    res = await run();
  } catch (err) {
    // check if wrong shard error
    if (err instanceof ResponseError) {
      if (err.error_code === cascadeErrors.INVALID_SHARD) {
        await updateShardCount();
        return await run();
      }
    }

    // not wrong shard, rethrow
    throw err;
  }

  // return value, no error happened
  return res;
}

/**
 * send to and receive from specific shard
 */
export async function requestFromShard<T, K = Record<string, any>>(
  shardId: number,
  action: cascadeActions,
  options: Request<K>,
): Promise<T> {
  return await sendParsedDirectMessage<T>({
    routingKey: `shard.${shardId}`,
    body: options.body,
    headers: {
      ...options.headers,
      action,
    },
    reply: true,
  });
}

/**
 * send specific shard, no reply
 */
export async function sendToShard<K = Record<string, any>>(
  shardId: number,
  action: cascadeActions,
  options: Request<K>,
): Promise<void> {
  await sendParsedDirectMessage({
    routingKey: `shard.${shardId}`,
    body: options.body,
    headers: {
      ...options.headers,
      action,
    },
    reply: false,
  });
}

/**
 * broadcast to shards, no replies
 */
export async function broadcastToShards<K = Record<string, any>>(
  action: cascadeActions,
  options: Request<K>,
): Promise<void> {
  await sendParsedBroadcastMessage({
    routingKey: 'shard.all',
    body: options.body,
    headers: {
      ...options.headers,
      action,
    },
    reply: false,
    replyAmount: 0, // no replies received
  });
}

/**
 * broadcast and receive from shards
 */
export async function broadcastRequestToShards<T, K = Record<string, any>>(
  action: cascadeActions,
  options: Request<K>,
): Promise<T[]> {
  const shardCount = await getShardCount();
  return await sendParsedBroadcastMessage<T>({
    routingKey: 'shard.all',
    body: options.body,
    headers: {
      ...options.headers,
      action,
    },
    reply: true,
    replyAmount: shardCount,
  });
}
