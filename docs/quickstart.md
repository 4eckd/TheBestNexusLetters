---
title: Quick Start Guide
description: Get up and running with The Best Nexus Letters in 5 minutes
---

# Quick Start Guide

Get **The Best Nexus Letters** running locally in just 5 minutes! This guide will help you set up the development environment quickly.

!!! warning "Prerequisites"
    Ensure you have [Node.js 18+](https://nodejs.org/) and [pnpm](https://pnpm.io/) installed on your system.

## 🚀 5-Minute Setup

### 1. Clone the Repository

```bash
git clone https://github.com/username/the-best-nexus-letters.git
cd the-best-nexus-letters
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the environment variables (minimal setup for local development)
# You can use the default Supabase local development URLs for now
```

### 4. Start Supabase (Local Development)

```bash
# Start local Supabase instance
pnpm run supabase:start

# Set up the database
pnpm run db:setup
```

### 5. Start the Development Server

```bash
pnpm run dev
```

🎉 **Done!** Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 What You Get

After completing the quick start, you'll have:

- ✅ **Full Application**: Complete Next.js application running locally
- ✅ **Database**: PostgreSQL database with sample data
- ✅ **Authentication**: Working Supabase Auth setup
- ✅ **All Themes**: 5 military branch themes available
- ✅ **Hot Reload**: Automatic reloading during development

## 🔧 Development Commands

Here are the essential commands for development:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Build production application |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:e2e` | Run end-to-end tests with Playwright |
| `pnpm storybook` | Start Storybook component library |
| `pnpm lint` | Run ESLint code analysis |
| `pnpm format` | Format code with Prettier |

## 🎨 Available Features

### Multi-Theme System
Switch between 5 professional themes:
- **Light**: Clean, professional appearance
- **Dark**: Modern dark theme for low-light environments
- **Army**: Army green color scheme
- **Navy**: Naval blue color palette
- **Marines**: Marine red accent colors

### Component Library
Access the complete component library:
```bash
pnpm storybook
```
Visit [http://localhost:6006](http://localhost:6006) to browse components.

### Testing Suite
Run comprehensive tests:
```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# End-to-end tests
pnpm test:e2e

# All tests
pnpm test:all
```

## 🔍 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── types/              # TypeScript type definitions
├── docs/                   # Documentation (you're here!)
├── public/                 # Static assets
├── supabase/              # Database migrations and config
├── tests/                 # Test files
└── e2e/                   # End-to-end test specs
```

## 🚧 Common Issues & Solutions

### Port Already in Use
If port 3000 is already in use:
```bash
# Use a different port
pnpm dev -- -p 3001
```

### Supabase Connection Issues
If Supabase won't start:
```bash
# Reset Supabase
pnpm run supabase:stop
pnpm run supabase:start
```

### Module Not Found Errors
If you see import errors:
```bash
# Clean install dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
If TypeScript is complaining:
```bash
# Check types
pnpm run type-check

# Restart TypeScript in your IDE
```

## 📚 Next Steps

Now that you're up and running:

1. **[Read the Full Setup Guide →](getting-started/SETUP.md)** - Complete development environment setup
2. **[Explore the Component Library →](development/component-library.md)** - Learn about available components
3. **[Understand the Architecture →](architecture/overview.md)** - Deep dive into system design
4. **[Check the Contributing Guide →](getting-started/CONTRIBUTING.md)** - Learn how to contribute

## ❓ Need Help?

- 📖 **[Full Documentation](index.md)** - Complete documentation hub
- 🐛 **[Report Issues](https://github.com/username/the-best-nexus-letters/issues)** - Found a bug?
- 💬 **[GitHub Discussions](https://github.com/username/the-best-nexus-letters/discussions)** - Ask questions
- 📧 **[Contact Support](mailto:support@thebestnexusletters.com)** - Direct support

---

**Ready to build something awesome?** 🚀

The platform is now running locally and ready for development. Happy coding!
