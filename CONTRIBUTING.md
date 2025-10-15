# Contributing to Stock Time Machine

Thank you for your interest in contributing to Stock Time Machine! 🚀

## 🤝 How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the top right of the repository page
- Clone your fork locally:
  ```bash
  git clone https://github.com/yourusername/stock-time-machine.git
  cd stock-time-machine
  ```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Start development server
npm run dev
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add tests for new features
- Update documentation if needed

### 5. Test Your Changes
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm test

# Run E2E tests
npm run cypress:open
```

### 6. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
# or
git commit -m "fix: resolve bug description"
```

### 7. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Use strict type checking

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper prop types and interfaces

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Ensure responsive design

### Testing
- Write unit tests for utilities and hooks
- Add component tests for UI components
- Include E2E tests for critical user flows

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS information

## 💡 Feature Requests

For feature requests, please:
- Check existing issues first
- Provide clear use cases
- Explain the expected behavior
- Consider implementation complexity

## 🏷️ Commit Message Format

We use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
```
feat: add dark mode toggle
fix: resolve chart rendering issue
docs: update API documentation
```

## 🧪 Testing Guidelines

### Unit Tests
- Test utilities and business logic
- Mock external dependencies
- Aim for high coverage

### Component Tests
- Test component behavior
- Test user interactions
- Test accessibility

### E2E Tests
- Test critical user flows
- Test cross-browser compatibility
- Test responsive design

## 📚 Documentation

- Update README.md for major changes
- Add JSDoc comments for complex functions
- Update API documentation
- Include usage examples

## 🔍 Code Review Process

1. All PRs require review
2. Address review comments promptly
3. Keep PRs focused and small
4. Update tests and documentation
5. Ensure CI passes

## 🎯 Areas for Contribution

### High Priority
- Additional free stock APIs
- Enhanced chart features
- Mobile app development
- Performance optimizations

### Medium Priority
- Additional chart types
- More news sources
- Advanced trading features
- Internationalization

### Low Priority
- UI/UX improvements
- Documentation updates
- Test coverage improvements
- Code refactoring

## 📞 Getting Help

- Check existing issues and discussions
- Join our Discord community
- Contact maintainers directly
- Read the documentation

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to the maintainer team (for significant contributions)

Thank you for contributing to Stock Time Machine! 🌟
