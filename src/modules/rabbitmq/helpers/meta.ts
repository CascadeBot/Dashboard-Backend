import { cascadeActions } from './actions';
import { sendParsedDirectMessage } from '../parsed';

const cacheExpiry = 60 * 1000; // 1 minute
let cachedShardCount: number | null = null;
let cacheTimeout: ReturnType<typeof setTimeout> | null = null;

interface ShardCount {
  shard_count: number;
}

export async function updateShardCount(): Promise<number> {
  const shardInfo = await sendParsedDirectMessage<ShardCount>({
    routingKey: 'meta',
    headers: {
      action: cascadeActions.SHARD_COUNT,
    },
    reply: true,
  });

  // caching
  cachedShardCount = shardInfo.shard_count;
  if (cacheTimeout !== null) clearTimeout(cacheTimeout);
  cacheTimeout = setTimeout(() => {
    cachedShardCount = null;
    cacheTimeout = null;
  }, cacheExpiry);

  return shardInfo.shard_count;
}

export async function getShardCount(): Promise<number> {
  if (!cachedShardCount) return await updateShardCount();
  return cachedShardCount;
}
