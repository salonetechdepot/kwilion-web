// app/server/scripts/test-db.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { ensureConnected } from "../db/sequelize";

(async () => {
  await ensureConnected();
  process.exit(0);
})();
