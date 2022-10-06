import mercurius from 'mercurius';

export enum ErrorCodes {
  Success = 'success',
  InvalidTokenType = 'invalid-token-type',
  InvalidToken = 'invalid-token',
  NeedsAuth = 'needs-auth',
  InvalidRedirect = 'invalid-redirect',
  InvalidLoginToken = 'invalid-login-token',
  NotAllowed = 'not-allowed',
}

export const errorMessages: { [key in ErrorCodes]: string } = {
  [ErrorCodes.Success]: 'Success',
  [ErrorCodes.InvalidTokenType]: 'Invalid authentication token type',
  [ErrorCodes.InvalidToken]: 'Invalid or expired authentication token',
  [ErrorCodes.NeedsAuth]: 'Needs authentication',
  [ErrorCodes.InvalidRedirect]: 'Invalid redirect variable',
  [ErrorCodes.InvalidLoginToken]: 'Invalid login token variable',
  [ErrorCodes.NotAllowed]: 'Not allowed to access this resource',
};

export const errorStatuses: { [key in ErrorCodes]: number } = {
  [ErrorCodes.Success]: 200,
  [ErrorCodes.InvalidTokenType]: 400,
  [ErrorCodes.InvalidToken]: 401,
  [ErrorCodes.NeedsAuth]: 401,
  [ErrorCodes.NeedsAuth]: 401,
  [ErrorCodes.InvalidRedirect]: 400,
  [ErrorCodes.InvalidLoginToken]: 400,
  [ErrorCodes.NotAllowed]: 403,
};

export class GraphQLError extends mercurius.ErrorWithProps {
  constructor(code: ErrorCodes) {
    super(errorMessages[code], {
      msg: errorMessages[code],
      code: code,
      statusCode: errorStatuses[code],
    });
  }
}
