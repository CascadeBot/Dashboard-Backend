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
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHCBc0n0GWLlPPQUipSGnZPpnc+U
30Bd2ecrn/HHXgUnAuekBHA+XzhjQeiQ110etJUQhR0k8hPKyehH8EZQ5I3gPWwW
oO+JyC3qKnOS6s3rGTrq+BCma6dsbrylM3m+UR2bdI6Ab64vOIUEsAQJ5o3UOtTs
RZMueL+5m1luUUKbAgMBAAE=
-----END PUBLIC KEY-----`,
  },
  postgres: {
    url: 'postgres://postgres:postgres@localhost:5432/postgres',
    syncSchema: true,
  },
};

/*
private key for development (DO NOT USE IN PRODUCTION):
-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgHCBc0n0GWLlPPQUipSGnZPpnc+U30Bd2ecrn/HHXgUnAuekBHA+
XzhjQeiQ110etJUQhR0k8hPKyehH8EZQ5I3gPWwWoO+JyC3qKnOS6s3rGTrq+BCm
a6dsbrylM3m+UR2bdI6Ab64vOIUEsAQJ5o3UOtTsRZMueL+5m1luUUKbAgMBAAEC
gYBoSGVf2EYruAbey6eEcp7fer0Pq5Ogax3OvE4eY0kQB5AWvJ5smDPU5ZQzCQbH
Ru3l+hEY6aUFmYO7rerWkqa2ZHp6iitFuwNe9Apd9jkf63BSct1GY99/nvivp8F6
L0L0Mg6ofH4BADE8dVi9eWb0wxt9capPmShAJcSEkmd9KQJBANWV6k3ECVofpHM9
i/N9NfTIiLozk2Oh76A7QRvdKohbWdgqleQiE8kT10/cYH/QxCW2wGpsz7i1XtER
6rT+BR8CQQCG2OsbfdKxvNUrwWBU8iriN3hnlB4dxEVo3wGcAFPNF+GE7prgsGlQ
vQTlTC/QCfzEFl2Ef51/HGXkx3j4DrcFAkBTiO66u5FszjNjXw79jFsuAcB4EvPy
Y8N0x7gPTdD0w8W/5ef58doLKtdrRKX5V41fsrpO5X/YnhcXbgp9/1vBAkAz54cH
u/S/qVm8T+DOkbBkBsn3xJGbD5NP/JbX/2BCT3DlBBrlZcID693YjOzSfSWoLJuu
hpiO9tVZrFYp1TApAkAcl+On9E+Xl5mLzp64yWICAHCgz6/lj6Pn3EssZd1FZKD2
x3SFYXJW3cvWvInXyfuV9GtO6GJrv3pB63NSGpD3
-----END RSA PRIVATE KEY-----
*/
