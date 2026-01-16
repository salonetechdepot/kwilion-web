import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { QueryTypes } from "sequelize";
import { ensureConnected } from "@/server/db/sequelize";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!id || !isUuid(id)) return jsonError("Invalid job id", 400);

  const sequelize = await ensureConnected();

  const rows = (await sequelize.query(
    `
    SELECT
      id,
      job_code AS "jobCode",
      title,
      slug,
      department,
      location,
      employment_type AS "employmentType",
      status,
      published_at AS "publishedAt",
      closes_at AS "closesAt"
    FROM job_postings
    WHERE id = $1
      AND status = 'published'
      AND (closes_at IS NULL OR closes_at >= NOW())
    LIMIT 1
    `,
    { bind: [id], type: QueryTypes.SELECT }
  )) as any[];

  const job = rows[0];
  if (!job) return jsonError("Job not found or not open", 404);

  return NextResponse.json({ ok: true, job }, { status: 200 });
}
