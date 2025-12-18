// app/api/careers/job-postings/route.ts
import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { QueryTypes } from "sequelize";
import { ensureConnected } from "@/server/db/sequelize";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);

    const sequelize = await ensureConnected();

    const rows = await sequelize.query(
      `
      SELECT
        id,
        job_code AS "jobCode",
        title,
        slug,
        department,
        location,
        employment_type AS "employmentType",
        description,
        requirements,
        status,
        published_at AS "publishedAt",
        closes_at AS "closesAt",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM job_postings
      WHERE status = 'published'
        AND (closes_at IS NULL OR closes_at >= NOW())
      ORDER BY updated_at DESC, created_at DESC
      LIMIT $1
      `,
      { bind: [limit], type: QueryTypes.SELECT }
    );

    return NextResponse.json({ ok: true, items: rows }, { status: 200 });
  } catch (e) {
    console.error("❌ GET /api/careers/job-postings failed:", e);
    return jsonError("Failed to load job postings", 500);
  }
}
