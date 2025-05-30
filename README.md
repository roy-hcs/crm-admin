# CRM Admin Project

This project is a CRM (Customer Relationship Management) admin dashboard built with **React** and **Vite**. It leverages a variety of modern web technologies and tools to provide a robust and efficient development experience.

## Tech Stack

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/) for fast development and optimized builds
- **UI Components**: [Shadcn](https://ui.shadcn.com/) for highly customizable and accessible components
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for simple and scalable application state management
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) for efficient and reliable data handling
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and rapid UI development
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and improved developer experience

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js version >= 18.17.0 installed. You can download it from [Node.js official website](https://nodejs.org/).
- **pnpm**: This project uses [pnpm](https://pnpm.io/) as the package manager. Install it globally if you haven't already:

  ```bash
  npm install -g pnpm
  ```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/crm-admin.git
   cd crm-admin
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

### Running the Project

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Open your browser and navigate to `http://localhost:5173` to see the project in action.

## Code Quality Tools

This project is configured with several tools to maintain code quality:

### Husky Pre-commit Hooks

The project uses [Husky](https://typicode.github.io/husky/) to run checks before each commit:

- TypeScript type checking
- ESLint linting
- Formatting checks

This ensures that all committed code meets the project's quality standards.

### Manual Checks

You can also run these checks manually using the following scripts:

```bash
# TypeScript type checking
pnpm typecheck

# ESLint linting
pnpm lint

# Build the project
pnpm build

# Preview production build
pnpm preview
```
