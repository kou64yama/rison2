# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-08-11

### Added

- Essential GitHub templates for issues and pull requests (#49)
  - Bug report template with comprehensive sections
  - Feature request template with INVEST criteria
  - Pull request template with type classification and scope guidance
  - Acceptance Criteria tracking with auto-close prevention
- Node.js 20+ LTS support policy with clear documentation (#36)
- GitHub Actions build badge in README (#37)
- FOSSA license compliance scanning (#27)

### Changed

- **BREAKING**: Removed support for Node.js 14 and 16 (#25)
  - Minimum supported Node.js version is now 20.x (Active LTS)
  - Updated to support only Active LTS and Maintenance LTS versions
- Migrated from ESLint to Biome for faster linting and formatting (#42)
  - Significantly improved development performance
  - Simplified configuration with zero-config approach
  - Maintained code quality standards
- Migrated build system from Rollup to unbuild (#43)
  - Modern TypeScript-first build pipeline
  - Better tree-shaking and optimization
  - Simplified build configuration
- Updated package manager to pnpm 10.14.0 (#38, #33, #26)
  - Enhanced dependency management efficiency
  - Improved lockfile handling
- Updated all outdated dependencies to latest secure versions
  - Jest 29 → Jest 30 with latest features and security patches
  - Updated @types/jest, husky, lint-staged to latest major versions
  - Aligned TypeScript configuration with Node.js 20+ support

### Fixed

- Release workflow configuration for proper NPM publishing (#31)
- Added --no-git-checks flag for pnpm publish to resolve CI issues (#28)
- Updated Node.js versions in GitHub Actions build workflow (#35)

### Security

- Security updates for multiple dependencies:
  - minimist: 1.2.5 → 1.2.8 (#24)
  - json5: 1.0.1 → 1.0.2 (#23)
  - tough-cookie: 4.0.0 → 4.1.3 (#22)
- Enhanced security scanning with CodeQL and FOSSA integration
- All dependencies updated to versions with latest security patches

### Development Experience

- Improved development tooling with modern stack
- Enhanced GitHub workflow templates and issue management
- Streamlined build process with better performance
- Comprehensive test coverage maintained (99.44%)
- Updated VS Code settings for better development experience (#34)

### Infrastructure

- Updated GitHub Actions workflows for Node.js 20+ compatibility
- Enhanced CI/CD pipeline with modern tooling
- Improved package publishing workflow reliability
- Added license compliance verification

## [0.2.3] - 2022-03-01

### Changed

- Use Babel (#18)

---

## Release Links

- [0.3.0]: https://github.com/kou64yama/rison2/compare/v0.2.3...v0.3.0
- [0.2.3]: https://github.com/kou64yama/rison2/releases/tag/v0.2.3
