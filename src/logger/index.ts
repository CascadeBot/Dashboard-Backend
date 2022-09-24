import { config } from '@config';
import winston from 'winston';
import { consoleFormat } from 'winston-console-format';

const appName = 'backend';

function createWinstonLogger() {
  let loggerObj = winston.createLogger({
    levels: Object.assign(
      { fatal: 0, warn: 4, trace: 7 },
      winston.config.syslog.levels,
    ),
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.ms(),
      winston.format.label({ label: appName }),
      winston.format.simple(),
      winston.format.padLevels(),
      consoleFormat({
        showMeta: false,
        inspectOptions: {
          depth: Infinity,
          colors: true,
          maxArrayLength: Infinity,
          breakLength: 120,
          compact: Infinity,
        },
      }),
    ),
    defaultMeta: { svc: appName },
    transports: [new winston.transports.Console()],
  });

  // production logger
  if (config.logging.format === 'json') {
    loggerObj = winston.createLogger({
      levels: Object.assign(
        { fatal: 0, warn: 4, trace: 7 },
        winston.config.syslog.levels,
      ),
      format: winston.format.combine(
        winston.format.label({ label: appName }),
        winston.format.json(),
      ),
      defaultMeta: { svc: appName },
      transports: [new winston.transports.Console()],
    });
  }

  return loggerObj;
}

export function scopedLogger(service: string) {
  const logger = createWinstonLogger();
  logger.defaultMeta = {
    ...logger.defaultMeta,
    svc: service,
  };
  return logger;
}

export function makeFastifyLogger(logger: winston.Logger) {
  logger.format = winston.format.combine(
    winston.format((info) => {
      if (typeof info.message === 'object') {
        const { message } = info as any;
        const { res, responseTime } = message || {};
        if (!res) return false;

        const { request, statusCode } = res;
        if (request.method === 'OPTIONS') return false;

        // create log message
        info.message = `[${statusCode}] ${request.protocol.toUpperCase()} ${
          request.url
        } - ${responseTime.toFixed(2)}ms`;
        return info;
      }
      return info;
    })(),
    logger.format,
  );
  return logger;
}

export const log = createWinstonLogger();
