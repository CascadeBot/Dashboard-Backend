export interface ApiDiscordUser {
  id: string;
  name: string;
  avatar_url: string;
  discriminator: string;
}

export interface ApiDiscordGuild {
  id: string;
  icon_url?: string;
  online_count: number;
  member_count: number;
  name: string;
}
