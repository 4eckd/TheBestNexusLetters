'use client';

import React from 'react';
import { ExternalLink, MessageCircle, Users, BookOpen, HelpCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

// Discourse category configuration
interface DiscourseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: string;
}

// Default Discourse categories - these can be customized based on your forum structure
const DEFAULT_CATEGORIES: DiscourseCategory[] = [
  {
    id: 'general',
    name: 'General Discussion',
    slug: 'general',
    description: 'General community discussions and topics',
    icon: MessageCircle,
    color: 'text-blue-600',
  },
  {
    id: 'support',
    name: 'Support',
    slug: 'support',
    description: 'Get help and technical support',
    icon: HelpCircle,
    color: 'text-green-600',
  },
  {
    id: 'feedback',
    name: 'Feedback',
    slug: 'feedback',
    description: 'Share your feedback and suggestions',
    icon: Lightbulb,
    color: 'text-yellow-600',
  },
  {
    id: 'announcements',
    name: 'Announcements',
    slug: 'announcements',
    description: 'Official announcements and updates',
    icon: BookOpen,
    color: 'text-purple-600',
  },
  {
    id: 'community',
    name: 'Community',
    slug: 'community',
    description: 'Community events and discussions',
    icon: Users,
    color: 'text-indigo-600',
  },
];

interface CommunityLinkProps {
  /** Category slug or ID to link to */
  category?: string;
  /** Custom categories to override defaults */
  categories?: DiscourseCategory[];
  /** Display mode */
  mode?: 'single' | 'grid' | 'list';
  /** Custom CSS classes */
  className?: string;
  /** Custom link text (for single mode) */
  linkText?: string;
  /** Show external link icon */
  showExternalIcon?: boolean;
  /** Open in new tab */
  openInNewTab?: boolean;
  /** Custom base URL for Discourse forum */
  forumUrl?: string;
}

/**
 * Constructs the full URL for a Discourse category
 */
function buildCategoryUrl(baseUrl: string, categorySlug: string): string {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  return `${cleanBaseUrl}/c/${categorySlug}`;
}

/**
 * Constructs SSO-enabled forum URL that will authenticate the user
 */
function buildSSOUrl(baseUrl: string, returnPath: string): string {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const encodedReturnPath = encodeURIComponent(returnPath);
  return `${cleanBaseUrl}/session/sso?return_path=${encodedReturnPath}`;
}

/**
 * Single category link component
 */
function SingleCategoryLink({
  category,
  categories = DEFAULT_CATEGORIES,
  linkText,
  showExternalIcon = true,
  openInNewTab = true,
  forumUrl,
  className,
}: CommunityLinkProps) {
  const baseUrl = forumUrl || process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL || 'https://community.example.com';
  
  const categoryData = categories.find(cat => cat.slug === category || cat.id === category) || categories[0];
  if (!categoryData) {
    console.error('No category data found');
    return null;
  }
  
  const categoryUrl = buildCategoryUrl(baseUrl, categoryData.slug);
  const ssoUrl = buildSSOUrl(baseUrl, `/c/${categoryData.slug}`);
  
  const IconComponent = categoryData.icon;

  return (
    <a
      href={ssoUrl}
      target={openInNewTab ? '_blank' : '_self'}
      rel={openInNewTab ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
        'bg-white border border-gray-200 hover:border-gray-300',
        'transition-all duration-200 hover:shadow-sm',
        'text-gray-700 hover:text-gray-900',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
    >
      <IconComponent className={cn('w-4 h-4', categoryData.color)} />
      <span className="font-medium">
        {linkText || `Visit ${categoryData.name}`}
      </span>
      {showExternalIcon && (
        <ExternalLink className="w-3 h-3 text-gray-400" />
      )}
    </a>
  );
}

/**
 * Grid layout for multiple categories
 */
function CategoryGrid({
  categories = DEFAULT_CATEGORIES,
  openInNewTab = true,
  forumUrl,
  className,
}: CommunityLinkProps) {
  const baseUrl = forumUrl || process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL || 'https://community.example.com';

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {categories.map((category) => {
        const ssoUrl = buildSSOUrl(baseUrl, `/c/${category.slug}`);
        const IconComponent = category.icon;

        return (
          <a
            key={category.id}
            href={ssoUrl}
            target={openInNewTab ? '_blank' : '_self'}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className={cn(
              'block p-4 rounded-xl border border-gray-200',
              'bg-white hover:bg-gray-50',
              'transition-all duration-200 hover:shadow-md hover:border-gray-300',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn('flex-shrink-0 p-2 rounded-lg bg-gray-50')}>
                <IconComponent className={cn('w-5 h-5', category.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </div>
                <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

/**
 * List layout for multiple categories
 */
function CategoryList({
  categories = DEFAULT_CATEGORIES,
  openInNewTab = true,
  forumUrl,
  className,
}: CommunityLinkProps) {
  const baseUrl = forumUrl || process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL || 'https://community.example.com';

  return (
    <div className={cn('space-y-2', className)}>
      {categories.map((category) => {
        const ssoUrl = buildSSOUrl(baseUrl, `/c/${category.slug}`);
        const IconComponent = category.icon;

        return (
          <a
            key={category.id}
            href={ssoUrl}
            target={openInNewTab ? '_blank' : '_self'}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg',
              'bg-white border border-gray-200',
              'hover:bg-gray-50 hover:border-gray-300',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
          >
            <IconComponent className={cn('w-4 h-4 flex-shrink-0', category.color)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  {category.name}
                </span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}

/**
 * CommunityLink component - provides deep-linking to Discourse forum categories
 * with SSO authentication integration
 */
export function CommunityLink(props: CommunityLinkProps) {
  const { mode = 'single' } = props;

  switch (mode) {
    case 'grid':
      return <CategoryGrid {...props} />;
    case 'list':
      return <CategoryList {...props} />;
    case 'single':
    default:
      return <SingleCategoryLink {...props} />;
  }
}

// Export category configuration for customization
export { DEFAULT_CATEGORIES };
export type { DiscourseCategory };
