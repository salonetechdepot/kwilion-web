import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Lightbulb, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-primary-foreground py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/diverse-technology-team-collaboration-workspace.jpg"
            alt="About Roar Byte"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/50" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-balance [text-shadow:_0_2px_10px_rgb(0_0_0_/_40%)]">
              About Roar Byte
            </h1>
            <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed [text-shadow:_0_1px_8px_rgb(0_0_0_/_30%)]">
              Empowering Sierra Leonean businesses through strategic technology
              partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                Our Story
              </h2>
            </div>
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-lg leading-relaxed">
                Roar Byte was founded with a clear vision: to bridge the gap
                between business ambition and technological capability in Sierra
                Leone. We recognized that many businesses were held back not by
                lack of vision, but by the absence of strategic technology
                guidance and reliable implementation partners.
              </p>
              <p className="text-lg leading-relaxed">
                Our name reflects our mission—we help businesses adapt and stay
                agile in an ever-changing digital landscape. We don't just build
                software—we become strategic partners in your growth journey.
                Every project begins with understanding your business goals,
                analyzing your processes, and designing solutions that deliver
                measurable ROI.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we're proud to partner with leading businesses across
                banking, agriculture, NGOs, retail, and import/export sectors,
                helping them leverage technology to compete regionally and
                globally while contributing to Sierra Leone's digital
                transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              The principles that guide every partnership and project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-8 space-y-4 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Strategic Partnership</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We prioritize long-term partnerships over transactional
                  relationships, investing in your success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Sustainable Solutions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We build for the long term, creating scalable systems that
                  grow with your business.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  Deep Local Understanding
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We understand Sierra Leone's unique challenges and
                  opportunities, designing accordingly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lightbulb className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">
                  Business-First Mindset
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Technology serves business goals, not the other way around. We
                  focus on ROI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Why Choose Us
              </h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                What sets us apart in Sierra Leone's technology landscape.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8 space-y-3">
                  <h3 className="text-xl font-semibold">
                    End-to-End Ownership
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    From initial strategy to ongoing support, we own the entire
                    journey. No handoffs, no gaps—just seamless execution and
                    accountability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-3">
                  <h3 className="text-xl font-semibold">
                    Business-First Mindset
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We speak business, not just code. Our solutions are designed
                    to solve real problems and deliver measurable ROI, not
                    showcase technology for its own sake.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-3">
                  <h3 className="text-xl font-semibold">Proactive Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We don't wait for things to break. Our proactive monitoring
                    and maintenance keeps your systems running smoothly and
                    evolving with your needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-3">
                  <h3 className="text-xl font-semibold">
                    Local Expertise, Global Standards
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We combine deep understanding of Sierra Leone's business
                    environment with international best practices and
                    cutting-edge technology.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Experienced professionals dedicated to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8 space-y-4 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                <div>
                  <h3 className="text-xl font-semibold">Amara T. Jaward</h3>
                  <p className="text-sm text-muted-foreground">
                    Founder & Lead Strategist
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  10+ years in technology consulting and application analysis
                  with expertise in digital transformation and business process
                  optimization.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                <div>
                  <h3 className="text-xl font-semibold">Sahr Mbayo</h3>
                  <p className="text-sm text-muted-foreground">
                    Head of Development
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Specializes in system integration and automation with deep
                  expertise in enterprise architecture.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent"></div>
                <div>
                  <h3 className="text-xl font-semibold">Lansana Sawi</h3>
                  <p className="text-sm text-muted-foreground">
                    Solutions Architect
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Full-stack developer focused on building scalable,
                  user-centric web and mobile applications.
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
              Let's Build Something Great Together
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Partner with a team that's invested in your success and
              understands your market.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Start a Conversation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
