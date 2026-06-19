# Contributing to Atlas

First off, thank you for considering contributing to Atlas! It's people like you who make Atlas a great Markdown workspace.

Here is a set of guidelines to help you contribute effectively.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please check the existing issues to see if it has already been reported. If not, open a new issue with:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Your environment details (browser, OS version).
- Expected vs. actual behavior.

### Suggesting Enhancements
We are always open to new ideas! To suggest an enhancement:
- Open an issue describing the feature you'd like to see.
- Explain why this feature would be useful to most users.
- Provide mockups or design ideas if applicable.

### Pull Requests
Ready to contribute code? Follow these steps:
1. **Fork** the repository and clone it to your local machine.
2. Create a new branch for your work: `git checkout -b feature/your-feature-name` or `bugfix/your-bug-name`.
3. Make your changes (ensure they adhere to the coding guidelines below).
4. Run validation scripts (formatting, linting, typechecking).
5. Commit your changes with descriptive commit messages.
6. Push to your fork and submit a Pull Request to the `main` branch.

---

## Development Setup

Atlas is built using **Next.js**, **shadcn/ui**, and **Tailwind CSS**. It uses `pnpm` for package management.

### Prerequisites
- Node.js (v18.x or later)
- pnpm (v8.x or later)

### Local Setup
1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/atlas.git
   cd atlas
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app running.

---

## Coding Standards & Quality Checks

Before submitting a pull request, please make sure your changes pass all local quality checks.

### 1. Code Formatting
We use Prettier for code formatting. Run formatting on all source files before committing:
```bash
pnpm format
```

### 2. Linting
We use ESLint to catch common errors and style guide issues:
```bash
pnpm lint
```

### 3. Type Checking
Atlas is a TypeScript project. Ensure there are no TypeScript compiler errors:
```bash
pnpm typecheck
```

### 4. Build Verification
Make sure the application builds successfully for production:
```bash
pnpm build
```

---

## Pull Request Guidelines

- Keep pull requests focused on a single change or fix.
- Update the documentation (like the README) if your changes introduce new features or settings.
- Ensure all CI status checks are passing.
- Be receptive to feedback and code review requests.

Thank you for your contribution!
