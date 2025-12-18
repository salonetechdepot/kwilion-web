"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; reference: string }
  | { status: "error"; message: string };

type JobLite = {
  id: string;
  jobCode: string;
  title: string;
  location: string | null;
  employmentType: string | null;
  department: string | null;
};

function calcAge(dobISO: string) {
  // dobISO like "YYYY-MM-DD"
  const dob = new Date(`${dobISO}T00:00:00`);
  if (!Number.isFinite(dob.getTime())) return NaN;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function normEmail(v: string) {
  return (v || "").trim().toLowerCase();
}

function normPhone(v: string) {
  // keep digits only (simple, works across formats)
  return (v || "").replace(/\D/g, "");
}

function normName(first: string, last: string) {
  return `${(first || "").trim().toLowerCase()} ${(last || "")
    .trim()
    .toLowerCase()}`.trim();
}

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId"); // ✅ use jobId (uuid) from /careers

  const [job, setJob] = useState<JobLite | null>(null);
  const [jobLoading, setJobLoading] = useState<boolean>(!!jobId);
  const [jobError, setJobError] = useState<string | null>(null);

  const [availabilityValue, setAvailabilityValue] = useState("");
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });

  const [refRelationship, setRefRelationship] = useState("");

  const [clientError, setClientError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  const isGeneral = useMemo(() => !jobId, [jobId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!jobId) {
        setJob(null);
        setJobLoading(false);
        setJobError(null);
        return;
      }

      setJobLoading(true);
      setJobError(null);

      try {
        const res = await fetch(`/api/careers/posted-jobs/by-id/${jobId}`, {
          cache: "no-store",
        });
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.error || `Failed to load job (${res.status})`);
        }

        if (!cancelled) setJob(json.job);
      } catch (e: any) {
        if (!cancelled) setJobError(e?.message || "Failed to load job");
      } finally {
        if (!cancelled) setJobLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const resetForAnother = () => {
    setSubmit({ status: "idle" });
    setAvailabilityValue("");
    formRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError(null);

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Age >= 18
    const dob = String(fd.get("dob") || "").trim();
    const age = calcAge(dob);
    if (!dob || !Number.isFinite(age)) {
      setClientError("Please enter a valid date of birth.");
      setSubmit({ status: "idle" });
      return;
    }
    if (age < 18) {
      setClientError("You must be at least 18 years old to apply.");
      setSubmit({ status: "idle" });
      return;
    }

    // Reference relationship required (you added this field)
    const rel = String(fd.get("refRelationship") || "").trim();
    if (!rel) {
      setClientError(
        "Please provide your relationship to the reference/guarantor."
      );
      setSubmit({ status: "idle" });
      return;
    }

    // Applicant cannot be the reference (compare name/email/phone)
    const applicantName = normName(
      String(fd.get("firstName") || ""),
      String(fd.get("lastName") || "")
    );
    const refName = normName(
      String(fd.get("refFirstName") || ""),
      String(fd.get("refLastName") || "")
    );

    const applicantEmail = normEmail(String(fd.get("email") || ""));
    const refEmail = normEmail(String(fd.get("refEmail") || ""));

    const applicantPhone = normPhone(String(fd.get("phone") || ""));
    const refPhone = normPhone(String(fd.get("refPhone") || ""));

    // If they provided reference fields, ensure they don't match applicant
    const sameName = applicantName && refName && applicantName === refName;
    const sameEmail = applicantEmail && refEmail && applicantEmail === refEmail;
    const samePhone = applicantPhone && refPhone && applicantPhone === refPhone;

    if (sameName || sameEmail || samePhone) {
      setClientError(
        "Your reference/guarantor cannot be the applicant. Please use a different person for reference details."
      );
      setSubmit({ status: "idle" });
      return;
    }

    setSubmit({ status: "loading" });

    // ✅ set jobPostingId + availability like you already do
    if (job?.id) fd.set("jobPostingId", job.id);
    else fd.delete("jobPostingId");

    fd.set("availability", availabilityValue);

    try {
      const res = await fetch("/api/careers/job-applications", {
        method: "POST",
        body: fd,
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to submit application");
      }

      setSubmit({ status: "success", reference: json.reference });
    } catch (err) {
      setSubmit({
        status: "error",
        message:
          err instanceof Error ? err.message : "Failed to submit application",
      });
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setSubmit({ status: "loading" });

  //   const fd = new FormData(e.currentTarget);

  //   // ✅ We submit jobPostingId if we have it; otherwise it’s a general application
  //   if (job?.id) fd.set("jobPostingId", job.id);
  //   else fd.delete("jobPostingId");

  //   // ✅ keep availability (Select is not native)
  //   fd.set("availability", availabilityValue);

  //   try {
  //     const res = await fetch("/api/careers/job-applications", {
  //       method: "POST",
  //       body: fd,
  //     });

  //     const json = await res.json().catch(() => null);
  //     if (!res.ok || !json?.ok) {
  //       throw new Error(json?.error || "Failed to submit application");
  //     }

  //     // ✅ use reference, not UUID
  //     setSubmit({ status: "success", reference: json.reference });
  //   } catch (err) {
  //     setSubmit({
  //       status: "error",
  //       message:
  //         err instanceof Error ? err.message : "Failed to submit application",
  //     });
  //   }
  // };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="flex items-center justify-between gap-3 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Main Site
            </Link>

            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Submit Your Application
          </h1>
          <p className="text-muted-foreground mt-2 text-pretty leading-relaxed">
            Fill out the form below to apply for a position with our team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {submit.status === "success" ? (
          <Card className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-7 h-7 mt-0.5" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  Application submitted!
                </h2>
                <p className="text-muted-foreground">
                  Thanks — we received your application. Keep this reference for
                  follow-up:
                </p>
                <div className="rounded-md border border-border bg-muted/30 px-4 py-3 inline-block">
                  <span className="text-sm text-muted-foreground">
                    Reference
                  </span>
                  <div className="font-mono text-sm">{submit.reference}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-accent">
                <Link href="/careers">Back to Careers</Link>
              </Button>
              <Button variant="outline" onClick={resetForAnother}>
                Submit Another Application
              </Button>
              <Button variant="ghost" asChild className="sm:ml-auto">
                <Link href="/">Go to Main Site</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 md:p-8">
            {/* ✅ Position display (dynamic) */}
            <div className="space-y-2">
              <h3 className="font-bold">Position</h3>

              {jobLoading ? (
                <p className="text-sm text-muted-foreground">Loading job…</p>
              ) : jobError ? (
                <p className="text-sm text-red-600">
                  {jobError} — you can still submit a General Application.
                </p>
              ) : job ? (
                <div className="rounded-md border bg-muted/20 px-4 py-3">
                  <div className="font-semibold">{job.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {job.jobCode} • {job.location ?? "—"} •{" "}
                    {job.employmentType ?? "—"}
                  </div>
                </div>
              ) : (
                <div className="rounded-md border bg-muted/20 px-4 py-3">
                  <div className="font-semibold">General Application</div>
                  <div className="text-xs text-muted-foreground">
                    No specific job selected.
                  </div>
                </div>
              )}

              {/* ✅ send jobPostingId as hidden input */}
              <input type="hidden" name="jobPostingId" value={job?.id ?? ""} />
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* ...keep ALL your fields as-is below... */}

              <hr className="mt-1" />

              {/* Personal Information */}
              <h3 className="font-bold">Personal Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" name="middleName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Input id="gender" name="gender" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of birth *</Label>
                  <Input id="dob" name="dob" type="date" required />
                </div>
              </div>

              <hr className="my-5" />

              {/* Contact Information */}
              <h3 className="font-bold">Contacts</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address</Label>
                <Input id="addressLine1" name="addressLine1" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Current City *</Label>
                  <Input id="city" name="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="districtOrProvince">
                    District/Province *
                  </Label>
                  <Input
                    id="districtOrProvince"
                    name="districtOrProvince"
                    required
                  />
                </div>
              </div>

              <hr className="my-5" />

              {/* Reference Information */}
              <h3 className="font-bold">Guarantor/Reference</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refFirstName">First Name</Label>
                  <Input id="refFirstName" name="refFirstName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refLastName">Last Name</Label>
                  <Input id="refLastName" name="refLastName" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refPhone">Phone Number</Label>
                  <Input id="refPhone" name="refPhone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refEmail">Email Address</Label>
                  <Input id="refEmail" name="refEmail" type="email" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refRelationship">
                    Relationship to Applicant *
                  </Label>
                  <Input
                    id="refRelationship"
                    name="refRelationship"
                    placeholder="e.g., Parent, Sibling, Supervisor, Friend"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refAddressLine1">Address</Label>
                <Input id="refAddressLine1" name="refAddressLine1" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refCity">City/Town</Label>
                  <Input id="refCity" name="refCity" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refDistrictOrProvince">
                    District/Province
                  </Label>
                  <Input
                    id="refDistrictOrProvince"
                    name="refDistrictOrProvince"
                  />
                </div>
              </div>

              <hr className="my-5" />

              {/* Resume Upload */}
              <h3 className="font-bold">Resume</h3>
              <div className="space-y-2">
                <Label htmlFor="resume">Resume/CV *</Label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea id="coverLetter" name="coverLetter" rows={6} />
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <Label htmlFor="experience">Relevant Experience *</Label>
                <Textarea id="experience" name="experience" rows={4} required />
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label htmlFor="availability">Availability *</Label>
                <Select
                  value={availabilityValue}
                  onValueChange={setAvailabilityValue}
                >
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="When can you start?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="1week">Within 1 week</SelectItem>
                    <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="1month">Within 1 month</SelectItem>
                    <SelectItem value="2months">Within 2 months</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <input
                  type="hidden"
                  name="availability"
                  value={availabilityValue}
                />
              </div>

              {clientError ? (
                <p className="text-sm text-red-600">{clientError}</p>
              ) : null}

              {/* Submit */}
              <div className="pt-4 space-y-3">
                {submit.status === "error" && (
                  <p className="text-sm text-red-600">{submit.message}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto bg-accent"
                  disabled={submit.status === "loading"}
                >
                  {submit.status === "loading"
                    ? "Submitting..."
                    : "Submit Application"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b border-border">
//         <div className="container mx-auto px-4 py-8 max-w-3xl">
//           {/* Top nav: back to main site + back to careers */}
//           <div className="flex items-center justify-between gap-3 mb-6">
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <Home className="w-4 h-4" />
//               Back to Main Site
//             </Link>

//             <Link
//               href="/careers"
//               className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Careers
//             </Link>
//           </div>

//           <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
//             Submit Your Application
//           </h1>
//           <p className="text-muted-foreground mt-2 text-pretty leading-relaxed">
//             Fill out the form below to apply for a position with our team.
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-12 max-w-3xl">
//         {/* ✅ SUCCESS VIEW (form is “closed”) */}
//         {submit.status === "success" ? (
//           <Card className="p-6 md:p-8">
//             <div className="flex items-start gap-4">
//               <CheckCircle2 className="w-7 h-7 mt-0.5" />
//               <div className="space-y-2">
//                 <h2 className="text-xl font-semibold">
//                   Application submitted!
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Thanks — we received your application. Keep your reference ID
//                   for follow-up:
//                 </p>
//                 <div className="rounded-md border border-border bg-muted/30 px-4 py-3 inline-block">
//                   <span className="text-sm text-muted-foreground">
//                     Reference ID
//                   </span>
//                   <div className="font-mono text-sm">
//                     {submit.applicationId}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex flex-col sm:flex-row gap-3">
//               <Button asChild className="bg-accent">
//                 <Link href="/careers">Back to Careers</Link>
//               </Button>

//               <Button variant="outline" onClick={resetForAnother}>
//                 Submit Another Application
//               </Button>

//               <Button variant="ghost" asChild className="sm:ml-auto">
//                 <Link href="/">Go to Main Site</Link>
//               </Button>
//             </div>
//           </Card>
//         ) : (
//           /* ✅ FORM VIEW */
//           <Card className="p-6 md:p-8">
//             <h3 className="font-bold">Select a position</h3>

//             <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
//               {/* Position Selection */}
//               <div className="space-y-2">
//                 <Label htmlFor="position">Position *</Label>
//                 <Select
//                   value={selectedPosition}
//                   onValueChange={setSelectedPosition}
//                 >
//                   <SelectTrigger id="position">
//                     <SelectValue placeholder="Select a position" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {positions.map((pos) => (
//                       <SelectItem key={pos.id} value={pos.id}>
//                         {pos.title}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <hr className="my-5" />

//               {/* Personal Information */}
//               <h3 className="font-bold">Personal Information</h3>
//               <div className="grid md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="firstName">First Name *</Label>
//                   <Input id="firstName" name="firstName" required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="middleName">Middle Name</Label>
//                   <Input id="middleName" name="middleName" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="lastName">Last Name *</Label>
//                   <Input id="lastName" name="lastName" required />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-3 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="gender">Gender *</Label>
//                   <Input id="gender" name="gender" required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="dob">Date of birth *</Label>
//                   <Input id="dob" name="dob" type="date" required />
//                 </div>
//               </div>

//               <hr className="my-5" />

//               {/* Contact Information */}
//               <h3 className="font-bold">Contacts</h3>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address *</Label>
//                   <Input id="email" name="email" type="email" required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone Number *</Label>
//                   <Input id="phone" name="phone" type="tel" required />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="addressLine1">Address *</Label>
//                 <Input id="addressLine1" name="addressLine1" required />
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="city">Current City *</Label>
//                   <Input id="city" name="city" required />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="districtOrProvince">
//                     District/Province *
//                   </Label>
//                   <Input
//                     id="districtOrProvince"
//                     name="districtOrProvince"
//                     required
//                   />
//                 </div>
//               </div>

//               <hr className="my-5" />

//               {/* Reference Information */}
//               <h3 className="font-bold">Guarantor/Reference</h3>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="refFirstName">First Name</Label>
//                   <Input id="refFirstName" name="refFirstName" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="refLastName">Last Name</Label>
//                   <Input id="refLastName" name="refLastName" />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="refPhone">Phone Number</Label>
//                   <Input id="refPhone" name="refPhone" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="refEmail">Email Address</Label>
//                   <Input id="refEmail" name="refEmail" type="email" />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="refAddressLine1">Address</Label>
//                 <Input id="refAddressLine1" name="refAddressLine1" />
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="refCity">City/Town</Label>
//                   <Input id="refCity" name="refCity" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="refDistrictOrProvince">
//                     District/Province
//                   </Label>
//                   <Input
//                     id="refDistrictOrProvince"
//                     name="refDistrictOrProvince"
//                   />
//                 </div>
//               </div>

//               <hr className="my-5" />

//               {/* Resume Upload */}
//               <h3 className="font-bold">Resume</h3>
//               <div className="space-y-2">
//                 <Label htmlFor="resume">Resume/CV *</Label>
//                 <Input
//                   id="resume"
//                   name="resume"
//                   type="file"
//                   accept=".pdf,.doc,.docx"
//                   required
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   Accepted formats: PDF, DOC, DOCX (Max 5MB)
//                 </p>
//               </div>

//               {/* Cover Letter */}
//               <div className="space-y-2">
//                 <Label htmlFor="coverLetter">Cover Letter</Label>
//                 <Textarea id="coverLetter" name="coverLetter" rows={6} />
//               </div>

//               {/* Additional Information */}
//               <div className="space-y-2">
//                 <Label htmlFor="experience">Relevant Experience *</Label>
//                 <Textarea id="experience" name="experience" rows={4} required />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="availability">Availability *</Label>
//                 <Select
//                   value={availabilityValue}
//                   onValueChange={setAvailabilityValue}
//                 >
//                   <SelectTrigger id="availability">
//                     <SelectValue placeholder="When can you start?" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="immediately">Immediately</SelectItem>
//                     <SelectItem value="1week">Within 1 week</SelectItem>
//                     <SelectItem value="2weeks">Within 2 weeks</SelectItem>
//                     <SelectItem value="1month">Within 1 month</SelectItem>
//                     <SelectItem value="2months">Within 2 months</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>

//                 {/* ✅ needed because Select isn't a native input */}
//                 <input
//                   type="hidden"
//                   name="availability"
//                   value={availabilityValue}
//                 />
//               </div>

//               {/* Submit */}
//               <div className="pt-4 space-y-3">
//                 {submit.status === "error" && (
//                   <p className="text-sm text-red-600">{submit.message}</p>
//                 )}

//                 <Button
//                   type="submit"
//                   size="lg"
//                   className="w-full md:w-auto bg-accent"
//                   disabled={submit.status === "loading"}
//                 >
//                   {submit.status === "loading"
//                     ? "Submitting..."
//                     : "Submit Application"}
//                 </Button>

//                 <p className="text-xs text-muted-foreground leading-relaxed">
//                   By submitting this application, you agree to our processing of
//                   your personal information in accordance with our privacy
//                   policy.
//                 </p>
//               </div>
//             </form>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }
