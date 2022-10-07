# Development Self-Hosting

## Requirements
To host this service, you will need to be running **NodeJS 18** or above.

External services required:
 - RabbitMQ
 - The bot service (another cascade repo)
 - redis
 - postgresql

all of those except the bot service can easily be selfhosted by running the docker compose file in `/docker/development`

## Configuration
When hosting this service, you will need to add configuration using either a `.env` file or a `config.json` file. (when using the docker compose file, it must be a .env in the same directory as the docker compose file)

When running in development, it is preferable to load the development config preset. You can do this by specifying:
- `usePresets: "development"` in JSON
- `USE_PRESETS=development` in environment variables.

If you are using the development preset, you will only need to specify the following parameters:
- Discord Client ID (JSON: `discord.clientId`, Env: `DISCORD__CLIENT_ID`)
- Discord Client Secret (JSON: `discord.clientSecret`, Env: `DISCORD__CLIENT_SECRET`)

A full schema of the configuration can be found in `/src/config/parts/index.ts`

## Running
- `npm i`
- `npm run dev`
- Profit

## extra notes
This service is a backend of the dashboard, to be able to use it fully, make sure you are also running the dashboard frontend (its in another repo).
