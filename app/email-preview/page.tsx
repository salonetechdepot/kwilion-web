"use client";

import { ContactConfirmationEmail } from "@/emails/templates/contact-confirmation";
import { ContactAlertEmail } from "@/emails/templates/contact-alert";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function EmailPreviewPage() {
  const [activeEmail, setActiveEmail] = useState<"confirmation" | "alert">(
    "confirmation"
  );

  // Sample data for preview
  const sampleData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Innovations Inc.",
    service: "Web & App Development",
    budget: "$5,000 - $10,000",
    message:
      "Hello, I am interested in developing a custom web application for my business. We need a modern, scalable solution that can handle our growing customer base. Please let me know your availability for a consultation.",
    submittedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Template Preview
          </h1>
          <p className="text-gray-600">
            Preview how your email templates will look when sent
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveEmail("confirmation")}
            variant={activeEmail === "confirmation" ? "default" : "outline"}
          >
            User Confirmation Email
          </Button>
          <Button
            onClick={() => setActiveEmail("alert")}
            variant={activeEmail === "alert" ? "default" : "outline"}
          >
            Admin Alert Email
          </Button>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {activeEmail === "confirmation" ? (
            <ContactConfirmationEmail
              key="confirmation"
              name={sampleData.name}
              email={sampleData.email}
              phone={sampleData.phone}
              company={sampleData.company}
              message={sampleData.message}
            />
          ) : (
            <ContactAlertEmail
              key="alert"
              name={sampleData.name}
              email={sampleData.email}
              phone={sampleData.phone}
              company={sampleData.company}
              service={sampleData.service}
              budget={sampleData.budget}
              message={sampleData.message}
              submittedAt={sampleData.submittedAt}
            />
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This preview page is for development purposes only.</p>
          <p className="mt-2">
            Navigate to:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-orange-600">
              /email-preview
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
