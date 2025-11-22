import "reflect-metadata";
import { Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";
import pg from "pg";

// Import concrete classes (no barrels)
import Contact from "@/server/models/Contact.model";
import User from "@/server/models/User.model";

const g = global as unknown as { __sequelize?: Sequelize };

function wantsSSL() {
  const url = process.env.DATABASE_URL ?? "";
  if (/render\.com|neon\.tech|herokuapp\.com/i.test(url)) return true;
  if (process.env.PGSSLMODE === "require") return true;
  if (process.env.DB_SSL === "true") return true;
  return false;
}

function createSequelize(): Sequelize {
  const common = {
    dialect: "postgres" as const,
    dialectModule: pg,
    logging:
      process.env.DB_LOGGING === "true" ||
      process.env.NODE_ENV === "development"
        ? console.log
        : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };

  const url = process.env.DATABASE_URL;
  const ssl = wantsSSL()
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {};

  const s = url
    ? new Sequelize(url, { ...common, ...ssl })
    : new Sequelize({
        ...common,
        host: process.env.PGHOST ?? "localhost",
        port: Number(process.env.PGPORT ?? 5432),
        username: process.env.PGUSER ?? "postgres",
        password: process.env.PGPASSWORD ?? "",
        database: process.env.PGDATABASE ?? "postgres",
        ...ssl,
      });

  // Register models on creation (binds the actual classes)
  s.addModels([User, Contact]);
  return s;
}

export default function getSequelize(): Sequelize {
  if (!g.__sequelize) {
    g.__sequelize = createSequelize();
  }
  return g.__sequelize!;
}

/** Ensure the models are attached to the singleton (defensive for prod). */
export function ensureModels(): Sequelize {
  const s = getSequelize();
  const names = s.modelManager.all.map((m) => m.name);

  // Force re-add models if they're missing (common in production)
  if (!names.includes("User") || !names.includes("Contact")) {
    console.log("🔄 Re-registering models in production...");
    s.addModels([User, Contact]);
  }

  return s;
}

/** Make sure we're connected; handy debug logging when DB_LOGGING=true. */
export async function ensureConnected(): Promise<Sequelize> {
  const s = ensureModels();
  await s.authenticate();

  // Log available models for debugging
  if (process.env.NODE_ENV === "production") {
    console.log(
      "📊 Production models:",
      s.modelManager.all.map((m) => m.name)
    );
  }

  return s;
}

/** Expose the model classes (optional helpers if you like) */
export { Contact, User };

export async function syncDatabase(opts?: {
  force?: boolean;
  alter?: boolean;
}) {
  const s = await ensureConnected();
  await s.sync({ force: !!opts?.force, alter: !!opts?.alter });
}
