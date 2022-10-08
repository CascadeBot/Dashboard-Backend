import { config } from '@config';
import { StatusError } from '@utils/errors';
import { createOauthState, OauthState } from '@utils/tokens/oauthState';
import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';

const discordApiUrl = 'https://discord.com/api/v10';
const discordOauthUrl = 'https://discord.com/api/oauth2';

export function createOauthUrl(state: OauthState): string {
  const url = new URL(`${discordOauthUrl}/authorize`);
  url.searchParams.append('client_id', config.discord.clientId);
  url.searchParams.append('redirect_uri', config.discord.redirectUrl);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', 'identify');
  url.searchParams.append('state', createOauthState(state));
  return url.toString();
}

export interface AccessToken {
  accessToken: string;
  refreshToken: string;
}
export async function discordAuthCodeToAccessToken(
  code: string,
): Promise<AccessToken> {
  const data = new URLSearchParams();
  data.append('client_id', config.discord.clientId);
  data.append('client_secret', config.discord.clientSecret);
  data.append('grant_type', 'authorization_code');
  data.append('code', code);
  data.append('redirect_uri', config.discord.redirectUrl);

  const res = await fetch(discordOauthUrl + '/token', {
    body: data,
    method: 'post',
  });
  if (res.status >= 400 && res.status < 500)
    throw new StatusError('failed to exchange code', 400);
  if (res.status !== 200) throw new Error('failed to exchange code');

  const json: any = await res.json();
  if (!json) throw new Error('invalid json body');

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
  };
}

export interface DiscordUser {
  id: string;
}
export async function getDiscordCurrentUser(
  token: AccessToken,
): Promise<DiscordUser> {
  const jsonResponse: any = await fetch(discordApiUrl + '/users/@me', {
    headers: {
      Authorization: 'Bearer ' + token.accessToken,
    },
  }).then((v) => v.json());

  if (!jsonResponse) throw new Error('invalid json body');
  return {
    id: jsonResponse.id,
  };
}

export async function getUserFromCode(code: string): Promise<DiscordUser> {
  const token = await discordAuthCodeToAccessToken(code);
  const user = await getDiscordCurrentUser(token);
  return user;
}
