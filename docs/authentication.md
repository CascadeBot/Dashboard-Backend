# Authentication deep-dive

## 1. Frontend routes

The client application has a few routes regarding authentication, here is what they are and how they work

### `GET /login`

Client will be redirected to discord authorization flow (OAuth2).
there is an optional parameter `redirect=/`, this is where the client will be redirected to after a successfull flow.
the paramater will be stored in the state parameter of the oauth flow.

if the client is not able to request the auth url, a error page will be shown.
if the redirect parameter is invalid, a error page will be shown.

### `GET /login/bot?token=...`

This is used by a bot node to redirect a user to the dashboard, through the token parameter the user will not have to login with standard auth flow, instead they will be automatically logged in. the token format is described in section 3.1.

the token in the query param will be exchanged for a real session token.
if the token is not valid in the exchange, an error page will be shown.

if the parameter `redirect` exists, the client will be redirected to that (provided its located on the same domain).
if the redirect parameter is invalid, an error page will be shown.

### `GET /login/callback?token=...`

This endpoint is called after a successfull discord auth flow. the token parameter will be tested and stored, if the parameter `redirect` exists, the client will be redirected to that (provided its located on the same domain).

if the token is not valid after testing, an error page will be shown.
if the redirect parameter is invalid, an error page will be shown.

## 2. Backend routes

The backend also has a few routes for authentication, here is what they are and how they work

### `GET /oauth2/discord/callback?code=...&state=...`

The endpoint must be called by a client browser and not by a http request library. Must not manually call either, it will be called automatically by discord. opun successfull authentication, the client is redirected back to the client application.

on an invalid code or state value, an error page will be shown.

### `POST /graphql Query.getOAuthInfo()`

this graphql query will return a discord oauth url to redirect the client to.

### `POST /graphql Mutation.exchangeLoginToken(loginToken: String!)`

this graphql mutation will exchange a login token for a session token.

## 3. token structures

The backend also has a few routes for authentication, here is what they are and how they work

### 3.1 Login token

This token is a JWT. it must be signed with the private key (referenced under "loginPrivateKey").
It must expire after 5 minutes of creation. its payload is the following:
```ts
{
  // discord id from user
  did: string;
}
```

### 3.2 Session token

This token is a JWT. it must be signed with token secret (referenced under "sessionSecret").
It must not expire. its payload is the following:
```ts
{
  // user id, useful for simple requesting of user
  uid: string;

  // session id, used to find more info about the session and check if it expired
  sid: string;
}
```

### 3.2 State value

Value is simple JSON minified and converted into base64. the payload is the following:
```ts
{
  // redirect value, client will be redirect to this path after the auth flow
  redirect?: string;
}
```
