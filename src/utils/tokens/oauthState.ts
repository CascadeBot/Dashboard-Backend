import * as joi from 'joi';

export interface OauthStateInput {
  redirect?: string;
}
export interface OauthState {
  redirect?: string;
}

export function createOauthState(data: OauthStateInput): string {
  const minifiedJson = JSON.stringify({
    redirect: data.redirect,
  });
  const encodedJson = Buffer.from(minifiedJson, 'utf-8').toString('base64');
  return encodedJson;
}

const stateSchema = joi.object<OauthState>({
  redirect: joi.string().optional(),
});
export type decodeOauthStateOutput =
  | { valid: false; payload: null }
  | { valid: true; payload: OauthState };
export function parseOauthState(state: string): decodeOauthStateOutput {
  // parse inputs
  let inpObj: any;
  try {
    const minifiedJson = Buffer.from(state, 'base64').toString('utf-8');
    inpObj = JSON.parse(minifiedJson);
  } catch {
    return {
      valid: false,
      payload: null,
    };
  }

  // validate form
  const isValidObject = stateSchema.validate(inpObj);
  if (isValidObject.error) {
    return {
      valid: false,
      payload: null,
    };
  }

  // all valid, return
  return {
    valid: true,
    payload: isValidObject.value,
  };
}
