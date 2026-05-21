import 'reflect-metadata';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './routes/auth.routes';
import productRouter from './routes/product.routes';
import categoryRouter from './routes/category.routes';
import cartRouter from './routes/cart.routes';
import orderRouter from './routes/order.routes';
import userRouter from './routes/user.routes';

/**
 * Express application factory.
 * Configures all middleware and mounts route groups.
 * Does NOT call app.listen() — that is server.ts's responsibility.
 *
 * @returns Configured Express application instance
 */
export function createApp(): Application {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: env.ALLOWED_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(requestLogger);

  app.get('/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/products', productRouter);
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/cart', cartRouter);
  app.use('/api/v1/orders', orderRouter);
  app.use('/api/v1/users', userRouter);

  app.use(errorHandler);

  return app;
}
