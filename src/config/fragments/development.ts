export const developmentFragment = {
  server: {
    port: 8081,
    basePath: '/',
    host: 'http://localhost:8081',
    appUrl: 'http://localhost:3000/',
    cors: 'http://localhost:3000 http://localhost:8081',
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
    loginPublicKey: `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE/UTKgd6Vx414w8sPyJqPo/A/zggo
iMnSvoYW+Z4FF44r/E5Vw2h6rlYVcpfS46TS9MaWK4fLpZPiMgdEGXvB5g==
-----END PUBLIC KEY-----
    `,
  },
  postgres: {
    url: 'postgres://postgres:postgres@localhost:5432/postgres',
    syncSchema: true,
  },
  rabbitmq: {
    url: 'amqp://localhost',
  },
};

/*
private key for development (DO NOT USE IN PRODUCTION):
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgsVDs9aDu0FvhsX9V
Gi1gD7IEuDrKJD0GwrvOEZM/6BmhRANCAAT9RMqB3pXHjXjDyw/Imo+j8D/OCCiI
ydK+hhb5ngUXjiv8TlXDaHquVhVyl9LjpNL0xpYrh8ulk+IyB0QZe8Hm
-----END PRIVATE KEY-----
*/
