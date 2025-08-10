'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import flagImage from '@/app/images/flag.png';
import sealArmy from '@/app/images/sealArmy.png';
import sealNavy from '@/app/images/sealNavy.png';
import sealAirForce from '@/app/images/sealAirForce.png';
import sealMarineCorps from '@/app/images/sealMarineCorps.png';
import sealSpaceForce from '@/app/images/sealSpaceForce.png';

const militaryBranches = [
  { name: 'Army', seal: sealArmy },
  { name: 'Navy', seal: sealNavy },
  { name: 'Air Force', seal: sealAirForce },
  { name: 'Marines', seal: sealMarineCorps },
  { name: 'Space Force', seal: sealSpaceForce },
];

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
  title = 'Professional Nexus Letters for Veterans',
  subtitle = 'Get the documentation you deserve',
  description = 'We help veterans obtain comprehensive medical nexus letters from qualified healthcare professionals to support their VA disability claims with professional, thorough documentation.',
  primaryCTA = { text: 'Get Started Today', href: '/contact' },
  secondaryCTA = { text: 'Learn How It Works', href: '/how-it-works' },
  features = [
    'Licensed healthcare professionals',
    'Comprehensive medical review',
    'Fast turnaround time',
    '100% satisfaction guarantee',
  ],
}: HeroProps) {
  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden">
      {/* Flag Background with Overlay */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={flagImage}
          alt="American flag background"
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-6">
              <span className="shadow-brand-lg inline-flex items-center rounded-full border border-white/40 bg-white/25 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                <ShieldCheckIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Professional Service
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium text-white/90">
                <span>Trusted by thousands of veterans</span>
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 drop-shadow-md">
            {description}
          </p>

          <div className="mt-8">
            <h2 className="mb-6 text-xl font-semibold text-white drop-shadow-md">
              {subtitle}
            </h2>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400 drop-shadow-md" />
                  </div>
                  <span className="font-medium text-white/90 drop-shadow-sm">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-x-6">
            <Link href={primaryCTA.href}>
              <Button
                size="lg"
                className="btn-enhanced text-navy shadow-brand-xl hover:shadow-brand-2xl bg-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/95"
              >
                {primaryCTA.text}
              </Button>
            </Link>

            <Link href={secondaryCTA.href}>
              <Button
                variant="outline"
                size="lg"
                className="btn-enhanced shadow-brand-lg hover:shadow-brand-xl border-white/40 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
              >
                {secondaryCTA.text}
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side content - Military Service Seals */}
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0">
          <div className="relative">
            <div className="shadow-brand-xl rounded-2xl border border-white/30 bg-black/30 p-8 backdrop-blur-md">
              <h3 className="mb-8 text-center text-xl font-bold text-white drop-shadow-lg">
                Serving All Military Branches
              </h3>
              <div className="mb-6 grid grid-cols-2 gap-6">
                {militaryBranches.slice(0, 4).map((branch, index) => (
                  <div key={branch.name} className="group text-center">
                    <div className="group-hover:shadow-brand-lg mx-auto mb-3 h-16 w-16 rounded-full border border-white/40 bg-white/20 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-110 hover:bg-white/30">
                      <div className="relative h-full w-full">
                        <Image
                          src={branch.seal}
                          alt={`${branch.name} seal`}
                          fill
                          className="object-contain drop-shadow-sm"
                          sizes="64px"
                        />
                      </div>
                    </div>
                    <p className="text-xs font-semibold tracking-wide text-white/90 drop-shadow-sm">
                      {branch.name}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="hover:shadow-brand-lg group mx-auto mb-3 h-16 w-16 rounded-full border border-white/40 bg-white/20 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30">
                  <div className="relative h-full w-full">
                    <Image
                      src={sealSpaceForce}
                      alt="Space Force seal"
                      fill
                      className="object-contain drop-shadow-sm"
                      sizes="64px"
                    />
                  </div>
                </div>
                <p className="text-xs font-semibold tracking-wide text-white/90 drop-shadow-sm">
                  Space Force
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
