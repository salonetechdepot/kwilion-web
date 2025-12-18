// app/careers/page.tsx
import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { QueryTypes } from "sequelize";

import { ensureConnected } from "@/server/db/sequelize";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, Calendar } from "lucide-react";

import { JobAccordionList } from "@/components/careers/JobAccordionList";

type JobPostingRow = {
  id: string;
  jobCode: string; // ✅ add this
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  employmentType: string | null;
  description: string | null; // big text with headings/bullets
  requirements: string | null; // big text with headings/bullets
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

  // Examples: "Role Summary", "Key Responsibilities", "Qualifications and Experience"
  // Also allow "Education:" / "Experience:" etc
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

  // Generic: Title Case-ish heading, not too long, no period
  const looksLike =
    t.length <= 48 && !t.endsWith(".") && /^[A-Z][A-Za-z0-9 &/()-]+:?$/.test(t);

  return looksLike;
}

function isBullet(line: string) {
  const t = line.trim();
  return /^[-•*]\s+/.test(t);
}

function stripBullet(line: string) {
  return line
    .trim()
    .replace(/^[-•*]\s+/, "")
    .trim();
}

function parseJobSections(job: JobPostingRow): Section[] {
  // We take the big text blobs and parse headings/bullets/paragraphs.
  // If requirements exists, we append it so it becomes its own section too.
  const pieces: string[] = [];
  if (job.description) pieces.push(job.description.trim());

  // If requirements already includes "Requirements" heading, don't double it.
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
    // remove empties
    current.paragraphs = current.paragraphs
      .map((p) => p.trim())
      .filter(Boolean);
    current.bullets = current.bullets.map((b) => b.trim()).filter(Boolean);
    if (current.paragraphs.length || current.bullets.length)
      sections.push(current);
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
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

    // paragraph: merge consecutive lines into a paragraph
    current.paragraphs.push(line);
  }

  flush();
  return sections;
}

function formatDate(d: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (!Number.isFinite(dt.getTime())) return "—";
  return dt.toLocaleDateString();
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
        AND (closes_at IS NULL OR closes_at >= NOW())
      ORDER BY updated_at DESC, created_at DESC
      LIMIT 200
  `,
    { type: QueryTypes.SELECT }
  )) as JobPostingRow[];

  const itemsWithSections = items.map((job) => ({
    ...job,
    sections: parseJobSections(job),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-balance">
            Join Our Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            We&apos;re looking for talented individuals to help us drive impact
            through data collection and field operations. Explore our open
            positions and find your next career opportunity.
          </p>
        </div>
      </div>

      {/* Positions List */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {itemsWithSections.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No open positions right now.
          </div>
        ) : (
          <JobAccordionList items={itemsWithSections as any} />
        )}

        {/* Footer CTA */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">
            Don&apos;t see the right position for you?
          </p>
          <Button variant="outline" asChild>
            <Link href="/careers/apply">Submit General Application</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
