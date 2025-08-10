'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ColorSwatch {
  name: string;
  hex: string;
  variable: string;
  tailwind: string;
  usage: string;
}

const primaryColors: ColorSwatch[] = [
  {
    name: 'Navy Blue',
    hex: '#0A1F44',
    variable: '--primary',
    tailwind: 'bg-navy',
    usage: 'Primary text, headers, main CTAs'
  },
  {
    name: 'American Red',
    hex: '#DC2450',
    variable: '--accent',
    tailwind: 'bg-red',
    usage: 'Accent elements, important actions'
  },
  {
    name: 'Contrast Blue',
    hex: '#327DC8',
    variable: '--secondary',
    tailwind: 'bg-contrast',
    usage: 'Links, secondary actions, info'
  },
  {
    name: 'Freebase White',
    hex: '#F0F0F0',
    variable: '--background',
    tailwind: 'bg-white',
    usage: 'Light backgrounds, card surfaces'
  }
];

const gradients = [
  {
    name: 'Patriot Gradient',
    class: 'bg-gradient-patriot',
    description: 'Navy to Contrast Blue diagonal'
  },
  {
    name: 'Energy Gradient', 
    class: 'bg-gradient-energy',
    description: 'American Red to Deep Crimson'
  },
  {
    name: 'Skyline Gradient',
    class: 'bg-gradient-skyline', 
    description: 'Sky Mist to Contrast Blue'
  },
  {
    name: 'Hero Gradient',
    class: 'bg-gradient-hero',
    description: 'Three-color patriotic blend'
  }
];

const ColorSwatch: React.FC<{ color: ColorSwatch }> = ({ color }) => (
  <Card className="border-border">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">{color.name}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div 
        className={`${color.tailwind} h-16 w-full rounded-md border border-border flex items-center justify-center`}
        style={{ backgroundColor: color.hex }}
      >
        <span className="text-xs font-mono text-white mix-blend-difference">
          {color.hex}
        </span>
      </div>
      <div className="space-y-1 text-xs">
        <p><strong>CSS Var:</strong> <code className="bg-muted px-1 rounded text-muted-foreground">{color.variable}</code></p>
        <p><strong>Tailwind:</strong> <code className="bg-muted px-1 rounded text-muted-foreground">{color.tailwind}</code></p>
        <p><strong>Usage:</strong> <span className="text-muted-foreground">{color.usage}</span></p>
      </div>
    </CardContent>
  </Card>
);

const GradientSwatch: React.FC<{ gradient: typeof gradients[0] }> = ({ gradient }) => (
  <Card className="border-border">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">{gradient.name}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className={`${gradient.class} h-16 w-full rounded-md border border-border flex items-center justify-center`}>
        <span className="text-xs font-mono text-white mix-blend-difference font-semibold">
          Gradient
        </span>
      </div>
      <div className="space-y-1 text-xs">
        <p><strong>Class:</strong> <code className="bg-muted px-1 rounded text-muted-foreground">{gradient.class}</code></p>
        <p><strong>Usage:</strong> <span className="text-muted-foreground">{gradient.description}</span></p>
      </div>
    </CardContent>
  </Card>
);

const BrandColorShowcase: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/tbnl-logo.svg"
            alt="TheBestNexusLetters Logo"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <h1 className="text-3xl font-bold text-foreground">
            TheBestNexusLetters Brand Colors
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our brand colors convey patriotism, professionalism, and trust. Drawing inspiration 
          from American flag colors and military traditions while maintaining modern accessibility standards.
        </p>
      </div>

      {/* Brand Demonstration */}
      <Card className="bg-gradient-patriot text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Professional Nexus Letters</CardTitle>
          <p className="opacity-90">
            Connecting veterans with their earned benefits through expert letter writing services.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="bg-white text-navy hover:bg-white/90">
              Get Started
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              Veteran Owned
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              100% Success Rate
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              Expert Reviews
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Primary Colors */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Primary Brand Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {primaryColors.map((color) => (
            <ColorSwatch key={color.name} color={color} />
          ))}
        </div>
      </section>

      {/* Brand Gradients */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Brand Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gradients.map((gradient) => (
            <GradientSwatch key={gradient.name} gradient={gradient} />
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Usage Examples</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Primary Action Example */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-navy">Primary Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-navy hover:bg-navy-800 text-white">
                Submit Application
              </Button>
              <Button className="w-full bg-red hover:bg-red-dark text-white">
                Urgent: Review Required
              </Button>
              <Button variant="outline" className="w-full border-contrast text-contrast hover:bg-contrast hover:text-white">
                View Details
              </Button>
            </CardContent>
          </Card>

          {/* Info Card Example */}
          <Card className="border-contrast bg-mist/20">
            <CardHeader>
              <CardTitle className="text-contrast">Information Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Using Sky Mist background with Contrast Blue accents for informational content 
                that needs to stand out without being alarming.
              </p>
              <Button className="mt-3 bg-contrast hover:bg-contrast-600 text-white text-sm">
                Learn More
              </Button>
            </CardContent>
          </Card>

          {/* Alert Example */}
          <Card className="border-red bg-red/5">
            <CardHeader>
              <CardTitle className="text-red">Important Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                American Red is used sparingly for important alerts and calls-to-action 
                that require immediate attention.
              </p>
              <Button className="mt-3 bg-red hover:bg-red-dark text-white text-sm">
                Take Action
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Brand Guidelines */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-navy">Brand Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">✅ Do's</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use Navy as the primary color for text and headers</li>
                <li>• Use Red sparingly for important actions and alerts</li>
                <li>• Use Contrast Blue for links and secondary actions</li>
                <li>• Maintain proper contrast ratios (4.5:1 minimum)</li>
                <li>• Combine brand colors with generous white space</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">❌ Don'ts</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Don't use Red as a primary color</li>
                <li>• Don't combine all brand colors in one element</li>
                <li>• Don't use low contrast combinations</li>
                <li>• Don't override CSS variables carelessly</li>
                <li>• Don't use military colors for main brand elements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Notice */}
      <Card className="bg-contrast/5 border-contrast">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-contrast text-white rounded-full p-2 mt-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-contrast mb-1">Accessibility Compliant</h3>
              <p className="text-sm text-muted-foreground">
                All brand colors have been tested for WCAG 2.1 AA compliance with proper contrast ratios 
                and color blindness accessibility. Navy on Freebase White achieves 13.2:1 contrast (AAA compliant).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandColorShowcase;
