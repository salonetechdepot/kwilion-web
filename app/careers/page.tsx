// app/careers/page.tsx
import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { QueryTypes } from "sequelize";
import { ensureConnected } from "@/server/db/sequelize";

import { JobAccordionList } from "@/components/careers/JobAccordionList";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type JobPostingRow = {
  id: string;
  jobCode: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  employmentType: string | null;
  description: string | null;
  requirements: string | null;
  publishedAt: string | null;
  closesAt: string | null;
};

type Section = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};

function splitLines(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd());
}

function isHeading(line: string) {
  const t = line.trim();
  if (!t) return false;

  const known = new Set([
    "Role Summary",
    "Key Responsibilities",
    "Requirements",
    "Qualifications and Experience",
    "Education",
    "Experience",
    "Core Competencies",
    "Language & Other Requirements",
    "Language and Other Requirements",
    "Employment Type",
    "Department",
    "Location",
  ]);

  const noColon = t.replace(/:$/, "");
  if (known.has(noColon)) return true;

  return (
    t.length <= 48 && !t.endsWith(".") && /^[A-Z][A-Za-z0-9 &/()-]+:?$/.test(t)
  );
}

function isBullet(line: string) {
  return /^[-•*]\s+/.test(line.trim());
}

function stripBullet(line: string) {
  return line
    .trim()
    .replace(/^[-•*]\s+/, "")
    .trim();
}

function parseJobSections(job: JobPostingRow): Section[] {
  const pieces: string[] = [];
  if (job.description) pieces.push(job.description.trim());

  if (job.requirements?.trim()) {
    const req = job.requirements.trim();
    if (/^requirements\b/i.test(req)) pieces.push(req);
    else pieces.push(`Requirements\n${req}`);
  }

  const text = pieces.join("\n\n").trim();
  if (!text) return [];

  const lines = splitLines(text);

  const sections: Section[] = [];
  let current: Section = { title: "Details", paragraphs: [], bullets: [] };

  const flush = () => {
    current.paragraphs = current.paragraphs
      .map((p) => p.trim())
      .filter(Boolean);
    current.bullets = current.bullets.map((b) => b.trim()).filter(Boolean);
    if (current.paragraphs.length || current.bullets.length)
      sections.push(current);
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (isHeading(line)) {
      flush();
      current = {
        title: line.replace(/:$/, "").trim(),
        paragraphs: [],
        bullets: [],
      };
      continue;
    }

    if (isBullet(line)) {
      current.bullets.push(stripBullet(line));
      continue;
    }

    current.paragraphs.push(line);
  }

  flush();
  return sections;
}

export default async function CareersPage() {
  const sequelize = await ensureConnected();

  const items = (await sequelize.query(
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
        published_at AS "publishedAt",
        closes_at AS "closesAt"
      FROM job_postings
      WHERE status = 'published'
        AND (published_at IS NULL OR published_at <= NOW())       -- ✅ not before open time
        AND (closes_at IS NULL OR closes_at >= NOW())             -- ✅ not after close time
      ORDER BY updated_at DESC, created_at DESC
      LIMIT 200`,
    { type: QueryTypes.SELECT }
  )) as JobPostingRow[];

  const itemsWithSections = items.map((job) => ({
    ...job,
    sections: parseJobSections(job),
  }));

  return (
    <main>
      {/* Hero Section (matches Home/Services style) */}
      <section className="relative text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/professional-technology-consulting-team-meeting.jpg"
            alt="Careers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/50 to-secondary/40" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-balance drop-shadow-lg">
              Join Our Team
            </h1>
            <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed drop-shadow-md">
              We&apos;re looking for talented individuals to help us drive
              impact through data collection and field operations. Explore open
              roles and apply in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {itemsWithSections.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No open positions right now. Please check back soon.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <h2 className="text-2xl md:text-3xl font-bold text-balance">
                    Open Positions
                  </h2>
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    Click a role to view details, requirements, and apply.
                  </p>
                </div>

                <JobAccordionList items={itemsWithSections as any} />

                {/* Footer note (subtle, matches site tone) */}
                <div className="pt-10 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Don&apos;t see the right role? Check again later — postings
                  update regularly.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
