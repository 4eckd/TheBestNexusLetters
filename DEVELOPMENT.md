# Development Guidelines

## Branch Protection Setup

To maintain code quality and enforce best practices, set up the following branch protection rules in your repository:

### Main/Master Branch Protection

1. **Go to Repository Settings > Branches**
2. **Add rule for `main` or `master` branch:**
   - ✅ Require a pull request before merging
   - ✅ Require approvals (minimum 1)
   - ✅ Dismiss stale reviews when new commits are pushed
   - ✅ Require review from code owners
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators (recommended)
   - ✅ Restrict pushes that create files

### Required Status Checks

Ensure the following CI checks pass before merging:

- `lint-and-test` (multiple Node.js versions)
- `conventional-commits` (for PRs)

### Development Branch (Optional)

If using a development branch:

- Apply similar protections as main/master
- Allow slightly more flexible review requirements

## Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: Continuous integration changes
- `build`: Build system changes
- `revert`: Reverting previous commits

### Examples

```bash
feat: add user authentication system
fix: resolve memory leak in data processing
docs: update installation instructions
style: format code with prettier
refactor: extract utility functions to separate module
test: add unit tests for user service
chore: update dependencies
```

## Development Workflow

### 1. Local Development Setup

```bash
# Clone repository
git clone <repository-url>
cd TheBestNexusLetters

# Copy environment variables
cp .env.example .env.local

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 2. Feature Development

```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/amazing-feature

# Make changes and commit
git add .
git commit -m "feat: add amazing feature"

# Push branch
git push origin feature/amazing-feature

# Create Pull Request
```

### 3. Code Quality Checks

Before committing, these checks run automatically:

- ESLint for code quality
- Prettier for formatting
- TypeScript type checking

Before PR merge, CI runs:

- Lint and type checking
- Build verification
- Conventional commit validation

### 4. Pull Request Process

1. Create PR from feature branch to main
2. Ensure all CI checks pass
3. Request review from team members
4. Address feedback and push updates
5. Merge when approved and checks pass

## Code Style Guidelines

### TypeScript

- Use strict mode with additional safety checks
- Prefer explicit types over `any`
- Use proper interfaces and type definitions
- Follow consistent naming conventions

### React/Next.js

- Use functional components with hooks
- Prefer named exports for components
- Keep components focused and single-purpose
- Use proper TypeScript props interfaces

### Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Maintain consistent spacing and typography
- Use CSS custom properties for theming

### File Structure

```
src/
├── app/             # Next.js App Router pages
│   ├── globals.css  # Global styles
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
├── components/      # Reusable UI components
│   ├── ui/          # Base UI components
│   └── forms/       # Form components
├── lib/             # Utility functions
│   ├── utils.ts     # General utilities
│   └── config.ts    # Configuration
└── types/           # TypeScript type definitions
```

## Environment Variables

### Development

- Copy `.env.example` to `.env.local`
- Fill in required values for local development
- Never commit `.env.local` or files with secrets

### Production

- Set environment variables in deployment platform
- Use secure secret management
- Follow principle of least privilege

## Testing Strategy

### Unit Tests (Future)

- Test individual components and functions
- Use Jest and React Testing Library
- Aim for high coverage of critical paths

### Integration Tests (Future)

- Test component interactions
- Verify API integrations
- Use testing environment

### E2E Tests (Future)

- Test complete user workflows
- Use Playwright or Cypress
- Run against production-like environment

## Performance Considerations

- Use Next.js Image component for images
- Implement proper caching strategies
- Minimize bundle size
- Use dynamic imports for code splitting
- Monitor Core Web Vitals

## Security Best Practices

- Validate all inputs with Zod schemas
- Use environment variables for secrets
- Implement proper authentication
- Follow OWASP security guidelines
- Regular dependency updates

## Accessibility

- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Maintain proper color contrast
- Test with screen readers

## Documentation

- Keep README.md updated
- Document complex business logic
- Add JSDoc comments for functions
- Update API documentation
- Maintain changelog for releases
