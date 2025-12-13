import "dotenv/config";
import { syncDatabase, ensureConnected } from "../db/sequelize";

(async () => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DATABASE_URL set:", Boolean(process.env.DATABASE_URL));

  // Safety: never allow force sync in production unless you *explicitly* override
  const allowForceInProd = process.env.ALLOW_FORCE_SYNC_IN_PROD === "true";
  const isProd = process.env.NODE_ENV === "production";

  const FORCE = process.env.DB_FORCE_SYNC === "true";
  const ALTER = process.env.DB_ALTER_SYNC === "true";

  if (isProd && FORCE && !allowForceInProd) {
    throw new Error(
      "Refusing to FORCE sync in production. Set ALLOW_FORCE_SYNC_IN_PROD=true if you really mean it."
    );
  }

  const s = await ensureConnected();

  const [rows] = (await s.query(
    "select current_database() as db, current_schema() as schema"
  )) as any;
  console.log("Connected to:", rows?.[0]);

  console.log(
    "Models registered:",
    s.modelManager.all.map((m) => m.name)
  );

  await syncDatabase({
    alter: ALTER && !FORCE, // alter is pointless when force is true
    force: FORCE,
  });

  console.log(`✅ DB sync complete (force=${FORCE}, alter=${ALTER})`);
  process.exit(0);
})().catch((e) => {
  console.error("❌ DB sync failed", e);
  process.exit(1);
});

//

// import "dotenv/config";
// import { syncDatabase, ensureConnected } from "../db/sequelize"; // <-- the file you pasted earlier

// (async () => {
//   console.log("NODE_ENV:", process.env.NODE_ENV);
//   console.log("DATABASE_URL set:", Boolean(process.env.DATABASE_URL));

//   const s = await ensureConnected();

//   const [rows] = (await s.query(
//     "select current_database() as db, current_schema() as schema"
//   )) as any;
//   console.log("Connected to:", rows?.[0]);

//   console.log(
//     "Models registered:",
//     s.modelManager.all.map((m) => m.name)
//   );

//   await syncDatabase({ alter: true, force: false });
//   console.log("✅ DB sync complete");
//   process.exit(0);
// })().catch((e) => {
//   console.error("❌ DB sync failed", e);
//   process.exit(1);
// });

//
// import * as dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });

// import { syncDatabase } from "../db/sequelize";

// (async () => {
//   const force = process.env.DB_FORCE_SYNC === "true";
//   const alter = process.env.DB_ALTER_SYNC === "true";
//   console.log("📦 DB flags:", { force, alter, NODE_ENV: process.env.NODE_ENV });
//   await syncDatabase({ force, alter });
//   console.log("✅ DB sync complete");
//   process.exit(0);
// })();
