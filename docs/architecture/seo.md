---
title: SEO Architecture
description: SEO helper patterns and implementation for The Best Nexus Letters
---

# SEO Architecture

## Overview

The Best Nexus Letters implements a comprehensive SEO strategy using modern Next.js 15 features, structured data, and performance optimization techniques to ensure maximum search engine visibility and user engagement.

## SEO Helper Pattern

### Core SEO Helper

The platform uses a centralized SEO helper pattern that provides consistent metadata generation across all pages:

```typescript
// src/lib/seo/seo-helper.ts
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'service';
  structuredData?: Record<string, any>;
  noIndex?: boolean;
  noFollow?: boolean;
}

export class SEOHelper {
  private static readonly BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://thebestnexusletters.com';
  private static readonly DEFAULT_IMAGE = '/images/og-default.jpg';

  static generateMetadata(options: SEOMetadata): Metadata {
    const {
      title,
      description,
      keywords = [],
      canonicalUrl,
      ogImage = this.DEFAULT_IMAGE,
      ogType = 'website',
      structuredData,
      noIndex = false,
      noFollow = false,
    } = options;

    const fullTitle = `${title} | The Best Nexus Letters`;
    const fullUrl = canonicalUrl
      ? `${this.BASE_URL}${canonicalUrl}`
      : this.BASE_URL;
    const fullImageUrl = ogImage.startsWith('http')
      ? ogImage
      : `${this.BASE_URL}${ogImage}`;

    return {
      title: fullTitle,
      description,
      keywords: keywords.join(', '),
      canonical: fullUrl,
      openGraph: {
        title: fullTitle,
        description,
        url: fullUrl,
        siteName: 'The Best Nexus Letters',
        type: ogType,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: [fullImageUrl],
      },
      robots: {
        index: !noIndex,
        follow: !noFollow,
        googleBot: {
          index: !noIndex,
          follow: !noFollow,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: structuredData
        ? {
            'application/ld+json': JSON.stringify(structuredData),
          }
        : undefined,
    };
  }
}
```

### Page-Level Implementation

Each page uses the SEO helper to generate consistent metadata:

```typescript
// src/app/page.tsx
import { Metadata } from 'next';
import { SEOHelper } from '@/lib/seo/seo-helper';

export const metadata: Metadata = SEOHelper.generateMetadata({
  title: 'Professional Nexus Letters for Veterans',
  description:
    'Expert medical nexus letters for VA disability claims. Professional, evidence-based opinions to support your veteran benefits.',
  keywords: ['nexus letters', 'VA disability', 'veterans', 'medical opinions'],
  canonicalUrl: '/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'The Best Nexus Letters',
    description: 'Professional nexus letter services for veterans',
    url: 'https://thebestnexusletters.com',
    telephone: '+1-800-NEXUS-1',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  },
});
```

## Structured Data Patterns

### Service Schema

```typescript
export const generateServiceSchema = (service: ServiceData) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  provider: {
    '@type': 'MedicalBusiness',
    name: 'The Best Nexus Letters',
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Veterans',
  },
});
```

### Article Schema

```typescript
export const generateArticleSchema = (article: ArticleData) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  author: {
    '@type': 'Person',
    name: article.author,
  },
  datePublished: article.publishDate,
  dateModified: article.modifiedDate,
  publisher: {
    '@type': 'Organization',
    name: 'The Best Nexus Letters',
    logo: {
      '@type': 'ImageObject',
      url: 'https://thebestnexusletters.com/logo.png',
    },
  },
});
```

## Performance Optimization

### Image Optimization

```typescript
// src/components/seo/OptimizedImage.tsx
import Image from 'next/image';
import { generateImageMetadata } from '@/lib/seo/image-seo';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  seoData?: {
    caption?: string;
    title?: string;
  };
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  seoData
}) => {
  const imageMetadata = seoData ? generateImageMetadata(seoData) : {};

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      {...imageMetadata}
    />
  );
};
```

### Core Web Vitals Optimization

```typescript
// src/lib/seo/performance.ts
export const performanceConfig = {
  // Largest Contentful Paint (LCP)
  imageOptimization: {
    formats: ['webp', 'avif'],
    quality: 85,
    sizes: {
      mobile: '100vw',
      tablet: '50vw',
      desktop: '33vw',
    },
  },

  // First Input Delay (FID)
  codesplitting: {
    enableDynamicImports: true,
    chunkSizeLimit: 250000,
  },

  // Cumulative Layout Shift (CLS)
  layoutStability: {
    reserveImageSpace: true,
    preloadCriticalResources: true,
  },
};
```

## Dynamic SEO Generation

### Dynamic Metadata for Service Pages

```typescript
// src/app/services/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/lib/services';
import { SEOHelper, generateServiceSchema } from '@/lib/seo';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);

  if (!service) {
    return SEOHelper.generateMetadata({
      title: 'Service Not Found',
      description: 'The requested service could not be found.',
      noIndex: true,
      noFollow: true,
    });
  }

  return SEOHelper.generateMetadata({
    title: service.title,
    description: service.description,
    keywords: service.keywords,
    canonicalUrl: `/services/${service.slug}`,
    ogImage: service.featuredImage || '/images/services-og.jpg',
    ogType: 'article',
    structuredData: generateServiceSchema(service),
  });
}
```

## Sitemap Generation

### Dynamic Sitemap

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllServices, getAllArticles } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thebestnexusletters.com';
  const services = await getAllServices();
  const articles = await getAllArticles();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map(service => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(service.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map(article => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...articlePages];
}
```

## SEO Testing and Validation

### Automated SEO Tests

```typescript
// tests/seo/seo.test.ts
import { test, expect } from '@playwright/test';
import { checkSEOMetadata, validateStructuredData } from '../utils/seo-utils';

test.describe('SEO Validation', () => {
  test('homepage has proper metadata', async ({ page }) => {
    await page.goto('/');

    const metadata = await checkSEOMetadata(page);

    expect(metadata.title).toContain('The Best Nexus Letters');
    expect(metadata.description).toHaveLength.greaterThan(120);
    expect(metadata.canonical).toBe('https://thebestnexusletters.com/');
    expect(metadata.ogImage).toBeTruthy();
  });

  test('service pages have valid structured data', async ({ page }) => {
    await page.goto('/services/nexus-letters');

    const structuredData = await validateStructuredData(page);

    expect(structuredData['@type']).toBe('Service');
    expect(structuredData.provider).toBeTruthy();
    expect(structuredData.areaServed).toBeTruthy();
  });
});
```

## Performance Monitoring

### Core Web Vitals Tracking

```typescript
// src/lib/seo/analytics.ts
export const trackCoreWebVitals = () => {
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};
```

## Best Practices

### SEO Checklist

- ✅ **Title Tags**: 50-60 characters, unique per page
- ✅ **Meta Descriptions**: 150-160 characters, compelling CTAs
- ✅ **Heading Structure**: Proper H1-H6 hierarchy
- ✅ **Internal Linking**: Strategic internal link structure
- ✅ **Image Alt Text**: Descriptive alt attributes for all images
- ✅ **Structured Data**: Schema.org markup for rich snippets
- ✅ **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- ✅ **Mobile Optimization**: Mobile-first responsive design
- ✅ **Page Speed**: Optimized loading performance
- ✅ **SSL/HTTPS**: Secure connections throughout

### Content Guidelines

1. **Keyword Strategy**: Focus on veteran-related terms and medical terminology
2. **Content Quality**: Expert-written, authoritative content
3. **User Intent**: Address specific veteran needs and questions
4. **Regular Updates**: Keep content fresh and relevant
5. **Local SEO**: Target geographic keywords where applicable

## Implementation Notes

- All SEO helpers are TypeScript-first for type safety
- Metadata generation is server-side for optimal performance
- Structured data is validated against Schema.org standards
- Performance metrics are tracked and monitored
- SEO testing is integrated into CI/CD pipeline

---

_This SEO architecture ensures maximum search visibility while maintaining excellent user experience and performance._
