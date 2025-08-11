# Open Graph Image Generation System

This document describes the Open Graph (OG) image generation system implemented in The Best Nexus Letters project.

## Overview

The OG image generation system provides automated creation of social media preview images for pages, using:

- **@vercel/og**: For Vercel Edge Runtime compatibility
- **Satori**: For SVG-based image generation with JSX templates
- **Sharp**: For image optimization and format conversion
- **Zod**: For input validation and type safety

## Features

### 🎨 Dynamic Image Generation

- Real-time image generation via API routes
- Multiple predefined templates (default, hero, article, service)
- Three theme variations (light, dark, military)
- Customizable dimensions and quality settings

### 📐 Image Optimization

- Automatic format conversion (PNG, JPEG, WebP)
- Quality optimization with Sharp
- Standard OG image dimensions validation (1200x630, 1200x600, 16:9)
- File size constraints and optimization

### 🚀 Performance Features

- Cached responses with appropriate headers
- Pre-generation scripts for static images
- Lazy loading and preload hints
- Efficient SVG-to-bitmap conversion

### 🔧 Developer Experience

- Type-safe configuration with Zod validation
- React hooks for easy integration
- CLI tools for batch generation
- Comprehensive test coverage

## Usage

### Dynamic Image Generation

```typescript
// Using the API route
const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}&theme=military`;

// Using the React hook
import { useOGImage } from '@/hooks/use-og-image';

const { imageUrl, altText } = useOGImage({
  title: 'Page Title',
  subtitle: 'Page Description',
  theme: 'military',
  template: 'hero',
});
```

### SEO Integration

```typescript
import { generateSeoMetadataWithOG } from '@/components/seo/SeoWithOG';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return generateSeoMetadataWithOG({
    title: 'Page Title',
    description: 'Page description',
    ogImageTemplate: 'hero',
    ogImageTheme: 'military',
    autoGenerateOGImage: true,
  });
}
```

### Batch Generation

```bash
# Generate all predefined images
npm run og:generate

# Dry run to preview what would be generated
npm run og:generate:dry

# Generate with custom config
node scripts/generate-og-images.js --config custom-config.json
```

## Configuration

### OGImageConfig Interface

```typescript
interface OGImageConfig {
  title: string; // Required: Image title text
  subtitle?: string; // Optional: Subtitle text
  theme: 'light' | 'dark' | 'military'; // Visual theme
  template: 'default' | 'hero' | 'article' | 'service'; // Layout template
  dimensions: {
    width: number; // Image width (400-1200)
    height: number; // Image height (300-630)
  };
  format: 'png' | 'jpeg' | 'webp'; // Output format
  quality: number; // Quality (10-100)
  logo?: string; // Optional logo URL
}
```

### Themes

#### Light Theme

- Background: `#ffffff` (white)
- Primary text: `#1f2937` (gray-800)
- Secondary text: `#6b7280` (gray-500)
- Accent: `#3b82f6` (blue-500)

#### Dark Theme

- Background: `#1f2937` (gray-800)
- Primary text: `#ffffff` (white)
- Secondary text: `#d1d5db` (gray-300)
- Accent: `#60a5fa` (blue-400)

#### Military Theme

- Background: `#0f172a` (slate-900)
- Primary text: `#f1f5f9` (slate-100)
- Secondary text: `#94a3b8` (slate-400)
- Accent: `#22c55e` (green-500)

### Templates

#### Default Template

- Centered layout
- Large title text
- Optional subtitle
- Brand attribution in corner

#### Hero Template

- Left-aligned text
- Large title with gradient accent
- Suitable for landing pages

#### Article Template

- "ARTICLE" label
- Clean typography
- Vertical accent bar
- Optimized for blog posts

#### Service Template

- Top gradient bar
- Centered content
- Professional appearance
- Perfect for service pages

## API Routes

### GET /api/og

Generate OG images via GET request with query parameters.

**Parameters:**

- `title` (required): Image title
- `subtitle` (optional): Image subtitle
- `theme` (optional): Theme name (default: 'light')
- `template` (optional): Template name (default: 'default')
- `width` (optional): Image width (default: 1200)
- `height` (optional): Image height (default: 630)

**Example:**

```
GET /api/og?title=The%20Best%20Nexus%20Letters&subtitle=Military%20Letter%20Writing&theme=military&template=hero
```

### POST /api/og

Generate OG images via POST request with JSON body.

**Body:**

```json
{
  "title": "The Best Nexus Letters",
  "subtitle": "Military Letter Writing Service",
  "theme": "military",
  "template": "hero",
  "dimensions": { "width": 1200, "height": 630 },
  "format": "png",
  "quality": 90
}
```

## File Structure

```
src/
├── lib/
│   ├── og-image-generator.ts      # Core generation logic
│   └── __tests__/
│       └── og-image-generator.test.ts
├── app/
│   └── api/
│       └── og/
│           └── route.ts           # API route handlers
├── hooks/
│   └── use-og-image.ts           # React hooks
├── components/
│   └── seo/
│       └── SeoWithOG.tsx         # SEO integration
scripts/
└── generate-og-images.js         # Batch generation script
public/
└── og/                          # Generated images directory
    ├── manifest.json            # Generated image manifest
    └── *.png                   # Generated image files
```

## Performance Considerations

### Caching Strategy

- API responses cached with `max-age=31536000` (1 year)
- Images marked as immutable
- Conditional generation based on parameters

### Optimization

- SVG generation is fast and lightweight
- Sharp provides efficient image processing
- Appropriate image formats for different use cases
- Preload hints for critical images

### File Size Management

- WebP format for smallest files (when supported)
- JPEG for photographic content
- PNG for graphics with transparency
- Quality settings optimized per format

## Error Handling

### Validation Errors

- Zod schema validation for all inputs
- Helpful error messages for invalid configurations
- Fallback to default values when possible

### Generation Errors

- Graceful fallback for missing fonts
- Error logging for debugging
- Default error responses with appropriate status codes

### File System Errors

- Automatic directory creation
- Permission error handling
- Cleanup of temporary files

## Best Practices

### SEO Integration

- Always provide descriptive alt text
- Use appropriate dimensions for different platforms
- Include preload hints for above-the-fold images
- Test with social media validators

### Performance

- Generate static images for unchanging content
- Use dynamic generation sparingly
- Implement proper caching headers
- Monitor file sizes and generation times

### Accessibility

- Generate meaningful alt text automatically
- Ensure sufficient color contrast
- Use readable font sizes
- Test with screen readers

### Development

- Use dry-run mode for testing
- Validate configurations before deployment
- Monitor generation logs for errors
- Test with different content lengths

## Troubleshooting

### Common Issues

#### Images Not Generating

1. Check API route accessibility
2. Verify required parameters are provided
3. Check Sharp installation and native bindings
4. Review server logs for errors

#### Poor Image Quality

1. Adjust quality settings (try 85-95 for PNG)
2. Check image dimensions match requirements
3. Consider using WebP format for better compression
4. Verify font loading and rendering

#### Slow Generation Times

1. Profile SVG generation performance
2. Check Sharp processing time
3. Consider pre-generating static images
4. Optimize template complexity

#### Text Truncation

1. Validate text length constraints
2. Adjust font sizes for longer titles
3. Use line breaks or ellipsis appropriately
4. Test with various content lengths

### Debugging

Enable debug mode in development:

```typescript
const svg = await satori(template, {
  // ... other options
  debug: true, // Shows bounding boxes
});
```

Check generated manifest:

```bash
cat public/og/manifest.json | jq '.'
```

Test API route directly:

```bash
curl -X GET "localhost:3000/api/og?title=Test&theme=military" > test-image.png
```

## Migration Guide

### From Manual OG Images

1. Identify existing static OG images
2. Create corresponding configurations
3. Generate replacements using the system
4. Update HTML meta tags to use dynamic URLs
5. Test with social media platforms

### Adding New Templates

1. Define template function in `og-image-generator.ts`
2. Add template option to validation schema
3. Update TypeScript types
4. Add tests for new template
5. Update documentation

### Custom Themes

1. Add theme colors to themes configuration
2. Update validation schema enum
3. Test with all templates
4. Update documentation and examples

## Contributing

When contributing to the OG image system:

1. Follow existing patterns for templates and themes
2. Add comprehensive tests for new features
3. Update documentation for any changes
4. Ensure backward compatibility
5. Test with real social media platforms
6. Consider performance implications
7. Follow accessibility guidelines

## Related Documentation

- [SEO Documentation](./seo.md)
- [Component Standards](./components.md)
- [Performance Guidelines](./performance.md)
- [Testing Guidelines](./testing.md)
