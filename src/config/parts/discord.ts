import joi from 'joi';

export interface DiscordConf {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}

const redirectUrlRegex = /\/oauth2\/discord\/callback$/;

export const discordConfSchema = joi.object({
  clientId: joi.string().required(),
  clientSecret: joi.string().required(),
  redirectUrl: joi.string().regex(redirectUrlRegex).required(),
});
