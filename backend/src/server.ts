import "reflect-metadata";
import { createApp } from "./app";
import { AppDataSource } from "./config/database";
import { env } from "./config/env";
import { logger } from "./utils/logger";

/**
 * Application entry point.
 * Initialises the TypeORM data source, then starts the HTTP server.
 */
async function bootstrap(): Promise<void> {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established");

    const app = createApp();

    app.listen(env.PORT, () => {
      logger.info(`ShopForge API running on port ${env.PORT}`, {
        env: env.NODE_ENV,
        port: env.PORT,
      });
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

// Handle unhandled promise rejections — log and exit gracefully
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason });
  process.exit(1);
});

// Handle uncaught exceptions — log and exit gracefully
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error });
  process.exit(1);
});

bootstrap();
