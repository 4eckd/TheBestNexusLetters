'use client';

import { StarIcon } from '@heroicons/react/20/solid';
import { Testimonial } from '@/lib/database-helpers';

interface TestimonialsProps {
  testimonials: Testimonial[];
  featured?: boolean;
  title?: string;
  subtitle?: string;
}

export default function Testimonials({ 
  testimonials, 
  featured = false, 
  title = "What our clients say",
  subtitle = "Trusted by businesses across industries" 
}: TestimonialsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < rating 
            ? 'text-yellow-400' 
            : 'text-muted-foreground/30'
        }`}
        aria-hidden="true"
      />
    ));
  };

  if (testimonials.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No testimonials available at the moment.</p>
      </div>
    );
  }

  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className={`grid gap-8 ${
            featured 
              ? 'grid-cols-1 lg:grid-cols-3' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-2xl border border-border p-8 text-sm leading-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <blockquote className="text-card-foreground">
                  <p>"{testimonial.content}"</p>
                </blockquote>
                
                <div className="mt-6 flex items-start gap-x-4">
                  <div className="flex-shrink-0">
                    {testimonial.avatar_url ? (
                      <img
                        className="h-12 w-12 rounded-full bg-muted object-cover"
                        src={testimonial.avatar_url}
                        alt={`${testimonial.name} profile`}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="font-semibold text-card-foreground">
                      {testimonial.name}
                    </div>
                    {testimonial.title && (
                      <div className="text-muted-foreground">
                        {testimonial.title}
                        {testimonial.company && `, ${testimonial.company}`}
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center gap-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    {testimonial.metadata?.location && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {testimonial.metadata.location}
                      </div>
                    )}
                  </div>
                </div>
                
                {featured && testimonial.featured && (
                  <div className="mt-4">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                      Featured Review
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
