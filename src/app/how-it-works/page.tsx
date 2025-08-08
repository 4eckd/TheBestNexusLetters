import type { Metadata } from 'next';
import { 
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  FileTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'How It Works - Nexus Letter Process',
  description: 'Learn how our professional nexus letter service works. Simple 5-step process from consultation to delivery.',
  openGraph: {
    title: 'How Our Nexus Letter Process Works',
    description: 'Step-by-step guide to getting professional medical nexus letters for your VA disability claim',
  },
};

const steps = [
  {
    id: 1,
    title: 'Initial Consultation',
    description: 'Contact us to discuss your case, medical history, and specific needs. We\'ll determine the best approach for your nexus letter.',
    icon: PhoneIcon,
    details: [
      'Free initial consultation',
      'Case assessment and planning',
      'Service recommendation',
      'Timeline and pricing discussion'
    ],
    timeframe: '30-60 minutes',
  },
  {
    id: 2,
    title: 'Document Submission',
    description: 'Securely submit your medical records, service records, and any supporting documentation through our portal.',
    icon: FileTextIcon,
    details: [
      'Secure document upload',
      'Medical record review',
      'Service history analysis',
      'Additional documentation requests if needed'
    ],
    timeframe: '1-3 days',
  },
  {
    id: 3,
    title: 'Medical Professional Review',
    description: 'A licensed healthcare professional reviews your case and conducts thorough analysis of your condition.',
    icon: UserIcon,
    details: [
      'Board-certified physician review',
      'Comprehensive medical analysis',
      'Service connection assessment',
      'Evidence-based medical opinion'
    ],
    timeframe: '3-5 days',
  },
  {
    id: 4,
    title: 'Nexus Letter Creation',
    description: 'Our medical professional creates your comprehensive nexus letter with detailed analysis and medical opinion.',
    icon: DocumentTextIcon,
    details: [
      'Professional medical writing',
      'VA-compliant formatting',
      'Detailed medical reasoning',
      'Supporting medical literature'
    ],
    timeframe: '2-3 days',
  },
  {
    id: 5,
    title: 'Quality Review & Delivery',
    description: 'Final quality assurance review before secure delivery of your completed nexus letter.',
    icon: CheckCircleIcon,
    details: [
      'Quality assurance review',
      'Final formatting check',
      'Secure delivery via email',
      'Hard copy mailing option'
    ],
    timeframe: '1-2 days',
  },
];

const faqs = [
  {
    question: 'What is a nexus letter?',
    answer: 'A nexus letter is a medical document written by a qualified healthcare professional that establishes a medical link between your current disability and your military service. It provides the medical opinion necessary to support your VA disability claim.',
  },
  {
    question: 'How long does the process take?',
    answer: 'Our standard process takes 7-10 business days from document submission to delivery. We also offer expedited service for urgent cases with 3-5 day turnaround.',
  },
  {
    question: 'Who writes the nexus letters?',
    answer: 'All nexus letters are written by licensed, board-certified physicians and medical professionals who specialize in the conditions relevant to your case.',
  },
  {
    question: 'What documents do I need to provide?',
    answer: 'We typically need your military service records, current medical records, VA examination reports (C&P exams), and any other relevant medical documentation related to your condition.',
  },
  {
    question: 'Is my information secure?',
    answer: 'Yes, we use HIPAA-compliant systems and encryption to protect your medical information. All documents are handled with strict confidentiality and security measures.',
  },
  {
    question: 'What if I need revisions?',
    answer: 'We stand behind our work with a satisfaction guarantee. If revisions are needed based on VA feedback or additional information, we provide revision services.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-background px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            How It Works
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our streamlined 5-step process makes getting a professional nexus letter simple and straightforward. 
            Here's exactly how we help you get the medical documentation you need.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Our Process
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              5 Simple Steps to Your Nexus Letter
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, stepIndex) => (
              <div key={step.id} className="relative">
                <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-24">
                  <div className={stepIndex % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
                    <div className="flex items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                        <step.icon className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-primary">Step {step.id}</div>
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="mt-6 text-lg text-muted-foreground">
                      {step.description}
                    </p>
                    
                    <dl className="mt-8 space-y-4">
                      {step.details.map((detail) => (
                        <div key={detail} className="flex">
                          <dt className="flex-shrink-0">
                            <CheckCircleIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                          </dt>
                          <dd className="ml-3 text-base text-card-foreground">{detail}</dd>
                        </div>
                      ))}
                    </dl>
                    
                    <div className="mt-6">
                      <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1">
                        <ClockIcon className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium text-primary">
                          Typical timeframe: {step.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`mt-12 lg:mt-0 ${stepIndex % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="relative mx-auto max-w-lg">
                      <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <step.icon className="h-12 w-12 text-primary-foreground" />
                          </div>
                          <h4 className="text-xl font-semibold text-foreground mb-2">
                            {step.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Professional and thorough at every step
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to know
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Get answers to common questions about our nexus letter services and process.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-7">
                    {faq.answer}
                  </p>
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
              Ready to start your nexus letter?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
              Contact us today for a free consultation and take the first step toward getting 
              the medical documentation you need for your VA disability claim.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/contact"
                className="rounded-md bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background transition-colors"
              >
                Get Started Now
              </a>
              <a 
                href="/services" 
                className="text-sm font-semibold leading-6 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
              >
                View Services <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
