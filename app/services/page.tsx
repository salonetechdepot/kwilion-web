import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Lightbulb,
  Code,
  Zap,
  Wrench,
  Users,
  Database,
  Shield,
  Smartphone,
} from "lucide-react";

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/professional-technology-consulting-team-meeting.jpg"
            alt="Technology consulting services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/50" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-balance [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
              Strategic Technology Services
            </h1>
            <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed [text-shadow:_0_1px_8px_rgb(0_0_0_/_30%)]">
              Comprehensive solutions from strategy to execution, tailored for
              Sierra Leonean businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Digital Strategy Consulting */}
          <div id="strategy" className="scroll-mt-20">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary flex items-center justify-center">
                    <Lightbulb className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">
                      Digital Strategy Consulting
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Expert guidance for smarter business decisions.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-lg leading-relaxed">
                  Before you invest in technology, invest in strategy. Our
                  consulting services help you understand your current state,
                  define your goals, and create a clear roadmap to digital
                  transformation. We analyze your business processes, identify
                  inefficiencies, and recommend technology solutions that
                  deliver measurable ROI.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  Whether you're modernizing legacy systems, scaling operations,
                  or entering new markets, our strategic guidance ensures your
                  technology investments align with your business objectives and
                  deliver tangible results.
                </p>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      What We Offer
                    </h4>
                    <ul className="space-y-2 ml-7 text-sm">
                      <li>• Business process analysis & optimization</li>
                      <li>• Technology roadmap planning</li>
                      <li>• Digital transformation strategy</li>
                      <li>• Vendor selection & evaluation</li>
                      <li>• ROI analysis & cost-benefit modeling</li>
                      <li>• Change management planning</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Ideal For</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Business leaders preparing for growth, new system
                      implementation, or digital modernization. Perfect for
                      companies seeking to maximize technology investments and
                      minimize risk.
                    </p>
                    <Link href="/contact">
                      <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                        Audit My Business Process
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Web & App Development */}
          <div id="development" className="scroll-mt-20">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary flex items-center justify-center">
                    <Code className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">
                      Web & App Development
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Custom, scalable solutions built for your business.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-lg leading-relaxed">
                  We build robust, user-friendly web and mobile applications
                  that solve real business problems. From customer-facing
                  platforms to internal management systems, our development team
                  creates solutions that are secure, scalable, and designed to
                  grow with your business.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  Using modern frameworks and best practices, we deliver
                  applications that perform exceptionally well even in
                  challenging network conditions—a critical consideration for
                  Sierra Leone's digital landscape.
                </p>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      What We Offer
                    </h4>
                    <ul className="space-y-2 ml-7 text-sm">
                      <li>• Custom web application development</li>
                      <li>• Progressive web apps (PWAs)</li>
                      <li>• Mobile app development (iOS & Android)</li>
                      <li>• E-commerce platforms</li>
                      <li>• API development & integration</li>
                      <li>• Database design & optimization</li>
                      <li>• Cloud infrastructure setup</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Ideal For</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Businesses needing custom software solutions, e-commerce
                      capabilities, or mobile presence. Perfect for companies
                      outgrowing off-the-shelf solutions or requiring
                      specialized functionality.
                    </p>
                    <Link href="/contact">
                      <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                        Discuss My Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Automation */}
          <div id="automation" className="scroll-mt-20">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary flex items-center justify-center">
                    <Zap className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">
                      Workflow Automation
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Eliminate manual processes and boost efficiency.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-lg leading-relaxed">
                  Manual, repetitive tasks drain your team's time and introduce
                  errors. Our workflow automation services identify bottlenecks
                  in your operations and implement intelligent automation that
                  frees your team to focus on high-value work.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  From automated reporting and data synchronization to
                  intelligent document processing and approval workflows, we
                  create systems that work seamlessly in the background,
                  improving accuracy and speed.
                </p>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      What We Offer
                    </h4>
                    <ul className="space-y-2 ml-7 text-sm">
                      <li>• Process automation & optimization</li>
                      <li>• Data integration & synchronization</li>
                      <li>• Automated reporting & analytics</li>
                      <li>• Document management systems</li>
                      <li>• Approval workflow automation</li>
                      <li>• Email & notification automation</li>
                      <li>• Third-party system integration</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Ideal For</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Organizations with repetitive manual processes, data entry
                      bottlenecks, or disconnected systems. Perfect for
                      businesses seeking to scale operations without
                      proportionally increasing headcount.
                    </p>
                    <Link href="/contact">
                      <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                        Automate My Workflow
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maintenance & Support */}
          <div id="maintenance" className="scroll-mt-20">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary flex items-center justify-center">
                    <Wrench className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">
                      Maintenance & Support
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Proactive care for your technology investments.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-lg leading-relaxed">
                  Technology requires ongoing attention to remain secure,
                  performant, and aligned with your evolving needs. Our
                  maintenance and support services provide peace of mind with
                  proactive monitoring, regular updates, and rapid response to
                  issues.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  We don't just fix problems—we prevent them. Our team
                  continuously optimizes your systems, implements security
                  patches, and provides strategic recommendations to ensure your
                  technology continues to deliver value.
                </p>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      What We Offer
                    </h4>
                    <ul className="space-y-2 ml-7 text-sm">
                      <li>• 24/7 system monitoring & alerts</li>
                      <li>• Regular security updates & patches</li>
                      <li>• Performance optimization</li>
                      <li>• Backup & disaster recovery</li>
                      <li>• Bug fixes & troubleshooting</li>
                      <li>• Feature enhancements</li>
                      <li>• Technical support & training</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Ideal For</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Any business relying on technology for operations.
                      Essential for companies without in-house IT teams or those
                      seeking expert-level support and proactive system
                      management.
                    </p>
                    <Link href="/contact">
                      <Button className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
                        Get Support Plan
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Optional Add-Ons */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Enhance Your Solution
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Modular add-ons to extend your core services and maximize value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Users className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold">
                  CRM Setup & Integration
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Manage customer relationships effectively with customized CRM
                  solutions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <Smartphone className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold">Client Portals</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Secure, branded portals for customer self-service and
                  engagement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <Database className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold">Data Analytics</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transform data into actionable insights with custom
                  dashboards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <Shield className="h-10 w-10 text-accent" />
                <h3 className="text-lg font-semibold">Security Audits</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Comprehensive security assessments and vulnerability testing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Schedule a free consultation and we'll help you identify the right
              solutions for your business goals.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Schedule Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
