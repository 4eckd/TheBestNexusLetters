---
title: Installation Guide
description: Complete installation and setup instructions for The Best Nexus Letters
---

# Installation Guide

Complete guide for setting up **The Best Nexus Letters** development environment. This guide covers all prerequisites, installation steps, and configuration options.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|-------------|
| **Node.js** | 18.17+ | JavaScript runtime | [Download](https://nodejs.org/) |
| **pnpm** | 8.0+ | Package manager | `npm install -g pnpm` |
| **Git** | 2.40+ | Version control | [Download](https://git-scm.com/) |
| **Docker** | 20+ | Supabase local development | [Download](https://docker.com/) |

### Optional Tools

| Tool | Purpose | Installation |
|------|---------|-------------|
| **VS Code** | Recommended IDE | [Download](https://code.visualstudio.com/) |
| **Supabase CLI** | Database management | [Install Guide](https://supabase.com/docs/guides/cli) |
| **GitHub CLI** | Enhanced Git workflow | [Install Guide](https://cli.github.com/) |

### System Requirements

- **Operating System**: Windows 10/11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space for dependencies and database
- **Network**: Internet connection for downloading dependencies

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/username/the-best-nexus-letters.git

# Using SSH (if you have SSH keys set up)
git clone git@github.com:username/the-best-nexus-letters.git

# Navigate to project directory
cd the-best-nexus-letters
```

### 2. Install Dependencies

```bash
# Install all project dependencies
pnpm install

# Verify installation
pnpm --version
node --version
```

!!! tip "Package Manager"
    We use **pnpm** for faster installs and better dependency management. If you're used to `npm` or `yarn`, the commands are very similar.

### 3. Environment Configuration

#### Copy Environment Template

```bash
# Copy the example environment file
cp .env.example .env.local
```

#### Required Environment Variables

Edit `.env.local` and configure these essential variables:

```bash
# Application
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Discourse Integration
DISCOURSE_URL=http://localhost:4000
DISCOURSE_SSO_SECRET=your-discourse-secret
```

!!! warning "Security"
    Never commit real API keys to version control. Use `.env.local` for local development and configure production secrets in your hosting platform.

### 4. Database Setup

#### Option A: Local Development (Recommended)

```bash
# Start Supabase local development
pnpm run supabase:start

# This will:
# - Start PostgreSQL database
# - Start Supabase Auth server
# - Start Supabase Storage server
# - Start Supabase Edge Functions runtime
```

#### Option B: Cloud Development

1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Copy the URL and keys to your `.env.local`
4. Run database migrations:

```bash
# Push schema to cloud database
pnpm run supabase:migrate
```

#### Initialize Database

```bash
# Set up database schema and seed data
pnpm run db:setup

# Generate TypeScript types from database
pnpm run db:types
```

### 5. Start Development Server

```bash
# Start the Next.js development server
pnpm run dev
```

🎉 **Success!** Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Development Environment

### Essential Commands

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm build            # Build production bundle
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm type-check       # Run TypeScript checks

# Database
pnpm supabase:start   # Start local Supabase
pnpm supabase:stop    # Stop local Supabase
pnpm supabase:reset   # Reset database
pnpm db:setup         # Setup database with seed data
pnpm db:types         # Generate TypeScript types

# Testing
pnpm test             # Run unit tests
pnpm test:run         # Run tests once
pnpm test:coverage    # Run tests with coverage
pnpm test:integration # Run integration tests
pnpm test:e2e         # Run end-to-end tests
pnpm test:all         # Run all tests

# Documentation & Components
pnpm storybook        # Start Storybook
pnpm build-storybook  # Build Storybook static files
```

### IDE Setup (VS Code)

Install recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint",
    "ms-vscode-remote.remote-containers",
    "supabase.supabase-vscode",
    "ms-playwright.playwright"
  ]
}
```

The project includes VS Code settings in `.vscode/settings.json` for:
- Auto-formatting on save
- ESLint integration
- Tailwind CSS IntelliSense
- TypeScript configuration

### Git Hooks

The project uses Husky for Git hooks:

- **Pre-commit**: Runs ESLint and Prettier
- **Commit-msg**: Validates commit message format

```bash
# Commit message format (enforced)
feat: add new user authentication
fix: resolve theme switching bug
docs: update installation guide
```

## 🧪 Verify Installation

Run these commands to verify your installation:

```bash
# 1. Check if development server starts
pnpm dev
# Visit http://localhost:3000

# 2. Check if tests pass
pnpm test:run

# 3. Check if build succeeds
pnpm build

# 4. Check if Storybook works
pnpm storybook
# Visit http://localhost:6006

# 5. Check if database connection works
pnpm run supabase:status
```

## 🔍 Project Structure

```
the-best-nexus-letters/
├── 📁 .github/              # GitHub workflows and templates
├── 📁 .husky/               # Git hooks configuration
├── 📁 .storybook/           # Storybook configuration
├── 📁 .vscode/              # VS Code settings
├── 📁 docs/                 # Documentation files
├── 📁 e2e/                  # End-to-end tests
├── 📁 public/               # Static assets
├── 📁 src/
│   ├── 📁 app/              # Next.js App Router pages
│   ├── 📁 components/       # React components
│   ├── 📁 hooks/            # Custom React hooks
│   ├── 📁 lib/              # Utility libraries
│   ├── 📁 stories/          # Storybook stories
│   └── 📁 types/            # TypeScript definitions
├── 📁 supabase/             # Database config and migrations
├── 📁 tests/                # Test utilities and integration tests
├── 📄 package.json          # Dependencies and scripts
├── 📄 tailwind.config.ts    # Tailwind CSS configuration
├── 📄 tsconfig.json         # TypeScript configuration
└── 📄 vitest.config.ts      # Test configuration
```

## 🚧 Troubleshooting

### Common Issues

#### Port 3000 Already in Use
```bash
# Use different port
pnpm dev -- --port 3001

# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

#### Supabase Won't Start
```bash
# Check Docker is running
docker --version

# Stop and restart Supabase
pnpm run supabase:stop
pnpm run supabase:start

# Check Supabase status
pnpm run supabase:status
```

#### Module Resolution Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Next.js cache
rm -rf .next
pnpm build
```

#### TypeScript Errors
```bash
# Regenerate database types
pnpm run db:types

# Check TypeScript configuration
pnpm run type-check

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

#### Database Connection Issues
```bash
# Check Supabase is running
pnpm run supabase:status

# Reset database
pnpm run supabase:reset
pnpm run db:setup
```

### Performance Issues

If the development server is slow:

```bash
# Use Turbopack (experimental)
pnpm dev --turbo

# Or disable source maps
GENERATE_SOURCEMAP=false pnpm dev
```

### Getting Help

If you're still having issues:

1. **Check the logs**: Look for error messages in the terminal
2. **Search existing issues**: [GitHub Issues](https://github.com/username/the-best-nexus-letters/issues)
3. **Create an issue**: Include your OS, Node version, and error messages
4. **Join discussions**: [GitHub Discussions](https://github.com/username/the-best-nexus-letters/discussions)

## ✅ Next Steps

Now that you have everything installed:

1. **[Read the Quick Start Guide →](quickstart.md)** - Get familiar with the basics
2. **[Explore the Component Library →](development/component-library.md)** - Learn about UI components
3. **[Understand the Architecture →](architecture/overview.md)** - Deep dive into system design
4. **[Check the Testing Guide →](development/TESTING.md)** - Learn about testing practices
5. **[Review Contributing Guidelines →](getting-started/CONTRIBUTING.md)** - Start contributing

---

**Installation complete!** 🎉 You're ready to start developing with The Best Nexus Letters.
