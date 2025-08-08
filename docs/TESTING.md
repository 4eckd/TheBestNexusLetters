# Testing Strategy

This document outlines the comprehensive testing strategy implemented for The Best Nexus Letters project, targeting ≥85% test coverage and ensuring robust quality assurance.

## Overview

Our testing strategy follows a three-tier approach:

1. **Unit Tests** - Component-level testing with Vitest + React Testing Library
2. **Integration Tests** - API and database operation testing with Supabase
3. **End-to-End Tests** - User journey testing with Playwright

## Testing Stack

### Core Testing Tools

- **[Vitest](https://vitest.dev/)** - Fast unit test runner
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Component testing utilities
- **[Playwright](https://playwright.dev/)** - End-to-end testing framework
- **[MSW (Mock Service Worker)](https://mswjs.io/)** - API mocking for tests
- **[@testing-library/jest-dom](https://github.com/testing-library/jest-dom)** - Custom Jest matchers

### Additional Tools

- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage.html)** - Code coverage reporting
- **[@vitest/ui](https://vitest.dev/guide/ui.html)** - Visual test interface
- **[jsdom](https://github.com/jsdom/jsdom)** - DOM simulation for Node.js
- **[@testing-library/user-event](https://testing-library.com/docs/user-event/intro)** - User interaction simulation

## Test Structure

```
├── src/
│   ├── __tests__/
│   │   └── utils/
│   │       └── test-utils.tsx          # Testing utilities and helpers
│   ├── components/
│   │   └── **/__tests__/               # Unit tests for components
│   ├── lib/
│   │   └── **/__tests__/               # Unit tests for utilities
│   ├── hooks/
│   │   └── **/__tests__/               # Unit tests for hooks
│   ├── mocks/
│   │   ├── handlers.ts                 # MSW request handlers
│   │   ├── browser.ts                  # MSW browser setup
│   │   └── server.ts                   # MSW server setup
│   └── test-setup.ts                   # Global test configuration
├── tests/
│   └── integration/
│       ├── setup.ts                    # Integration test setup
│       └── **/*.test.ts                # Integration tests
└── e2e/
    ├── tests/                          # E2E test files
    ├── auth.setup.ts                   # Authentication setup
    ├── global-setup.ts                 # Global E2E setup
    └── global-teardown.ts              # Global E2E cleanup
```

## Configuration Files

### Vitest Configuration (`vitest.config.ts`)

- **Coverage**: V8 provider with 85% thresholds
- **Environment**: jsdom for DOM simulation
- **Setup**: Automated MSW and global mocks
- **Aliases**: Path resolution for imports

### Integration Test Configuration (`vitest.integration.config.ts`)

- **Environment**: Node.js for API testing
- **Timeout**: Extended timeouts for database operations
- **Setup**: Supabase local instance integration

### Playwright Configuration (`playwright.config.ts`)

- **Multi-browser**: Chromium, Firefox, WebKit, Mobile
- **Reporters**: HTML, JSON, JUnit for CI integration
- **Screenshots**: On failure for debugging
- **Parallelization**: Full parallel execution

## Testing Categories

### 1. Unit Tests (≥85% Coverage Target)

#### Component Testing

```typescript
// Example: Button component test
import { render, screen } from '@/__tests__/utils/test-utils';
import { Button } from '../Button';

test('should render button with correct variant', () => {
  render(<Button variant="primary">Click me</Button>);
  expect(screen.getByRole('button')).toHaveClass('bg-primary');
});
```

**Coverage Areas:**
- Component rendering and props
- Event handlers and interactions
- Theme compatibility across all themes
- Accessibility compliance (ARIA, keyboard navigation)
- Error boundary handling
- Loading and disabled states

#### Hook Testing

```typescript
// Example: Theme hook test
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../use-theme';

test('should toggle theme correctly', () => {
  const { result } = renderHook(() => useTheme());
  
  act(() => {
    result.current.setTheme('dark');
  });
  
  expect(result.current.theme).toBe('dark');
});
```

#### Utility Function Testing

```typescript
// Example: Database helper test
import { userHelpers } from '../database-helpers';

test('should create user successfully', async () => {
  const userData = { email: 'test@example.com', full_name: 'Test User' };
  const user = await userHelpers.create(userData);
  
  expect(user).toMatchObject(userData);
  expect(user.id).toBeTruthy();
});
```

### 2. Integration Tests

#### Supabase API Integration

```typescript
// Example: Database operation integration test
import { userHelpers } from '@/lib/database-helpers';
import { createTestSupabaseClient } from './setup';

test('should handle database errors gracefully', async () => {
  await expect(userHelpers.getById('invalid-id')).rejects.toThrow('DatabaseError');
});
```

**Coverage Areas:**
- Database CRUD operations
- Authentication flows
- API route handlers
- Error handling and validation
- Data transformation and serialization

### 3. End-to-End Tests

#### Core User Journeys

```typescript
// Example: Homepage navigation test
import { test, expect } from '@playwright/test';

test('should navigate through main pages', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Services');
  await expect(page).toHaveURL(/.*services.*/);
});
```

#### Theme Toggle Testing

```typescript
// Example: Theme persistence test
test('should persist theme across page reloads', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="theme-toggle"]');
  await page.reload();
  
  const theme = await getThemeState(page);
  expect(theme.localStorage).toBeTruthy();
});
```

**Coverage Areas:**
- User authentication flows
- Theme switching and persistence
- Form submissions and validation
- Responsive design across viewports
- Accessibility with keyboard navigation
- Performance and loading times

## MSW (Mock Service Worker) Setup

### Request Handlers (`src/mocks/handlers.ts`)

```typescript
export const handlers = [
  http.get('*/rest/v1/users', () => {
    return HttpResponse.json({ data: mockUsers });
  }),
  
  http.post('*/rest/v1/claims', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ data: { id: 'new-id', ...data } });
  }),
];
```

### Browser Setup (`src/mocks/browser.ts`)

```typescript
export const worker = setupWorker(...handlers);
export const startMocking = () => worker.start();
```

### Server Setup (`src/mocks/server.ts`)

```typescript
export const server = setupServer(...handlers);
export const startMockServer = () => server.listen();
```

## Running Tests

### Local Development

```bash
# Run unit tests in watch mode
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all

# Visual test interface
npm run test:ui
```

### CI/CD Pipeline

The GitHub Actions workflow runs:

1. **Lint and Type Check** - Code quality verification
2. **Unit Tests** - Component and utility testing with coverage
3. **Integration Tests** - API and database testing with local Supabase
4. **E2E Tests** - Full user journey testing with Playwright
5. **Coverage Enforcement** - Ensures ≥85% coverage thresholds

## Coverage Requirements

### Global Thresholds (≥85%)

- **Statements**: 85%
- **Branches**: 85%
- **Functions**: 85%
- **Lines**: 85%

### Exclusions

Files excluded from coverage:
- Test files (`.test.`, `.spec.`)
- Story files (`.stories.`)
- Configuration files
- Mock files and test utilities
- Type declaration files (`.d.ts`)

## Best Practices

### Test Organization

1. **Arrange, Act, Assert** - Structure tests clearly
2. **Descriptive Names** - Test names should describe the behavior
3. **Single Responsibility** - One assertion per test when possible
4. **Clean Setup/Teardown** - Isolate tests from each other

### Component Testing

1. **Test Behavior, Not Implementation** - Focus on user interactions
2. **Accessibility Testing** - Verify ARIA attributes and keyboard navigation
3. **Theme Compatibility** - Test across all available themes
4. **Error States** - Test loading, error, and empty states

### Integration Testing

1. **Real API Calls** - Use actual Supabase local instance when possible
2. **Error Scenarios** - Test network failures and invalid data
3. **Data Validation** - Verify input/output transformations
4. **Authentication** - Test protected routes and permissions

### E2E Testing

1. **User-Centric Scenarios** - Test complete user workflows
2. **Cross-Browser Testing** - Verify compatibility across browsers
3. **Mobile Testing** - Include responsive design validation
4. **Performance Testing** - Monitor loading times and interactions

## Debugging Tests

### Unit Test Debugging

```bash
# Run specific test file
npm run test src/components/Button.test.tsx

# Run tests in debug mode
npm run test -- --reporter=verbose

# Open test UI
npm run test:ui
```

### E2E Test Debugging

```bash
# Run E2E tests in headed mode
npm run test:e2e:headed

# Open Playwright UI
npm run test:e2e:ui

# Run specific E2E test
npx playwright test theme-toggle.spec.ts
```

### Common Debugging Tips

1. **Use `screen.debug()`** - Inspect DOM state in tests
2. **Add `await page.pause()`** - Pause E2E tests for inspection
3. **Check Coverage Reports** - Identify untested code paths
4. **Use Browser DevTools** - Inspect elements and network in E2E tests

## Continuous Improvement

### Monitoring

- Coverage reports in CI/CD
- Test execution time tracking
- Flaky test identification and resolution
- Performance regression detection

### Maintenance

- Regular dependency updates
- Test refactoring for maintainability
- MSW handler updates for API changes
- E2E test stability improvements

## Resources

- [Testing Library Documentation](https://testing-library.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

This testing strategy ensures comprehensive coverage of our application with robust, maintainable tests that provide confidence in our code quality and user experience.
