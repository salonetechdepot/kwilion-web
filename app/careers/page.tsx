import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Briefcase, MapPin, Clock } from "lucide-react";

const positions = [
  {
    id: "enumerator",
    title: "Enumerator",
    location: "Field",
    type: "Contract",
    description:
      "Conduct surveys and collect data in assigned areas, ensuring accurate and timely information gathering for research and analysis purposes.",
    requirements: [
      "High school diploma or equivalent required",
      "Strong communication and interpersonal skills",
      "Ability to work independently in field settings",
      "Basic computer literacy and smartphone proficiency",
      "Attention to detail and accuracy in data collection",
      "Willingness to travel within assigned regions",
    ],
  },
  {
    id: "admin-support",
    title: "Admin Support",
    location: "Office",
    type: "Contract",
    description:
      "Provide comprehensive administrative support to ensure smooth daily operations, including scheduling, correspondence, and office management tasks.",
    requirements: [
      "Associate degree or equivalent experience",
      "Proficiency in Microsoft Office Suite (Word, Excel, PowerPoint)",
      "Excellent organizational and time management skills",
      "Strong written and verbal communication abilities",
      "Experience with office management systems",
      "Professional demeanor and customer service orientation",
    ],
  },
  {
    id: "data-quality-officer",
    title: "Data Quality Officer",
    location: "Office",
    type: "Contract",
    description:
      "Monitor, analyze, and ensure the quality and integrity of collected data through systematic validation processes and quality control measures.",
    requirements: [
      "Bachelor's degree in Statistics, Data Science, or related field",
      "Experience with data validation and quality assurance",
      "Proficiency in data analysis tools (Excel, SPSS, or similar)",
      "Strong analytical and problem-solving skills",
      "Understanding of data collection methodologies",
      "Ability to identify patterns and anomalies in datasets",
    ],
  },
  {
    id: "team-lead",
    title: "Team Lead/Field Coordinator",
    location: "Field/Office",
    type: "Contract",
    description:
      "Lead and coordinate field teams, ensuring effective data collection operations while managing team performance and stakeholder communications.",
    requirements: [
      "Bachelor's degree and 3+ years of relevant experience",
      "Proven leadership and team management skills",
      "Experience coordinating field operations",
      "Strong project management and organizational abilities",
      "Excellent communication and stakeholder management",
      "Problem-solving skills and ability to work under pressure",
      "Valid driver's license may be required",
    ],
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-balance">
            Join Our Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            We're looking for talented individuals to help us drive impact
            through data collection and field operations. Explore our open
            positions and find your next career opportunity.
          </p>
        </div>
      </div>

      {/* Positions List */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-6">
          {positions.map((position) => (
            <Card
              key={position.id}
              className="p-6 md:p-8 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {position.title}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{position.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button asChild className="md:shrink-0 bg-accent">
                    <Link href={`/careers/apply?position=${position.id}`}>
                      Apply Now
                    </Link>
                  </Button>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {position.description}
                </p>

                {/* Requirements */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {position.requirements.map((req, index) => (
                      <li key={index} className="flex gap-2 leading-relaxed">
                        <span className="text-foreground mt-1.5 shrink-0">
                          •
                        </span>
                        <span className="text-pretty">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">
            Don't see the right position for you?
          </p>
          <Button variant="outline" asChild>
            <Link href="/careers/apply">Submit General Application</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
