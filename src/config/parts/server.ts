import joi from 'joi';

export interface ServerConf {
  port: number;
  basePath: string;
  host: string; // url to access (without base path) (do not end with slash)
  appUrl: string; // url to client application (dashboard) (must end with slash)
  cors: string; // space seperated domains
}

const notEndWithSlashRegex = /[^/]$/;
const endWithSlashRegex = /\/$/;

export const serverConfSchema = joi.object<ServerConf>({
  port: joi.number().default(8080),
  basePath: joi.string().default('/'),
  host: joi.string().regex(notEndWithSlashRegex).required(),
  appUrl: joi.string().regex(endWithSlashRegex).required(),
  cors: joi.string().default(''),
});
