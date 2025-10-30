// ✅ use Sequelize from sequelize-typescript so decorators/models are discovered
import { Sequelize } from "sequelize-typescript";
// keep QueryTypes from sequelize for raw queries
import { QueryTypes } from "sequelize";

import pg from "pg";
import User from "@/server/models/User.model";
import Contact from "@/server/models/Contact.model";

const g = global as unknown as { __sequelize?: Sequelize };

function wantsSSL() {
  const url = process.env.DATABASE_URL ?? "";
  if (/render\.com|neon\.tech|herokuapp\.com/i.test(url)) return true;
  if (process.env.PGSSLMODE === "require") return true;
  if (process.env.DB_SSL === "true") return true;
  return false;
}

function createSequelize(): Sequelize {
  const logging =
    process.env.DB_LOGGING === "false" || process.env.NODE_ENV === "development"
      ? console.log
      : false;

  const common = {
    dialect: "postgres" as const,
    dialectModule: pg,
    models: [User, Contact], // << this works only with sequelize-typescript's Sequelize
    logging,
  };

  const url = process.env.DATABASE_URL;
  const ssl = wantsSSL()
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {};

  if (url) return new Sequelize(url, { ...common, ...ssl });

  return new Sequelize({
    ...common,
    host: process.env.PGHOST ?? process.env.DB_HOST ?? "localhost",
    port: Number(process.env.PGPORT ?? process.env.DB_PORT ?? 5432),
    username: process.env.PGUSER ?? process.env.DB_USER ?? "postgres",
    password: process.env.PGPASSWORD ?? process.env.DB_PASSWORD ?? "",
    database: process.env.PGDATABASE ?? process.env.DB_NAME ?? "postgres",
    ...ssl,
  });
}

export default function getSequelize() {
  if (!g.__sequelize) g.__sequelize = createSequelize();
  return g.__sequelize!;
}

export async function ensureConnected() {
  const s = getSequelize();
  await s.authenticate();
  const row = await s.query<{ now: string; db: string; schema: string }>(
    `select now() as "now", current_database() as "db", current_schema() as "schema";`,
    { type: QueryTypes.SELECT, plain: true }
  );
  console.log("✅ Connected:", row ?? { now: "n/a", db: "n/a", schema: "n/a" });
  return s;
}

export async function syncDatabase(opts?: {
  force?: boolean;
  alter?: boolean;
}) {
  const s = await ensureConnected();
  console.log("🛠  Sync options:", {
    force: !!opts?.force,
    alter: !!opts?.alter,
  });
  await s.sync({ force: !!opts?.force, alter: !!opts?.alter });
  console.log("✅ Sync complete");
}
