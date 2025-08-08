'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircleIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  features?: string[];
}

export default function Hero({
  title = "Professional Nexus Letters for Veterans",
  subtitle = "Get the documentation you deserve",
  description = "We help veterans obtain comprehensive medical nexus letters from qualified healthcare professionals to support their VA disability claims with professional, thorough documentation.",
  primaryCTA = { text: "Get Started Today", href: "/contact" },
  secondaryCTA = { text: "Learn How It Works", href: "/how-it-works" },
  features = [
    "Licensed healthcare professionals",
    "Comprehensive medical review",
    "Fast turnaround time",
    "100% satisfaction guarantee"
  ]
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                Professional Service
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-muted-foreground">
                <span>Trusted by thousands of veterans</span>
                <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            </a>
          </div>
          
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            {title}
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {description}
          </p>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">{subtitle}</h2>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" asChild>
              <Link href={primaryCTA.href}>
                {primaryCTA.text}
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link href={secondaryCTA.href}>
                {secondaryCTA.text}
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-muted/50 p-2 ring-1 ring-inset ring-border lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="aspect-[16/9] w-full rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary-foreground font-bold text-3xl">N</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Professional Documentation
                  </h3>
                  <p className="text-muted-foreground">
                    Get the medical nexus letters you need to support your VA disability claims
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-secondary to-primary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  );
}
