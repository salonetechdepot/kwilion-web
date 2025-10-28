import { Pool } from "pg";

let _pool: Pool | undefined;
export function getPool() {
  if (!_pool) {
    _pool = process.env.DATABASE_URL
      ? new Pool({ connectionString: process.env.DATABASE_URL })
      : new Pool({
          host: process.env.PGHOST,
          port: Number(process.env.PGPORT ?? 5432),
          database: process.env.PGDATABASE,
          user: process.env.PGUSER,
          password: process.env.PGPASSWORD,
        });
  }
  return _pool;
}
