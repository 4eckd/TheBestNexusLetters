# The Best Nexus Letters

A modern Next.js 15 application built with TypeScript, Tailwind CSS, and best practices for maintainable web development.

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4
- **Package Manager:** pnpm
- **Linting:** ESLint + Next.js config
- **Formatting:** Prettier with Tailwind plugin
- **Git Hooks:** Husky + lint-staged
- **Development:** Turbopack for fast dev builds

## 📋 Prerequisites

- Node.js 18.17 or later
- pnpm (recommended package manager)
- Git

## 🛠️ Getting Started

1. **Clone and Setup:**

   ```bash
   git clone <repository-url>
   cd TheBestNexusLetters
   cp .env.example .env.local
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

3. **Run Development Server:**

   ```bash
   pnpm dev
   ```

4. **Open Application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

## 📝 License

[Add your license information here]

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [pnpm Documentation](https://pnpm.io/)
