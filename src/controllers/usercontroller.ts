import {
  cascadeActions,
  cascadeErrors,
} from '@modules/rabbitmq/helpers/actions';
import { requestFromResources } from '@modules/rabbitmq/helpers/resources';
import { broadcastRequestToShards } from '@modules/rabbitmq/helpers/shards';
import { ResponseError } from '@modules/rabbitmq/parsed';

// TODO cache the shit out of this
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

  return guilds.flat();
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
