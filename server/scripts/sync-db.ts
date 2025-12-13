// import "dotenv/config";
// import { syncDatabase } from "../db/sequelize"; // relative import avoids TS path alias issues

// (async () => {
//   const force = process.env.DB_FORCE_SYNC === "true";
//   const alter = process.env.DB_ALTER_SYNC === "true";

//   console.log("📦 DB flags:", { force, alter, NODE_ENV: process.env.NODE_ENV });
//   console.log("🔗 DATABASE_URL set:", Boolean(process.env.DATABASE_URL));

//   await syncDatabase({
//     force,
//     alter: alter || (!force && process.env.NODE_ENV !== "production"),
//   });

//   console.log("✅ DB sync complete");
//   process.exit(0);
// })().catch((e) => {
//   console.error("❌ DB sync failed", e);
//   process.exit(1);
// });
