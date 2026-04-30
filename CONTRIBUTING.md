# Contributing to Rison2

Thank you for your interest in contributing to Rison2! This guide will help you set up your development environment and understand the contribution process.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 20.0.0)
- [npm](https://www.npmjs.com/) (>= 10.0.0)

We recommend using [mise](https://mise.jdx.dev/) or [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions.

### Setup

1. Fork and clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/rison2.git
   cd rison2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Scripts

- **Linting**: We use [Biome](https://biomejs.dev/) for linting and formatting.
  ```bash
  npm run lint
  ```
- **Formatting**:
  ```bash
  npm run format
  ```
- **Testing**: We use [Jest](https://jestjs.io/) for tests.
  ```bash
  npm run test
  ```
- **Building**: We use [unbuild](https://github.com/unjs/unbuild) to create the distribution files.
  ```bash
  npm run build
  ```

### Workflow

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and ensure they follow the project's coding style.
3. Add or update tests for your changes.
4. Run linting and tests to ensure everything is working correctly.
5. Commit your changes:
   ```bash
   git commit -m 'feat: add some feature'
   ```
   _Note: We use husky and lint-staged to run checks automatically on commit._

## Pull Request Process

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request on the main repository.
3. Ensure the CI checks (GitHub Actions) pass.
4. Once reviewed and approved, your PR will be merged.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
