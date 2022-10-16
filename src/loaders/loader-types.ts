export interface DiscordGuild {
  id: string;
  iconUrl?: string;
  onlineCount: number;
  memberCount: number;
  name: string;
}

export interface DiscordUser {
  id: string;
  name: string;
  avatarUrl: string;
  discriminator: string;
}
