"use client";

import type React from "react";
import { useRef, useState } from "react";
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

const positions = [
  { id: "enumerator", title: "Enumerator" },
  { id: "admin-support", title: "Admin Support" },
  { id: "data-quality-officer", title: "Data Quality Officer" },
  { id: "team-lead", title: "Team Lead/Field Coordinator" },
  { id: "general", title: "General Application" },
];

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; applicationId: string }
  | { status: "error"; message: string };

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const positionParam = searchParams.get("position");

  const [selectedPosition, setSelectedPosition] = useState(positionParam || "");
  const [availabilityValue, setAvailabilityValue] = useState("");
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });

  // lets us reset the form (including file input)
  const formRef = useRef<HTMLFormElement | null>(null);

  const resetForAnother = () => {
    setSubmit({ status: "idle" });
    setAvailabilityValue("");
    setSelectedPosition(positionParam || "");

    // reset ALL native inputs including file
    formRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit({ status: "loading" });

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Select is not a native input
    fd.set("position", selectedPosition || "general");

    try {
      const res = await fetch("/api/careers/job-applications", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to submit application");
      }

      setSubmit({ status: "success", applicationId: json.id });
    } catch (err) {
      setSubmit({
        status: "error",
        message:
          err instanceof Error ? err.message : "Failed to submit application",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Top nav: back to main site + back to careers */}
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
        {/* ✅ SUCCESS VIEW (form is “closed”) */}
        {submit.status === "success" ? (
          <Card className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-7 h-7 mt-0.5" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  Application submitted!
                </h2>
                <p className="text-muted-foreground">
                  Thanks — we received your application. Keep your reference ID
                  for follow-up:
                </p>
                <div className="rounded-md border border-border bg-muted/30 px-4 py-3 inline-block">
                  <span className="text-sm text-muted-foreground">
                    Reference ID
                  </span>
                  <div className="font-mono text-sm">
                    {submit.applicationId}
                  </div>
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
          /* ✅ FORM VIEW */
          <Card className="p-6 md:p-8">
            <h3 className="font-bold">Select a position</h3>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Position Selection */}
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Select
                  value={selectedPosition}
                  onValueChange={setSelectedPosition}
                >
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {pos.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <hr className="my-5" />

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
                <Label htmlFor="addressLine1">Address *</Label>
                <Input id="addressLine1" name="addressLine1" required />
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

                {/* ✅ needed because Select isn't a native input */}
                <input
                  type="hidden"
                  name="availability"
                  value={availabilityValue}
                />
              </div>

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

                <p className="text-xs text-muted-foreground leading-relaxed">
                  By submitting this application, you agree to our processing of
                  your personal information in accordance with our privacy
                  policy.
                </p>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
