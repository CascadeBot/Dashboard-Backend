export default {
  Query: {
    getOAuthInfo: () => {
      // TODO reply with authorize url
      // TODO embed state into url
      return {
        authorizeUrl: 'Hello world',
      };
    },
  },
  Mutation: {
    exchangeLoginToken: () => {
      // TODO create session and return session token
      return {
        token: 'Hello world',
      };
    },
  },
};
