import { NextRequest, NextResponse } from "next/server";
import { ensureConnected } from "@/server/db/sequelize";
import { QueryTypes } from "sequelize";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "published";

    const sequelize = await ensureConnected();

    const jobs = await sequelize.query(
      `
      SELECT
        id,
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
      WHERE status = $1
      ORDER BY published_at DESC NULLS LAST, created_at DESC
      `,
      {
        bind: [status],
        type: QueryTypes.SELECT,
      }
    );

    return NextResponse.json({ ok: true, data: jobs }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/job-postings failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to load job postings" },
      { status: 500 }
    );
  }
}

// Optional health check
export async function HEAD() {
  await ensureConnected();
  return new NextResponse(null, { status: 200 });
}
