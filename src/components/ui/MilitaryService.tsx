'use client';

import Image from 'next/image';
import sealArmy from '@/app/images/sealArmy.png';
import sealNavy from '@/app/images/sealNavy.png';
import sealAirForce from '@/app/images/sealAirForce.png';
import sealMarineCorps from '@/app/images/sealMarineCorps.png';
import sealSpaceForce from '@/app/images/sealSpaceForce.png';
import sealNationalGuard from '@/app/images/sealNationalGuardBureau.png';

const militaryBranches = [
  {
    name: 'United States Army',
    seal: sealArmy,
    motto: "This We'll Defend",
    description:
      'Comprehensive nexus letters for Army veterans and their service-connected conditions.',
  },
  {
    name: 'United States Navy',
    seal: sealNavy,
    motto: 'Semper Fortis',
    description:
      'Professional documentation for Navy veterans pursuing disability claims.',
  },
  {
    name: 'United States Air Force',
    seal: sealAirForce,
    motto: 'Aim High... Fly-Fight-Win',
    description:
      "Expert nexus letters supporting Air Force veterans' medical claims.",
  },
  {
    name: 'United States Marine Corps',
    seal: sealMarineCorps,
    motto: 'Semper Fidelis',
    description:
      'Specialized documentation for Marine Corps veterans and their unique exposures.',
  },
  {
    name: 'United States Space Force',
    seal: sealSpaceForce,
    motto: 'Semper Supra',
    description: 'Cutting-edge nexus letter support for Space Force personnel.',
  },
  {
    name: 'National Guard',
    seal: sealNationalGuard,
    motto: 'Always Ready, Always There',
    description:
      'Dedicated support for National Guard members and their service records.',
  },
];

interface MilitaryServiceProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function MilitaryService({
  title = 'Serving All Military Branches',
  subtitle = 'Professional nexus letters for veterans from every branch of service',
  className = '',
}: MilitaryServiceProps) {
  return (
    <section className={`bg-background py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {militaryBranches.map((branch, index) => (
            <div
              key={branch.name}
              className="group card-enhanced relative rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105"
            >
              <div className="mb-6 flex justify-center">
                <div className="relative h-24 w-24">
                  <Image
                    src={branch.seal}
                    alt={`${branch.name} seal`}
                    fill
                    className="service-seal object-contain"
                    sizes="96px"
                  />
                </div>
              </div>

              <h3 className="text-foreground mb-2 text-lg font-semibold">
                {branch.name}
              </h3>

              <p className="text-primary mb-3 text-sm font-medium italic">
                "{branch.motto}"
              </p>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {branch.description}
              </p>

              {/* Decorative gradient border on hover */}
              <div
                className="bg-gradient-patriot absolute inset-0 -z-10 rounded-2xl border-2 border-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-patriot shadow-brand-lg inline-flex items-center rounded-full px-6 py-3 text-white">
            <span className="text-sm font-semibold">
              🎖️ Honoring your service with professional documentation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
