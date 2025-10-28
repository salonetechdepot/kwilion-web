import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Lightbulb, Code, Zap, Wrench, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative text-primary-foreground py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/modern-technology-office-with-diverse-team-collabo.jpg"
            alt="Technology consulting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/50 to-secondary/40" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance drop-shadow-lg">
              Adapting Your Business for What's Next
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 text-pretty leading-relaxed drop-shadow-md">
              We provide the strategy, development, and support to power your business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/services">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  View Our Services
                </Button>
              </Link>
              <Link href="/work">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  See Our Work
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  Get a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground text-sm mb-6">
            Partnering with leading Sierra Leonean businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <div className="text-2xl font-bold text-muted-foreground">Banking</div>
            <div className="text-2xl font-bold text-muted-foreground">Agriculture</div>
            <div className="text-2xl font-bold text-muted-foreground">NGOs</div>
            <div className="text-2xl font-bold text-muted-foreground">Retail</div>
            <div className="text-2xl font-bold text-muted-foreground">Import/Export</div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Strategic Technology Solutions</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              We're not just developers; we're strategic partners providing end-to-end solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/services#strategy">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Lightbulb className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Digital Strategy Consulting</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Expert guidance for smarter business decisions and technology roadmaps.
                  </p>
                  <div className="flex items-center text-accent text-sm font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/services#development">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Code className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Web & App Development</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Custom, scalable solutions built with modern technologies.
                  </p>
                  <div className="flex items-center text-accent text-sm font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/services#automation">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Zap className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Workflow Automation</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Streamline operations and eliminate manual processes.
                  </p>
                  <div className="flex items-center text-accent text-sm font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/services#maintenance">
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Wrench className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Maintenance & Support</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Proactive monitoring and continuous optimization.
                  </p>
                  <div className="flex items-center text-accent text-sm font-medium">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Our Proven Process</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              A full-service, consultative approach to ensure your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Discover & Strategize</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We analyze your business needs and create a strategic roadmap.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Design & Plan</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Detailed planning and design to align with your goals.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Develop & Integrate</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Building robust solutions with seamless integration.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold">Deploy & Support</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Launch with confidence and ongoing proactive support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlighted Case Study */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-primary/20 to-accent/20">
                  <img
                    src="/modern-agribusiness-technology-dashboard.jpg"
                    alt="Case study"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                  <div className="inline-block">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      Featured Case Study
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-balance">Transforming Agribusiness Operations</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We helped a Freetown-based agribusiness increase operational efficiency by 40% through custom
                    workflow automation and a modern web platform.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Reduced manual data entry by 15 hours/week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Improved order accuracy to 99%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm">Real-time inventory tracking</span>
                    </li>
                  </ul>
                  <Link href="/work">
                    <Button className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                      View Full Case Study
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 md:py-28 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/futuristic-technology-innovation-concept-with-digi.jpg"
            alt="Digital transformation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/50 to-secondary/40" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-balance drop-shadow-lg">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-primary-foreground/90 text-pretty leading-relaxed drop-shadow-md">
              Schedule your free strategy session and discover how we can help you achieve your goals.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Schedule Your Free Strategy Session
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
