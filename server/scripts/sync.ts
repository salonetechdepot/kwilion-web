import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { syncDatabase } from "../db/sequelize";

(async () => {
  const force = process.env.DB_FORCE_SYNC === "true";
  const alter = process.env.DB_ALTER_SYNC === "true";
  console.log("📦 DB flags:", { force, alter, NODE_ENV: process.env.NODE_ENV });
  await syncDatabase({ force, alter });
  console.log("✅ DB sync complete");
  process.exit(0);
})();
