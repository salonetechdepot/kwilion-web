import { NextRequest, NextResponse } from "next/server";
import { ensureConnected } from "@/server/db/sequelize";
import { QueryTypes } from "sequelize";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const sequelize = await ensureConnected();

    const rows = await sequelize.query(
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
      WHERE slug = $1
        AND status = 'published'
      LIMIT 1
      `,
      { bind: [params.slug], type: QueryTypes.SELECT }
    );

    const job = (rows as any[])[0];
    if (!job) {
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, data: job }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/job-postings/[slug] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to load job posting" },
      { status: 500 }
    );
  }
}
