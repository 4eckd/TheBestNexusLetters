# Contributing to The Best Nexus Letters

Thank you for your interest in contributing to The Best Nexus Letters! This guide will help you get started with contributing to our project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Release Process](#release-process)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **pnpm** (version 9 or higher)
- **Git**
- **Supabase CLI** (for database-related development)

### Development Setup

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/TheBestNexusLetters.git
   cd TheBestNexusLetters
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   pnpm run dev
   ```

5. **Run Tests** (in a separate terminal)
   ```bash
   pnpm run test
   ```

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug Reports**: Help us identify and fix issues
- 🚀 **Feature Requests**: Suggest new features or improvements
- 🔧 **Code Contributions**: Submit bug fixes or new features
- 📚 **Documentation**: Improve our documentation
- 🎨 **Design**: Contribute UI/UX improvements
- 🧪 **Testing**: Add or improve test coverage
- 🔍 **Code Reviews**: Review pull requests from other contributors

### Before You Start

1. **Search existing issues** to avoid duplicating work
2. **Open an issue** to discuss significant changes before implementing them
3. **Check our roadmap** to align with project goals
4. **Read the guidelines** below to understand our standards

## Pull Request Process

### 1. Create a Branch

Create a descriptive branch name using our naming convention:

```bash
# Feature branches
git checkout -b feature/add-user-authentication

# Bug fix branches
git checkout -b fix/resolve-form-validation

# Documentation branches
git checkout -b docs/update-installation-guide

# Hotfix branches
git checkout -b hotfix/critical-security-patch
```

### 2. Make Your Changes

- Follow our [coding guidelines](#coding-guidelines)
- Write or update tests for your changes
- Update documentation as needed
- Ensure all tests pass locally

### 3. Quality Checks

Before submitting your PR, run these commands:

```bash
# Lint and format code
pnpm run lint
pnpm run format

# Type checking
pnpm run type-check

# Run all tests
pnpm run test:all

# Build the project
pnpm run build
```

### 4. Submit Pull Request

1. **Push your changes** to your fork
2. **Create a pull request** using our PR template
3. **Fill out the template** completely
4. **Link related issues** using "Fixes #123" or "Related to #123"
5. **Request review** from appropriate maintainers

### 5. PR Review Process

- Maintainers will review your PR within 2-3 business days
- Address any feedback or requested changes
- Once approved, your PR will be merged by a maintainer

## Coding Guidelines

### Code Style

We use automated tools to maintain consistent code style:

- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for code formatting
- **Commitlint** for commit message formatting

### TypeScript Guidelines

- Use strict TypeScript configurations
- Define proper interfaces and types
- Avoid `any` types when possible
- Use meaningful variable and function names

### React/Next.js Guidelines

- Use functional components with hooks
- Follow Next.js 15 App Router patterns
- Implement proper error boundaries
- Use Server Components where appropriate
- Ensure responsive design for all components

### File Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components
│   ├── ui/          # Base UI components
│   ├── forms/       # Form components
│   ├── layout/      # Layout components
│   └── providers/   # Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Files**: kebab-case for pages, PascalCase for components
- **CSS Classes**: BEM or utility-first with Tailwind

## Testing Guidelines

### Test Types

We maintain comprehensive test coverage:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions and API endpoints
- **E2E Tests**: Test complete user workflows
- **Accessibility Tests**: Ensure WCAG compliance

### Writing Tests

```typescript
// Unit test example
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Commands

```bash
# Run all tests
pnpm run test:all

# Run specific test types
pnpm run test:unit
pnpm run test:integration  
pnpm run test:e2e

# Run tests in watch mode
pnpm run test

# Generate coverage report
pnpm run test:coverage
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
# Feature
git commit -m "feat(auth): add user login functionality"

# Bug fix
git commit -m "fix(form): resolve validation error display"

# Documentation
git commit -m "docs: update installation instructions"

# Breaking change
git commit -m "feat(api)!: change user authentication endpoint

BREAKING CHANGE: The /auth endpoint now requires a different payload structure"
```

## Accessibility Requirements

All contributions must meet accessibility standards:

### Guidelines

- Follow WCAG 2.1 AA guidelines
- Ensure keyboard navigation works properly
- Use semantic HTML elements
- Provide appropriate ARIA labels
- Maintain proper color contrast ratios (4.5:1 minimum)
- Test with screen readers

### Testing Accessibility

```bash
# Run accessibility tests
pnpm run test:e2e -- accessibility.spec.ts

# Manual testing checklist
- [ ] Tab navigation works correctly
- [ ] Screen reader announces content properly
- [ ] Color contrast meets guidelines
- [ ] Focus indicators are visible
- [ ] Interactive elements are appropriately sized (44px minimum)
```

## Performance Guidelines

### Best Practices

- Optimize images using next/image
- Implement proper loading states
- Use React.memo() for expensive components
- Minimize bundle size with dynamic imports
- Follow Core Web Vitals guidelines

### Performance Testing

```bash
# Analyze bundle size
pnpm run analyze

# Run performance tests
pnpm run test:e2e -- performance.spec.ts
```

## Security Guidelines

### Security Practices

- Validate all user inputs with Zod schemas
- Implement proper rate limiting
- Use environment variables for sensitive data
- Follow OWASP security guidelines
- Implement CSP headers

### Security Testing

```bash
# Run security audit
pnpm audit

# Check for vulnerabilities
pnpm run security:scan
```

## Release Process

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):

- `MAJOR`: Breaking changes
- `MINOR`: New features (backwards compatible)
- `PATCH`: Bug fixes (backwards compatible)

### Release Steps

1. **Update version** in package.json
2. **Update CHANGELOG.md** with new changes
3. **Create release tag**: `git tag -a v1.2.3 -m "Release v1.2.3"`
4. **Push tag**: `git push origin v1.2.3`
5. **GitHub Actions** will automatically create a release

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community chat
- **Pull Requests**: Code review and collaboration

### Getting Help

If you need help:

1. Check existing documentation
2. Search closed issues for similar problems
3. Open a new issue with a clear description
4. Join our community discussions

### Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Annual contributor spotlight

## Questions?

If you have questions about contributing, feel free to:

- Open an issue with the "question" label
- Start a discussion in GitHub Discussions
- Contact the maintainers directly

Thank you for contributing to The Best Nexus Letters! 🎉
