import {
  cascadeActions,
  cascadeErrors,
} from '@modules/rabbitmq/helpers/actions';
import { requestFromResources } from '@modules/rabbitmq/helpers/resources';
import { broadcastRequestToShards } from '@modules/rabbitmq/helpers/shards';
import { ResponseError } from '@modules/rabbitmq/parsed';
import { createLoader } from '@utils/loader';
import NodeCache from 'node-cache';

const mutualGuildCache = new NodeCache({
  stdTTL: 5 * 60, // 5 minutes per user
});

interface DiscordGuild {
  id: string;
  icon_url?: string;
  online_count: number;
  member_count: number;
  name: string;
}
export async function userGetMutualGuilds(
  userId: string,
): Promise<DiscordGuild[]> {
  // check cache first
  const cachedGuilds = mutualGuildCache.get<DiscordGuild[]>(userId);
  if (cachedGuilds) {
    return cachedGuilds;
  }

  // cache miss, fetch from api
  let guilds;
  try {
    guilds = await broadcastRequestToShards<DiscordGuild[]>(
      cascadeActions.USER_GET_MUTUAL_GUILDS,
      {
        body: {
          user_id: userId,
        },
      },
    );
  } catch (err) {
    if (
      err instanceof ResponseError &&
      err.error_code === cascadeErrors.USER_NOT_FOUND
    ) {
      return [];
    }
    throw err;
  }

  const flattedGuilds = guilds.flat();
  mutualGuildCache.set(userId, flattedGuilds);
  return flattedGuilds;
}

interface DiscordUser {
  id: string;
  name: string;
  avatar_url: string;
  discriminator: string;
}
export async function userGetDiscordUser(userId: string): Promise<DiscordUser> {
  const user = await requestFromResources<DiscordUser>(
    cascadeActions.USER_GET_BY_ID,
    {
      body: {
        user_id: userId,
      },
    },
  );
  return user;
}

export async function createUserLoaders() {
  return {
    mutualGuilds: createLoader((id: string) => userGetMutualGuilds(id)),
    discordUser: createLoader((id: string) => userGetDiscordUser(id)),
  };
}
