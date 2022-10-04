export const developmentFragment = {
  server: {
    port: 8081,
    basePath: '/',
    host: 'http://localhost:8081',
    appUrl: 'http://localhost:8080/',
  },
  graphql: {
    playground: {
      enabled: true,
    },
  },
  discord: {
    redirectUrl: 'http://localhost:8081/oauth2/discord/callback',
  },
  logging: {
    format: 'pretty',
  },
  redis: {
    url: 'redis://localhost:6379',
  },
  security: {
    sessionSecret: 'hello-world',
    loginPublicKey: 'hi:)',
  },
};
