"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Briefcase, MapPin, Clock, Calendar } from "lucide-react";

type Section = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};

type JobPostingRow = {
  id: string;
  jobCode: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  employmentType: string | null;
  publishedAt: string | null;
  closesAt: string | null;
  sections: Section[];
};

/** Show date + time so users can see same-day windows */
function formatDateTime(d: string | null) {
  if (!d) return "—";
  const dt = new Date(d);
  if (!Number.isFinite(dt.getTime())) return "—";

  return dt.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Open if publish time has started AND close time not reached */
function getOpenNow(publishedAt: string | null, closesAt: string | null) {
  const now = Date.now();

  const pubOk = !publishedAt || new Date(publishedAt).getTime() <= now;
  const closeOk = !closesAt || new Date(closesAt).getTime() >= now;

  return pubOk && closeOk;
}

/** Optional: small helper label */
function getApplyLabel(publishedAt: string | null, closesAt: string | null) {
  const now = Date.now();

  if (publishedAt) {
    const pub = new Date(publishedAt).getTime();
    if (Number.isFinite(pub) && pub > now) return "Opens Soon";
  }

  if (closesAt) {
    const close = new Date(closesAt).getTime();
    if (Number.isFinite(close) && close < now) return "Closed";
  }

  return "Apply Now";
}

export function JobAccordionList({ items }: { items: JobPostingRow[] }) {
  return (
    <Accordion type="single" collapsible className="space-y-6">
      {items.map((job) => {
        const openNow = getOpenNow(job.publishedAt, job.closesAt);
        const applyLabel = getApplyLabel(job.publishedAt, job.closesAt);

        return (
          <Card key={job.id} className="p-0 hover:shadow-lg transition-shadow">
            <AccordionItem value={job.id} className="border-0">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {job.title}
                    </h2>

                    <div className="text-xs text-muted-foreground">
                      Job Code: <span className="font-mono">{job.jobCode}</span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {job.location ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      ) : null}

                      {job.employmentType ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{job.employmentType}</span>
                        </div>
                      ) : null}

                      {job.department ? (
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.department}</span>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Published: {formatDateTime(job.publishedAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>Closes: {formatDateTime(job.closesAt)}</span>
                      </div>

                      {!openNow ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border bg-muted/30">
                          {applyLabel}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* ✅ Auto-disable apply based on time window */}
                  <Button
                    asChild
                    className="md:shrink-0 bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!openNow}
                  >
                    <Link
                      href={openNow ? `/careers/apply?jobId=${job.id}` : "#"}
                      aria-disabled={!openNow}
                      onClick={(e) => {
                        if (!openNow) e.preventDefault();
                      }}
                    >
                      {applyLabel}
                    </Link>
                  </Button>
                </div>

                <div className="mt-4">
                  <AccordionTrigger className="py-2 text-sm">
                    View full details
                  </AccordionTrigger>
                </div>
              </div>

              <AccordionContent>
                <div className="px-6 pb-6 md:px-8 md:pb-8 space-y-6">
                  {job.sections.map((sec) => (
                    <div key={sec.title} className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {sec.title}
                      </h3>

                      {sec.paragraphs.map((p, idx) => (
                        <p
                          key={idx}
                          className="text-muted-foreground leading-relaxed text-pretty"
                        >
                          {p}
                        </p>
                      ))}

                      {sec.bullets.length ? (
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {sec.bullets.map((b, idx) => (
                            <li
                              key={idx}
                              className="flex gap-2 leading-relaxed"
                            >
                              <span className="text-foreground mt-1.5 shrink-0">
                                •
                              </span>
                              <span className="text-pretty">{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        );
      })}
    </Accordion>
  );
}
