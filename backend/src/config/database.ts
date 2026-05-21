import { DataSource } from "typeorm";
import { env } from "./env";

/**
 * TypeORM DataSource configuration.
 * Entities and migrations are loaded from their respective directories.
 */
export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: env.NODE_ENV === "development",
  entities: [__dirname + "/../models/*.{ts,js}"],
  migrations: [__dirname + "/../../migrations/*.{ts,js}"],
  subscribers: [],
});
