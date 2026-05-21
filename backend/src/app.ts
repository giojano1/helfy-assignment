import "reflect-metadata";
import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";

/**
 * Express application factory.
 * Configures all middleware and mounts route groups.
 * Does NOT call app.listen() — that is server.ts's responsibility.
 *
 * @returns Configured Express application instance
 */
export function createApp(): Application {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS — only allow the configured frontend origin
  app.use(
    cors({
      origin: env.ALLOWED_ORIGIN,
      credentials: true,
    }),
  );

  // Parse JSON bodies
  app.use(express.json());

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // HTTP request logging
  app.use(requestLogger);

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  // API routes will be mounted here in Phase 3
  // app.use('/api/v1/auth', authRouter);
  // app.use('/api/v1/products', productRouter);
  // app.use('/api/v1/categories', categoryRouter);
  // app.use('/api/v1/cart', cartRouter);
  // app.use('/api/v1/orders', orderRouter);
  // app.use('/api/v1/users', userRouter);

  // Global error handler — must be last
  app.use(errorHandler);

  return app;
}
