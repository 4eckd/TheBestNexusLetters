'use client';

import { 
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const defaultFeatures = [
  {
    name: 'Licensed Healthcare Professionals',
    description: 'All nexus letters are written by board-certified physicians and medical professionals.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Comprehensive Medical Review',
    description: 'Thorough review of your medical records and service history to establish proper nexus.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Fast Turnaround Time',
    description: 'Get your nexus letters within 7-10 business days from completed document submission.',
    icon: ClockIcon,
  },
  {
    name: 'Expert Support Team',
    description: 'Dedicated support staff to guide you through the process and answer your questions.',
    icon: UserGroupIcon,
  },
  {
    name: 'Quality Guarantee',
    description: 'We stand behind our work with a 100% satisfaction guarantee on all nexus letters.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'VA-Compliant Documentation',
    description: 'All letters meet VA requirements and standards for disability claim submissions.',
    icon: CheckBadgeIcon,
  },
];

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features?: typeof defaultFeatures;
}

export default function Features({ 
  title = "Why Choose Our Nexus Letter Service",
  subtitle = "Professional, thorough, and reliable medical documentation for your VA disability claims",
  features = defaultFeatures 
}: FeaturesProps) {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Professional Service
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
