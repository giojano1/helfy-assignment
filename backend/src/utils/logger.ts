import winston from "winston";
import { env } from "../config/env";

const { combine, timestamp, json, colorize, printf } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} [${level}]: ${message}${metaStr}`;
  }),
);

const prodFormat = combine(timestamp(), json());

/**
 * Application-wide Winston logger.
 * Uses JSON format in production and colourised text in development.
 */
export const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "warn" : "info",
  format: env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});
