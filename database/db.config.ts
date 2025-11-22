import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log(pool);

export async function testConnection() {
  const { rows } = await pool.query("SELECT NOW() as now");
  console.log("✅ DB connected at", rows[0].now);
}
