# The Best Nexus Letters

[![CI Pipeline](https://github.com/your-username/TheBestNexusLetters/workflows/CI%20Pipeline/badge.svg)](https://github.com/your-username/TheBestNexusLetters/actions)
[![CD Pipeline](https://github.com/your-username/TheBestNexusLetters/workflows/CD%20Pipeline/badge.svg)](https://github.com/your-username/TheBestNexusLetters/actions)
[![codecov](https://codecov.io/gh/your-username/TheBestNexusLetters/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/TheBestNexusLetters)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Professional medical nexus letter service platform built with Next.js 15, React 19, TypeScript, and Supabase. Designed to connect veterans with licensed healthcare professionals for comprehensive VA disability claim documentation.

## 🚀 Features

### Core Functionality
- **Professional Nexus Letter Services**: Connect veterans with licensed healthcare providers
- **Secure Document Management**: HIPAA-compliant document handling and storage
- **User Authentication**: Secure login and registration with role-based access control
- **Multi-Theme Support**: 5 professional themes (Light, Dark, Army, Navy, Marines)
- **Responsive Design**: Mobile-first approach with accessibility compliance

### Technical Excellence
- **Modern Stack**: Next.js 15 with App Router, React 19, TypeScript
- **Database**: Supabase with Row Level Security (RLS) and real-time subscriptions
- **Styling**: Tailwind CSS with custom component system
- **Testing**: Comprehensive test suite (Unit, Integration, E2E, Accessibility)
- **Security**: CSP headers, rate limiting, input validation, file upload security
- **Performance**: Bundle optimization, image optimization, code splitting

## 📋 Project Inventory

### 🏗️ Core Application
```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API endpoints
│   ├── community-demo/          # Community demo page
│   ├── contact/                 # Contact page
│   ├── how-it-works/           # How it works page
│   ├── privacy/                # Privacy policy
│   ├── services/               # Services page
│   ├── terms/                  # Terms of service
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                  # Reusable components
│   ├── ui/                     # Base UI components
│   ├── forms/                  # Form components
│   ├── layout/                 # Layout components
│   ├── providers/              # Context providers
│   └── feedback/               # Feedback components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
│   ├── rate-limit.ts          # Rate limiting
│   ├── file-security.ts       # File upload security
│   ├── database-helpers.ts     # Database utilities
│   └── validations.ts         # Input validation
├── types/                      # TypeScript definitions
└── mocks/                      # MSW mocks
```

### 🧪 Testing Infrastructure
```
tests/integration/              # Integration tests
e2e/accessibility.spec.ts       # Accessibility tests
e2e/core-user-journeys.spec.ts  # E2E tests
```

### 📚 Documentation
```
docs/                          # Comprehensive documentation
├── README.md                  # Documentation hub
├── TESTING.md                 # Testing guide
├── component-library.md       # Component documentation
├── STEP-10-HARDENING-SUMMARY.md # Security hardening
└── supabase-setup.md         # Database setup
```

### 🔧 Configuration Files
```
.github/workflows/             # CI/CD pipelines
├── ci.yml                    # Continuous integration
├── cd.yml                    # Continuous deployment
└── labeler.yml               # Automated labeling
.github/dependabot.yml        # Dependency updates
CONTRIBUTING.md               # Contribution guidelines
CHANGELOG.md                  # Project changelog
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

### Backend & Database
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Subscriptions

### Development & Testing
- **Package Manager**: pnpm
- **Testing Framework**: Vitest
- **E2E Testing**: Playwright
- **Accessibility Testing**: axe-core
- **Code Quality**: ESLint, Prettier

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/TheBestNexusLetters.git
   cd TheBestNexusLetters
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   pnpm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Available Scripts

| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Start development server with Turbopack |
| `pnpm build`        | Build production application            |
| `pnpm start`        | Start production server                 |
| `pnpm lint`         | Run ESLint                              |
| `pnpm lint:fix`     | Run ESLint with auto-fix                |
| `pnpm format`       | Format code with Prettier               |
| `pnpm format:check` | Check code formatting                   |
| `pnpm type-check`   | Run TypeScript type checking            |

## 🌍 Environment Variables

This project uses environment variables for configuration. See `.env.example` for all available options.

### Required Variables

```bash
# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Variables

```bash
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret-here
JWT_SECRET=your-jwt-secret

# External Services
EMAIL_API_KEY=your-email-key
AWS_ACCESS_KEY_ID=your-aws-key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-sentry-dsn
```

### Environment File Priority

1. `.env.local` (highest priority, ignored by Git)
2. `.env.development` (development environment)
3. `.env.production` (production environment)
4. `.env` (lowest priority)

**⚠️ Important:** Never commit `.env.local` or any file containing actual secrets!

## 📁 Project Structure

```
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable UI components
│   └── lib/             # Utility functions and configurations
├── public/              # Static assets
├── .husky/              # Git hooks
├── .env.example         # Environment variables template
├── .env.local          # Local environment variables (git-ignored)
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── next.config.ts      # Next.js configuration
```

## 🎨 Code Style & Formatting

This project enforces consistent code style through:

- **ESLint:** Linting with Next.js recommended rules
- **Prettier:** Code formatting with Tailwind class sorting
- **TypeScript:** Strict mode with additional safety checks
- **Husky:** Pre-commit hooks for quality assurance
- **lint-staged:** Run linting only on staged files

### Pre-commit Checks

Every commit automatically runs:

1. ESLint with auto-fix on JS/TS files
2. Prettier formatting on all supported files
3. Type checking with TypeScript

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your Git repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the code style guidelines
4. Commit your changes: `git commit -m 'feat: add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Build process or auxiliary tool changes

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and database testing  
- **E2E Tests**: Complete user workflow testing
- **Accessibility Tests**: WCAG 2.1 AA compliance

### Running Tests
```bash
# All tests
pnpm run test:all

# Specific test types
pnpm run test:unit
pnpm run test:integration
pnpm run test:e2e

# With coverage
pnpm run test:coverage

# Accessibility audit
pnpm run test:e2e -- accessibility.spec.ts
```

## 🔒 Security Features

### Implemented Security Measures
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Rate Limiting**: Protects against abuse and DDoS
- **Input Validation**: Zod schemas for all inputs
- **File Upload Security**: Type, size, and content validation
- **Authentication**: Secure user authentication with Supabase
- **Environment Variables**: Secure configuration management

## ♿ Accessibility

### Compliance
- **WCAG 2.1 AA**: Full compliance
- **Keyboard Navigation**: Complete keyboard support
- **Screen Readers**: Proper ARIA implementation
- **Color Contrast**: 4.5:1 minimum ratio
- **Focus Management**: Proper focus indicators

## ⚡ Performance

### Optimizations
- **Next.js Image**: Automatic image optimization
- **Code Splitting**: Route-based and component-based
- **Bundle Analysis**: Regular bundle size monitoring
- **Core Web Vitals**: Performance monitoring

### Performance Analysis
```bash
# Bundle analysis
pnpm run analyze
```

## 📖 Documentation

### Available Documentation
- [**Documentation Hub**](docs/README.md) - Complete documentation index
- [**Contributing Guide**](CONTRIBUTING.md) - How to contribute
- [**Testing Guide**](docs/TESTING.md) - Comprehensive testing documentation
- [**Component Library**](docs/component-library.md) - UI component documentation
- [**Security Guide**](docs/STEP-10-HARDENING-SUMMARY.md) - Security implementation

### External Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🏆 Quality Metrics

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and standards
- **Prettier**: Code formatting
- **Test Coverage**: 85%+ target
- **Accessibility**: WCAG 2.1 AA compliant

### Performance Metrics
- **Lighthouse Score**: 95+ target
- **Core Web Vitals**: Green ratings
- **Bundle Size**: Monitored and optimized

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help
- **Documentation**: Check our comprehensive [docs](docs/README.md)
- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: Ask questions and get community support

### Maintainers
- **Project Lead**: [@your-username](https://github.com/your-username)
- **Technical Lead**: [@technical-lead](https://github.com/technical-lead)

## 🔗 Links

- **Live Site**: https://thebestnexusletters.com
- **Documentation**: [docs/README.md](docs/README.md)
- **GitHub Actions**: [Actions Dashboard](https://github.com/your-username/TheBestNexusLetters/actions)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [pnpm Documentation](https://pnpm.io/)

---

**Built with ❤️ for veterans and their families**

*Last updated: January 2024*
