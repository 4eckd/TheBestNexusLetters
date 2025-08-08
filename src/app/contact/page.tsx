'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

// Note: In a real app, you'd handle metadata differently for client components
// This would typically be done in a layout or parent server component

const contactInfo = [
  {
    icon: PhoneIcon,
    label: 'Phone',
    value: '(555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: 'info@thebestnexusletters.com',
    href: 'mailto:info@thebestnexusletters.com',
  },
  {
    icon: MapPinIcon,
    label: 'Address',
    value: '123 Veterans Way, Suite 100\nWashington, DC 20001',
    href: '#',
  },
  {
    icon: ClockIcon,
    label: 'Business Hours',
    value: 'Monday - Friday: 9:00 AM - 6:00 PM EST\nSaturday: 10:00 AM - 2:00 PM EST',
    href: '#',
  },
];

const services = [
  'Comprehensive Nexus Letter',
  'Nexus Letter Consultation',
  'Expedited Service',
  'Letter Review & Revision',
  'Independent Medical Examination (IME)',
  'Other (please specify)',
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  otherService: string;
  condition: string;
  message: string;
  urgency: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    otherService: '',
    condition: '',
    message: '',
    urgency: 'standard',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Thank You!
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We've received your inquiry and will contact you within 24 hours to discuss your case. 
              Our team is reviewing your information and will provide you with a detailed consultation.
            </p>
            <div className="mt-10">
              <Button onClick={() => setSubmitted(false)}>
                Submit Another Inquiry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-background px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary/10),transparent)]" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Contact Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Ready to get started with your nexus letter? Contact us today for a free consultation. 
            Our team is here to help you get the medical documentation you need.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Get Your Free Consultation
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Fill out the form below and we'll contact you within 24 hours to discuss your case.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-foreground">
                    Service Needed *
                  </label>
                  <select
                    name="service"
                    id="service"
                    required
                    value={formData.service}
                    onChange={handleInputChange}
                    className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.service === 'Other (please specify)' && (
                  <div>
                    <label htmlFor="otherService" className="block text-sm font-medium text-foreground">
                      Please specify the service you need
                    </label>
                    <input
                      type="text"
                      name="otherService"
                      id="otherService"
                      value={formData.otherService}
                      onChange={handleInputChange}
                      className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-foreground">
                    Medical Condition/Disability
                  </label>
                  <input
                    type="text"
                    name="condition"
                    id="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    placeholder="e.g., PTSD, Hearing Loss, Back Injury"
                    className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="urgency" className="block text-sm font-medium text-foreground">
                    Timeline
                  </label>
                  <select
                    name="urgency"
                    id="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="standard">Standard (7-10 business days)</option>
                    <option value="expedited">Expedited (3-5 business days)</option>
                    <option value="urgent">Urgent (As soon as possible)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">
                    Additional Information
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide any additional details about your case, medical history, or specific requirements..."
                    className="mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Contact Information
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get in touch with our team of medical professionals and support staff.
              </p>

              <div className="mt-8 space-y-8">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <item.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-foreground">
                        {item.label}
                      </h3>
                      {item.href === '#' ? (
                        <p className="mt-1 text-muted-foreground whitespace-pre-line">
                          {item.value}
                        </p>
                      ) : (
                        <a 
                          href={item.href} 
                          className="mt-1 text-muted-foreground hover:text-primary transition-colors whitespace-pre-line"
                        >
                          {item.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Emergency Cases
                </h3>
                <p className="text-muted-foreground text-sm">
                  If you have an urgent deadline for your VA claim or hearing, please call us directly 
                  at <a href="tel:+15551234567" className="text-primary hover:underline">(555) 123-4567</a> 
                  or mark your inquiry as "Urgent" above. We offer expedited services for time-sensitive cases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
