import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // load your flags from .env.local

import { syncDatabase } from "@/server/db/sequelize"; // or use a relative import: '../../server/db/sequelize'

(async () => {
  const force = process.env.DB_FORCE_SYNC === "true";
  const alter = process.env.DB_ALTER_SYNC === "true";
  await syncDatabase({ force, alter });
  console.log("✅ DB sync complete");
  process.exit(0);
})();
