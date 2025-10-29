// server/db/sequelize.ts
// server/db/sequelize.ts (example)
import "server-only";
import "reflect-metadata";
import { Sequelize } from "sequelize-typescript";
import pg from "pg";
import User from "@/server/models/User.model";
import Contact from "@/server/models/Contact.model";

const g = global as unknown as { __sequelize?: Sequelize };

function createSequelize(): Sequelize {
  const url = process.env.DATABASE_URL;

  if (typeof url === "string" && url.length > 0) {
    return new Sequelize(url, {
      dialect: "postgres",
      dialectModule: pg,
      models: [User, Contact],
      logging: process.env.NODE_ENV === "development" ? false : false,
    });
  }

  return new Sequelize({
    dialect: "postgres",
    dialectModule: pg,
    host: process.env.PGHOST ?? process.env.DB_HOST ?? "localhost",
    port: Number(process.env.PGPORT ?? process.env.DB_PORT ?? 5432),
    username: process.env.PGUSER ?? process.env.DB_USER ?? "postgres",
    password: process.env.PGPASSWORD ?? process.env.DB_PASSWORD ?? "",
    database: process.env.PGDATABASE ?? process.env.DB_NAME ?? "postgres",
    models: [User, Contact],
    logging: process.env.NODE_ENV === "development" ? false : false,
  });
}

export default function getSequelize(): Sequelize {
  if (!g.__sequelize) g.__sequelize = createSequelize();
  return g.__sequelize!;
}

// (optional named helpers – safe to use if you really want)
export async function ensureConnected() {
  const s = getSequelize();
  await s.authenticate();
  return s;
}
export async function syncDatabase(opts?: {
  force?: boolean;
  alter?: boolean;
}) {
  const s = getSequelize();
  await s.authenticate();
  await s.sync({ force: !!opts?.force, alter: !!opts?.alter });
}
