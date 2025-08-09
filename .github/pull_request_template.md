## Pull Request Checklist

Thank you for contributing to The Best Nexus Letters! Please ensure all items below are completed before requesting a review.

### 📋 Description
<!-- Provide a brief summary of the changes -->

### 🔗 Related Issues
<!-- Link to related issues using: Fixes #123, Closes #456 -->

### 🧪 Testing Requirements
- [ ] **Component properly typed and tested** - All new components have TypeScript interfaces and comprehensive tests
- [ ] **Test coverage maintained** - Test coverage is above 85% for all modified files
- [ ] **Error handling implemented** - Proper error boundaries and error states are in place
- [ ] **Loading states provided** - UI shows appropriate loading indicators during async operations
- [ ] **End-to-end tests pass** - All E2E tests are passing for affected workflows
- [ ] **Unit tests pass** - All unit tests pass with `pnpm test`
- [ ] **Integration tests pass** - Integration tests pass with `pnpm test:integration`

### 📚 Documentation
- [ ] **Documentation updated** - All relevant documentation has been updated in the `/docs` folder
- [ ] **Storybook stories updated** - Component stories are updated if UI components were modified
- [ ] **README updated** - Project README reflects any setup or usage changes
- [ ] **Code comments added** - Complex logic is well-documented with inline comments
- [ ] **API documentation updated** - Any API changes are reflected in documentation

### 🔐 Security Considerations
- [ ] **Input validation implemented** - All user inputs are validated using Zod schemas
- [ ] **Environment variables secured** - No secrets are hardcoded, all stored in environment variables
- [ ] **File upload restrictions** - Appropriate type, size, and dimension limits are enforced (if applicable)
- [ ] **Authentication verified** - Changes maintain proper authentication and authorization
- [ ] **SQL injection prevention** - All database queries use parameterized statements or Supabase client
- [ ] **XSS protection** - User-generated content is properly sanitized
- [ ] **Rate limiting considered** - API endpoints have appropriate rate limiting (if applicable)

### ⚡ Performance & Quality
- [ ] **Performance optimized** - Code follows performance best practices
- [ ] **Bundle size considered** - Changes don't significantly increase bundle size
- [ ] **Accessibility verified** - Components meet ARIA standards and accessibility guidelines
- [ ] **Mobile responsive** - UI works properly on mobile devices and different screen sizes
- [ ] **Browser compatibility** - Changes work across supported browsers
- [ ] **SEO optimized** - Meta tags and structured data are properly implemented (if applicable)
- [ ] **Images optimized** - Images are compressed and use appropriate formats (WebP, AVIF)

### 🎨 Code Quality
- [ ] **ESLint passes** - Code passes linting with `pnpm lint`
- [ ] **Prettier formatted** - Code is properly formatted with `pnpm format`
- [ ] **TypeScript strict mode** - Code compiles without errors in strict mode
- [ ] **No console.logs** - All debugging console statements have been removed
- [ ] **Meaningful commit messages** - Commits follow conventional commit format
- [ ] **Code review ready** - Code is clean, readable, and follows project conventions

### 🚀 Deployment & CI/CD
- [ ] **Build passes** - Application builds successfully with `pnpm build`
- [ ] **Database migrations** - Any required database changes/migrations are included
- [ ] **Environment configuration** - Required environment variables are documented
- [ ] **Rollback plan** - Clear rollback strategy exists for breaking changes
- [ ] **Preview deployment tested** - Changes have been tested in preview environment

### 🏷️ Labels & Categorization
This PR should be labeled with at least one of:
- `type:feature` - New functionality
- `type:bugfix` - Bug fixes
- `type:enhancement` - Improvements to existing features
- `type:docs` - Documentation changes
- `type:security` - Security-related changes
- `type:performance` - Performance improvements
- `type:refactor` - Code refactoring
- `breaking-change` - Breaking API changes

### 📝 Change Summary
<!-- Detailed description of changes made -->

#### What changed?
<!-- List the main changes -->

#### Why was this change made?
<!-- Explain the motivation -->

#### How was this implemented?
<!-- Describe the technical approach -->

### 🖼️ Screenshots/Videos
<!-- Add screenshots or videos if UI changes were made -->

#### Before
<!-- Screenshot of before state -->

#### After
<!-- Screenshot of after state -->

### 🧪 Testing Strategy
<!-- Describe how you tested these changes -->

### 📊 Performance Impact
<!-- If applicable, describe performance impact -->
- Bundle size change: 
- Lighthouse score impact: 
- Database query performance: 

### 🔄 Migration Steps
<!-- If this includes breaking changes or migrations -->

### 📝 Additional Notes
<!-- Add any additional context, screenshots, or notes for reviewers -->

---

### For Reviewers
- [ ] **Code review completed** - Code follows project standards and best practices
- [ ] **Security review completed** - No security vulnerabilities introduced
- [ ] **Performance impact assessed** - Changes don't negatively impact performance
- [ ] **Documentation verified** - All documentation is accurate and complete
- [ ] **Testing validated** - Tests are comprehensive and pass consistently
- [ ] **Accessibility checked** - UI changes meet accessibility standards

---

**By submitting this PR, I confirm that:**
- I have tested these changes thoroughly
- I have followed the project's coding standards and conventions
- I have considered security implications and followed security best practices
- I have updated relevant documentation and tests
- I understand the code review process and am ready to address feedback
- I have verified that my changes work with the current tech stack (Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase)

<!-- 
🚀 Thank you for contributing to The Best Nexus Letters!
Your PR will be automatically labeled and a preview deployment will be created.
Please wait for CI/CD checks to complete before requesting review.
-->
