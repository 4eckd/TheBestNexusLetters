import type { Metadata } from 'next';
import { 
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Our Services - Professional Nexus Letters',
  description: 'Comprehensive nexus letter services for VA disability claims. Licensed medical professionals, fast turnaround, quality guarantee.',
  openGraph: {
    title: 'Professional Nexus Letter Services',
    description: 'Get professional medical nexus letters to support your VA disability claims',
  },
};

const services = [
  {
    name: 'Nexus Letter Consultation',
    description: 'Initial consultation with our medical professionals to review your case and determine the best approach for your nexus letter.',
    icon: UserGroupIcon,
    features: ['Medical record review', 'Case assessment', 'Expert guidance', 'Personalized approach'],
    pricing: 'Starting at $150',
  },
  {
    name: 'Comprehensive Nexus Letter',
    description: 'Complete medical nexus letter written by licensed healthcare professionals with thorough analysis of your condition.',
    icon: DocumentTextIcon,
    features: ['Board-certified physicians', 'Detailed medical analysis', 'VA-compliant formatting', 'Supporting documentation'],
    pricing: 'Starting at $750',
  },
  {
    name: 'Expedited Service',
    description: 'Fast-track processing for urgent cases with 3-5 business day turnaround time.',
    icon: ClockIcon,
    features: ['Priority processing', '3-5 day delivery', 'Rush handling', 'Dedicated support'],
    pricing: 'Additional $200',
  },
  {
    name: 'Review & Revision',
    description: 'Expert review of existing nexus letters with professional recommendations and revisions if needed.',
    icon: ShieldCheckIcon,
    features: ['Professional review', 'Quality assessment', 'Revision recommendations', 'Expert feedback'],
    pricing: 'Starting at $300',
  },
];

const processSteps = [
  {
    step: 1,
    title: 'Initial Consultation',
    description: 'Schedule a consultation to discuss your case and medical history',
  },
  {
    step: 2,
    title: 'Document Review',
    description: 'Our medical professionals review your records and service history',
  },
  {
    step: 3,
    title: 'Letter Creation',
    description: 'Licensed physician creates your comprehensive nexus letter',
  },
  {
    step: 4,
    title: 'Quality Review',
    description: 'Final review and quality assurance before delivery',
  },
  {
    step: 5,
    title: 'Delivery',
    description: 'Receive your professional nexus letter within 7-10 business days',
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-background px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Professional Nexus Letter Services
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Comprehensive medical documentation services to support your VA disability claims. 
            Our licensed healthcare professionals provide thorough, VA-compliant nexus letters.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Our Services
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need for your nexus letter
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Professional medical documentation services tailored to your specific needs and case requirements.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex flex-col bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-x-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary">
                    <service.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold leading-8 tracking-tight text-card-foreground">
                    {service.name}
                  </h3>
                </div>
                
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  {service.description}
                </p>
                
                <ul className="mt-6 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-x-3">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">{service.pricing}</span>
                  <a
                    href="/contact"
                    className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Our Process
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How we create your nexus letter
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A streamlined 5-step process designed to provide you with professional, 
              comprehensive medical documentation.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <div key={step.step} className="flex gap-x-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {step.step}
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="mt-4 h-16 w-0.5 bg-border" />
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
              Contact us today to discuss your case and get professional medical documentation 
              to support your VA disability claim.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/contact"
                className="rounded-md bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background transition-colors"
              >
                Contact Us
              </a>
              <a 
                href="tel:+1234567890" 
                className="text-sm font-semibold leading-6 text-primary-foreground hover:text-primary-foreground/80 transition-colors inline-flex items-center gap-x-2"
              >
                <PhoneIcon className="h-5 w-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
