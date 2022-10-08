import joi from 'joi';

export interface SecurityConf {
  sessionSecret: string;
  loginPublicKey: string;
}

export const securityConfSchema = joi.object<SecurityConf>({
  sessionSecret: joi.string().required(),
  loginPublicKey: joi.string().required(),
});
