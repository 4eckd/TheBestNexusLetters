'use client';

import { Suspense } from 'react';
import { Hero, Features, Testimonials, MilitaryService } from '@/components/ui';
import { Loader } from '@/components/feedback';

// Since we can't use async components in the pages dir, we'll create a mock testimonials data for now
// In a real app, you'd fetch this data server-side or use a separate data fetching pattern
const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Army Veteran',
    company: null,
    content:
      'The Best Nexus Letters helped me get the documentation I needed for my VA claim. Professional, thorough, and compassionate service.',
    rating: 5,
    avatar_url: null,
    featured: true,
    active: true,
    metadata: { location: 'Texas' },
    created_at: '',
    updated_at: '',
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Navy Veteran',
    company: null,
    content:
      'Outstanding service and fast turnaround. The nexus letter was comprehensive and exactly what my lawyer needed.',
    rating: 5,
    avatar_url: null,
    featured: true,
    active: true,
    metadata: { location: 'California' },
    created_at: '',
    updated_at: '',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Air Force Veteran',
    company: null,
    content:
      'Professional team that understands the VA process. They made everything clear and easy to understand.',
    rating: 5,
    avatar_url: null,
    featured: true,
    active: true,
    metadata: { location: 'Florida' },
    created_at: '',
    updated_at: '',
  },
];

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />

      <Features />

      <MilitaryService className="border-border border-t" />

      <Suspense
        fallback={
          <div className="py-16 text-center">
            <Loader />
          </div>
        }
      >
        <Testimonials
          testimonials={mockTestimonials}
          featured={true}
          title="Trusted by Veterans Nationwide"
          subtitle="See what our clients say about our nexus letter services"
        />
      </Suspense>

      {/* CTA Section with Brand Gradient */}
      <section className="bg-gradient-patriot shadow-brand-dark py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Your Nexus Letter?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
              Get professional medical documentation to support your VA
              disability claim. Our licensed healthcare professionals are here
              to help.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/contact"
                className="text-navy shadow-brand rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get Started Today
              </a>
              <a
                href="/how-it-works"
                className="text-sm leading-6 font-semibold text-white transition-colors hover:text-white/80"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
