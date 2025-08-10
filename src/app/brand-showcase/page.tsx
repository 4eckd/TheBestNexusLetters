import BrandColorShowcase from '@/components/ui/brand-color-showcase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brand Colors - TheBestNexusLetters',
  description: 'TheBestNexusLetters brand color palette, gradients, and usage guidelines.',
  robots: 'noindex, nofollow', // Keep internal for now
};

export default function BrandShowcasePage() {
  return (
    <main className="min-h-screen bg-background">
      <BrandColorShowcase />
    </main>
  );
}
