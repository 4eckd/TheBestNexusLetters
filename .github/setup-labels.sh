#!/bin/bash

# 🏷️ GitHub Labels Setup Script
# This script creates all the labels needed for the automated labeling system
# Run this script once after setting up the repository

set -e

echo "🚀 Setting up GitHub labels for The Best Nexus Letters..."

# Colors for different label categories
AREA_COLOR="0E8A16"        # Green
SIZE_COLOR="FBB040"        # Orange  
TYPE_COLOR="B60205"        # Red
PRIORITY_COLOR="D73027"    # Dark Red
SPECIAL_COLOR="0366D6"     # Blue
FRAMEWORK_COLOR="7B68EE"   # Medium Slate Blue

# Function to create or update label
create_label() {
    local name="$1"
    local color="$2" 
    local description="$3"
    
    echo "Creating label: $name"
    gh label create "$name" --color "$color" --description "$description" 2>/dev/null || \
    gh label edit "$name" --color "$color" --description "$description"
}

# Check if GitHub CLI is installed and authenticated
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI is not authenticated. Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"

# =======================
# AREA-BASED LABELS
# =======================

echo "📁 Creating area-based labels..."

create_label "area:components" "$AREA_COLOR" "Changes to React components"
create_label "area:pages" "$AREA_COLOR" "Changes to pages and routes"
create_label "area:api" "$AREA_COLOR" "Changes to API routes and endpoints"
create_label "area:database" "$AREA_COLOR" "Changes to database schema, queries, or Supabase"
create_label "area:auth" "$AREA_COLOR" "Changes to authentication and authorization"
create_label "area:ui" "$AREA_COLOR" "Changes to UI components and styles"
create_label "area:hooks" "$AREA_COLOR" "Changes to React hooks"
create_label "area:utils" "$AREA_COLOR" "Changes to utility functions and helpers"
create_label "area:types" "$AREA_COLOR" "Changes to TypeScript types and interfaces"
create_label "area:testing" "$AREA_COLOR" "Changes to test files and testing configuration"
create_label "area:docs" "$AREA_COLOR" "Changes to documentation"
create_label "area:ci/cd" "$AREA_COLOR" "Changes to CI/CD workflows and deployment"
create_label "area:config" "$AREA_COLOR" "Changes to configuration files"
create_label "area:scripts" "$AREA_COLOR" "Changes to scripts and automation"
create_label "area:public" "$AREA_COLOR" "Changes to public assets"
create_label "area:storybook" "$AREA_COLOR" "Changes to Storybook stories and configuration"

# =======================
# SIZE-BASED LABELS  
# =======================

echo "📏 Creating size-based labels..."

create_label "size:xs" "$SIZE_COLOR" "Extra small PR (1-3 files changed)"
create_label "size:small" "$SIZE_COLOR" "Small PR (4-10 files changed)"
create_label "size:medium" "$SIZE_COLOR" "Medium PR (11-30 files changed)"
create_label "size:large" "$SIZE_COLOR" "Large PR (31-100 files changed)"
create_label "size:xl" "$SIZE_COLOR" "Extra large PR (101-300 files changed)"
create_label "size:xxl" "$SIZE_COLOR" "Huge PR (300+ files changed)"

# =======================
# TYPE-BASED LABELS
# =======================

echo "🔖 Creating type-based labels..."

create_label "type:feature" "$TYPE_COLOR" "New feature implementation"
create_label "type:bugfix" "$TYPE_COLOR" "Bug fix"
create_label "type:hotfix" "$TYPE_COLOR" "Critical hotfix"
create_label "type:refactor" "$TYPE_COLOR" "Code refactoring"
create_label "type:chore" "$TYPE_COLOR" "Maintenance and chore tasks"
create_label "type:docs" "$TYPE_COLOR" "Documentation updates"
create_label "type:test" "$TYPE_COLOR" "Test additions or improvements"
create_label "type:ci" "$TYPE_COLOR" "CI/CD improvements"
create_label "type:style" "$TYPE_COLOR" "Code style and formatting"
create_label "type:perf" "$TYPE_COLOR" "Performance improvements"

# =======================
# PRIORITY LABELS
# =======================

echo "⚡ Creating priority labels..."

create_label "priority:critical" "$PRIORITY_COLOR" "Critical priority - hotfix required"
create_label "priority:high" "$PRIORITY_COLOR" "High priority - security or important features"
create_label "priority:low" "28A745" "Low priority - minor improvements"

# =======================
# SPECIAL LABELS
# =======================

echo "⭐ Creating special labels..."

create_label "dependencies" "$SPECIAL_COLOR" "Dependency updates"
create_label "security" "$PRIORITY_COLOR" "Security-related changes"
create_label "performance" "FF7F00" "Performance-related changes"
create_label "breaking-change" "$PRIORITY_COLOR" "Breaking changes"
create_label "needs-review" "FBCA04" "Needs thorough review"
create_label "ready-for-merge" "28A745" "Ready to be merged"

# =======================
# FRAMEWORK SPECIFIC
# =======================

echo "🛠️ Creating framework-specific labels..."

create_label "framework:nextjs" "$FRAMEWORK_COLOR" "Next.js specific changes"
create_label "framework:react" "$FRAMEWORK_COLOR" "React specific changes"
create_label "database:supabase" "$FRAMEWORK_COLOR" "Supabase database changes"
create_label "styling:tailwind" "$FRAMEWORK_COLOR" "Tailwind CSS styling changes"
create_label "tool:storybook" "$FRAMEWORK_COLOR" "Storybook related changes"
create_label "tool:playwright" "$FRAMEWORK_COLOR" "Playwright E2E testing changes"
create_label "tool:vitest" "$FRAMEWORK_COLOR" "Vitest unit testing changes"

# =======================
# AUTOMATED LABELS
# =======================

echo "🤖 Creating automated labels..."

create_label "automated" "E4E669" "Automated pull request (dependabot, etc)"
create_label "github-actions" "$SPECIAL_COLOR" "GitHub Actions workflow changes"
create_label "docker" "$FRAMEWORK_COLOR" "Docker related changes"

echo ""
echo "✅ All labels have been created successfully!"
echo ""
echo "📋 Summary of created labels:"
echo "   • Area labels: 17"
echo "   • Size labels: 6" 
echo "   • Type labels: 10"
echo "   • Priority labels: 3"
echo "   • Special labels: 6"
echo "   • Framework labels: 7"
echo "   • Automated labels: 3"
echo "   • Total: 52 labels"
echo ""
echo "🎉 Your repository is now ready for automated labeling!"
echo ""
echo "Next steps:"
echo "1. Ensure the labeler.yml file is properly configured"
echo "2. Test the labeling by creating a test PR"
echo "3. Adjust any label colors or descriptions if needed"
echo ""
echo "For more information, see: .github/QUALITY_GATES.md"
