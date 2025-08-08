import { CommunityLink } from '@/components/ui/community-link';
import { MessageCircle, Users, BookOpen, HelpCircle, Lightbulb, Settings } from 'lucide-react';

export default function CommunityDemoPage() {
  // Example custom categories
  const customCategories = [
    {
      id: 'announcements',
      name: 'Announcements',
      slug: 'announcements',
      description: 'Latest news and updates from the team',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      id: 'general',
      name: 'General Discussion',
      slug: 'general',
      description: 'Chat about anything and everything',
      icon: MessageCircle,
      color: 'text-green-600',
    },
    {
      id: 'support',
      name: 'Support',
      slug: 'support',
      description: 'Get help with technical issues',
      icon: HelpCircle,
      color: 'text-red-600',
    },
    {
      id: 'feedback',
      name: 'Feature Requests',
      slug: 'feedback',
      description: 'Suggest new features and improvements',
      icon: Lightbulb,
      color: 'text-yellow-600',
    },
    {
      id: 'community',
      name: 'Community Events',
      slug: 'community',
      description: 'Community meetups and events',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      id: 'meta',
      name: 'Site Meta',
      slug: 'meta',
      description: 'Discussions about the forum itself',
      icon: Settings,
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Forum Integration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Seamlessly connect with our community through deep-linked forum categories
            with automatic SSO authentication.
          </p>
        </div>

        <div className="space-y-16">
          {/* Single Link Examples */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Single Category Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  Default Link
                </h3>
                <CommunityLink category="general" />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  Custom Link Text
                </h3>
                <CommunityLink 
                  category="support" 
                  linkText="Get Help Now" 
                />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  No External Icon
                </h3>
                <CommunityLink 
                  category="feedback" 
                  linkText="Share Ideas" 
                  showExternalIcon={false}
                />
              </div>
            </div>
          </section>

          {/* Grid Layout */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Category Grid Layout
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <CommunityLink 
                mode="grid" 
                categories={customCategories}
              />
            </div>
          </section>

          {/* List Layout */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Category List Layout
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  All Categories
                </h3>
                <CommunityLink 
                  mode="list" 
                  categories={customCategories}
                />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  Support Categories Only
                </h3>
                <CommunityLink 
                  mode="list" 
                  categories={customCategories.filter(cat => 
                    ['support', 'feedback', 'meta'].includes(cat.id)
                  )}
                />
              </div>
            </div>
          </section>

          {/* Configuration Status */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Integration Status
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Forum integration requires environment variables to be configured.
                  See <code className="text-xs bg-gray-100 px-2 py-1 rounded">docs/discourse-integration.md</code> for setup instructions.
                </span>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Usage Examples
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  Basic Usage
                </h3>
                <pre className="text-sm bg-gray-50 p-4 rounded-md overflow-x-auto">
{`import { CommunityLink } from '@/components/ui';

// Single category link
<CommunityLink 
  category="general" 
  linkText="Join Discussion" 
/>

// Category grid
<CommunityLink 
  mode="grid" 
/>`}
                </pre>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium mb-4 text-gray-900">
                  Custom Categories
                </h3>
                <pre className="text-sm bg-gray-50 p-4 rounded-md overflow-x-auto">
{`const customCategories = [
  {
    id: 'support',
    name: 'Get Help',
    slug: 'support',
    description: 'Technical support',
    icon: HelpCircle,
    color: 'text-red-600'
  }
];

<CommunityLink 
  mode="list"
  categories={customCategories}
/>`}
                </pre>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            This demo showcases the CommunityLink component integration with Discourse forums.
            <br />
            Configure your environment variables to enable live forum links.
          </p>
        </div>
      </div>
    </div>
  );
}
