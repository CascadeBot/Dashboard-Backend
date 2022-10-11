import { getShardCount } from './meta';
import { sendParsedBroadcastMessage, sendParsedDirectMessage } from '../parsed';
import { Request } from './types';

/**
 * send to and receive from specific shard
 */
export async function requestFromShard<T, K>(
  shardId: number,
  options: Request<K>,
): Promise<T> {
  return await sendParsedDirectMessage<T>({
    routingKey: `shard-${shardId}`,
    body: options.body,
    headers: options.headers,
    reply: true,
  });
}

/**
 * send specific shard, no reply
 */
export async function sendToShard<K>(
  shardId: number,
  options: Request<K>,
): Promise<void> {
  await sendParsedDirectMessage({
    routingKey: `shard-${shardId}`,
    body: options.body,
    headers: options.headers,
    reply: false,
  });
}

/**
 * broadcast to shards, no replies
 */
export async function broadcastToShards<K>(options: Request<K>): Promise<void> {
  await sendParsedBroadcastMessage({
    routingKey: 'shard-all',
    body: options.body,
    headers: options.headers,
    reply: false,
    replyAmount: 0, // no replies received
  });
}

/**
 * broadcast and receive from shards
 */
export async function broadcastRequestToShards<T, K>(
  options: Request<K>,
): Promise<T[]> {
  const shardCount = await getShardCount();
  return await sendParsedBroadcastMessage<T>({
    routingKey: 'shard-all',
    body: options.body,
    headers: options.headers,
    reply: true,
    replyAmount: shardCount,
  });
}
