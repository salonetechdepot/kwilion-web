"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

const caseStudies = [
  {
    id: 1,
    title: "Agribusiness Supply Chain Platform",
    industry: "Agriculture",
    services: ["Workflow Automation", "Web Development"],
    challenge: "Manual order processing and inventory tracking led to errors and delays, limiting growth potential.",
    solution:
      "Custom web platform with automated workflows, real-time inventory management, and mobile-friendly interface.",
    results: [
      "Reduced manual data entry by 15 hours/week",
      "Improved order accuracy to 99%",
      "Real-time inventory visibility across 5 locations",
      "40% increase in operational efficiency",
    ],
    image: "/agribusiness-supply-chain-dashboard.jpg",
  },
  {
    id: 2,
    title: "Banking Customer Portal",
    industry: "Banking",
    services: ["Web Development", "Digital Strategy"],
    challenge:
      "Customers required in-person visits for routine transactions, creating bottlenecks and limiting service hours.",
    solution: "Secure customer portal with account management, transaction history, and digital document submission.",
    results: [
      "60% reduction in branch visits",
      "24/7 customer self-service capability",
      "Enhanced security with two-factor authentication",
      "85% customer satisfaction rating",
    ],
    image: "/modern-banking-customer-portal-interface.jpg",
  },
  {
    id: 3,
    title: "NGO Project Management System",
    industry: "NGO",
    services: ["Web Development", "Workflow Automation", "Maintenance"],
    challenge:
      "Disconnected spreadsheets and email chains made project tracking and reporting time-consuming and error-prone.",
    solution:
      "Integrated project management platform with automated reporting, budget tracking, and stakeholder dashboards.",
    results: [
      "Consolidated 12 spreadsheets into one system",
      "Automated monthly reporting saves 20 hours",
      "Real-time budget tracking and alerts",
      "Improved donor transparency and trust",
    ],
    image: "/project-management-dashboard.png",
  },
  {
    id: 4,
    title: "Retail Inventory & POS System",
    industry: "Retail",
    services: ["Web Development", "Workflow Automation"],
    challenge: "Paper-based inventory and manual sales tracking led to stock discrepancies and lost revenue.",
    solution: "Cloud-based POS system with inventory management, sales analytics, and multi-location support.",
    results: [
      "Eliminated stock discrepancies",
      "Real-time sales data across 3 locations",
      "30% reduction in inventory carrying costs",
      "Mobile app for on-the-go management",
    ],
    image: "/modern-retail-point-of-sale-system.jpg",
  },
  {
    id: 5,
    title: "Import/Export Documentation System",
    industry: "Import/Export",
    services: ["Workflow Automation", "Digital Strategy"],
    challenge: "Complex customs documentation process with multiple stakeholders caused delays and compliance risks.",
    solution: "Automated document generation and approval workflow with digital signatures and audit trails.",
    results: [
      "50% faster customs clearance",
      "Zero compliance violations in 12 months",
      "Automated document generation",
      "Complete audit trail for all transactions",
    ],
    image: "/document-management-system-interface.jpg",
  },
  {
    id: 6,
    title: "Healthcare Appointment System",
    industry: "Healthcare",
    services: ["Web Development", "Maintenance"],
    challenge: "Phone-based appointment scheduling led to double bookings and long wait times for patients.",
    solution: "Online appointment booking system with SMS reminders, patient records, and staff scheduling.",
    results: [
      "70% of appointments now booked online",
      "40% reduction in no-shows",
      "Improved patient satisfaction scores",
      "Staff time freed for patient care",
    ],
    image: "/healthcare-appointment-booking-interface.jpg",
  },
]

const industries = ["All", "Agriculture", "Banking", "NGO", "Retail", "Import/Export", "Healthcare"]
const serviceTypes = ["All", "Digital Strategy", "Web Development", "Workflow Automation", "Maintenance"]

export default function WorkPage() {
  const [selectedIndustry, setSelectedIndustry] = useState("All")
  const [selectedService, setSelectedService] = useState("All")

  const filteredCaseStudies = caseStudies.filter((study) => {
    const industryMatch = selectedIndustry === "All" || study.industry === selectedIndustry
    const serviceMatch = selectedService === "All" || study.services.includes(selectedService)
    return industryMatch && serviceMatch
  })

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/successful-business-projects-portfolio-showcase.jpg"
            alt="Our work and case studies"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/50" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-balance [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
              Our Work & Results
            </h1>
            <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed [text-shadow:_0_1px_8px_rgb(0_0_0_/_30%)]">
              Real projects, measurable outcomes, and lasting partnerships with Sierra Leonean businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">Filter by Industry</h3>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <Button
                    key={industry}
                    variant={selectedIndustry === industry ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedIndustry(industry)}
                    className={selectedIndustry === industry ? "bg-primary" : ""}
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">Filter by Service</h3>
              <div className="flex flex-wrap gap-2">
                {serviceTypes.map((service) => (
                  <Button
                    key={service}
                    variant={selectedService === service ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedService(service)}
                    className={selectedService === service ? "bg-accent text-accent-foreground" : ""}
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCaseStudies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No case studies match your filters. Try adjusting your selection.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCaseStudies.map((study) => (
                <Card key={study.id} className="overflow-hidden">
                  <div className="grid md:grid-cols-5 gap-0">
                    <div className="md:col-span-2 relative h-64 md:h-auto bg-gradient-to-br from-primary/10 to-accent/10">
                      <img
                        src={study.image || "/placeholder.svg"}
                        alt={study.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="md:col-span-3 p-8 md:p-10 space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{study.industry}</Badge>
                          {study.services.map((service) => (
                            <Badge key={service} className="bg-accent/10 text-accent hover:bg-accent/20">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-balance">{study.title}</h2>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                            The Challenge
                          </h3>
                          <p className="text-sm leading-relaxed">{study.challenge}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
                            Our Solution
                          </h3>
                          <p className="text-sm leading-relaxed">{study.solution}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                            The Results
                          </h3>
                          <ul className="grid sm:grid-cols-2 gap-2">
                            {study.results.map((result, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="absolute inset-0 z-0">
          <img
            src="/futuristic-technology-innovation-concept-with-digi.jpg"
            alt="Start your project"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/50" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-balance [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed [text-shadow:_0_1px_8px_rgb(0_0_0_/_30%)]">
              Let's discuss how we can help you achieve similar results for your business.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <a href="/contact">Start Your Project</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
