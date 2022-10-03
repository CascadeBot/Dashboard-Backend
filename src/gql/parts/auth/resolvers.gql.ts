export default {
  Query: {
    getOAuthInfo: () => {
      console.log('test');
      // TODO implement query
      return {
        authorizeUrl: 'Hello world',
      };
    },
  },
  Mutation: {
    exchangeLoginToken: () => {
      // TODO implement mutation
      return {
        token: 'Hello world',
      };
    },
  },
};
