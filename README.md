# Dashboard-Backend

This project is part of Cascade, a discord bot.

backend service for dashboard, main features:
 - provides graphql API for dashboard
 - integrates with cascade bot nodes using rabbitMQ


## a note on selfhosting
This service requires configuration in environment variables, a `.env` file or a `config.json` (or all of the above).
A schema of the configuration can be found in `/src/parts/index.ts`

> **TODO** more instructions in readme on contributing, selfhosting and configuration
