# GitHub Copilot Instructions - Laravel React ShadCN Boilerplate

## Tech Stack Overview

### Backend

- **Framework**: Laravel 12.x
- **PHP Version**: ^8.2
- **Authentication**: Laravel Fortify
- **Bridge**: Inertia.js v2.0
- **Routing**: tightenco/ziggy (type-safe routes)
- **Testing**: Pest v4 + PHPUnit

### Frontend

- **Framework**: React 19 with TypeScript
- **Bundler**: Vite 7.x
- **Routing**: Inertia Router + Ziggy
- **UI Components**: ShadCN UI (New York style)
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **Form Management**: React Hook Form + Zod validation
- **Tables**: TanStack Table
- **Notifications**: Sonner (toast notifications)

## Project Structure

### Frontend Architecture (Feature-Based)

```
resources/js/
├── app.tsx                 # Main Inertia app entry
├── ssr.tsx                # SSR entry point
├── components/
│   └── ui/                # ShadCN UI components
├── pages/                 # Feature-based pages (kebab-case)
│   └── [feature]/
│       ├── index.tsx      # Main feature page
│       └── components/    # Feature-specific components
├── lib/
│   └── utils.ts          # Utility functions (cn, etc.)
├── types/                # TypeScript type definitions
└── routes/               # Route definitions
```

### Backend Architecture

```
app/
├── Http/
│   ├── Controllers/      # Controllers (PascalCase)
│   └── Middleware/       # Custom middleware
├── Models/               # Eloquent models
└── Providers/           # Service providers

routes/
├── web.php              # Web routes
└── console.php          # Console routes
```

## Naming Conventions

### Frontend

- **Files**: kebab-case (e.g., `user-profile.tsx`, `data-table.tsx`)
- **Components**: PascalCase (e.g., `UserProfile`, `DataTable`)
- **Functions**: camelCase (e.g., `handleSubmit`, `fetchUserData`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `PageProps`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `MAX_ITEMS`)

### Backend

- **Controllers**: PascalCase + `Controller` suffix (e.g., `UserController`)
- **Models**: PascalCase singular (e.g., `User`, `Post`)
- **Routes**: kebab-case (e.g., `/user-profile`, `/api/data-table`)
- **Methods**: camelCase (e.g., `index`, `store`, `getUserData`)

## Development Guidelines

### 1. Component Development (ShadCN)

```bash
# Add ShadCN components
npx shadcn@latest add [component-name]
```

**Component Structure:**

- Use ShadCN registry for base UI components
- Place in `resources/js/components/ui/`
- Customize using Tailwind CSS 4 classes
- Utilize `cn()` utility for conditional classes

### 2. Page Development (Inertia + React)

```tsx
// Feature-based page example: resources/js/pages/user-profile/index.tsx
import { Head } from '@inertiajs/react';

interface Props {
    user: User;
}

export default function UserProfile({ user }: Props) {
    return (
        <>
            <Head title="User Profile" />
            <div>{/* Page content */}</div>
        </>
    );
}
```

### 3. Routing (Ziggy + Inertia)

```tsx
// Using Ziggy for type-safe routes
import { router } from '@inertiajs/react';
import route from 'ziggy-js';

// Navigate
router.visit(route('user.profile', { id: 1 }));

// Backend route definition (routes/web.php)
Route::get('/user/{id}', [UserController::class, 'show'])->name('user.profile');
```

### 4. Form Handling (React Hook Form + Zod)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        router.post(route('login'), data);
    };

    return <form onSubmit={handleSubmit(onSubmit)}>{/* form fields */}</form>;
}
```

### 5. Tables (TanStack Table)

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

function DataTable({ data, columns }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // Render table using ShadCN Table components
}
```

### 6. Flash Messages (Sonner)

```tsx
// Backend: flash message
return redirect()->back()->with('success', 'Operation completed!');

// Frontend: display with Sonner
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';

function Layout() {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
  }, [flash]);
}
```

### 7. Authentication (Fortify)

```bash
# Install Fortify
composer require laravel/fortify

# Configure in config/fortify.php
# Use Inertia responses for auth views
```

### 8. Styling (Tailwind CSS 4)

```css
/* resources/css/app.css */
@import 'tailwindcss';

/* Custom theme variables */
@theme {
    --color-primary: #3b82f6;
}
```

## Code Quality

### TypeScript

- Enable strict mode
- Define all prop types/interfaces
- Use type inference where appropriate
- Avoid `any` types

### ESLint & Prettier

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run PHP tests
composer test
# or
php artisan test

# Type check TypeScript
npm run types
```

## Development Commands

```bash
# Start development environment (Laravel + Vite + Queue + Logs)
composer dev

# Start with SSR
composer dev:ssr

# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Setup project
composer setup
```

## AI Assistant Guidelines

When assisting with code:

1. **Always use kebab-case** for frontend filenames
2. **Use feature-based folder structure** for pages
3. **Implement proper TypeScript types** for all components and functions
4. **Use ShadCN components** from the registry when building UI
5. **Leverage Ziggy routes** for type-safe navigation
6. **Use React Hook Form + Zod** for all form handling
7. **Implement TanStack Table** for data tables
8. **Use Sonner** for toast notifications
9. **Follow Inertia.js patterns** for data passing and navigation
10. **Apply Tailwind CSS 4** for all styling (no inline styles)
11. **Use Fortify routes** for authentication flows
12. **Maintain consistent code style** with ESLint and Prettier

## Dependencies Reference

**Key Packages:**

- `@inertiajs/react` - Inertia React adapter
- `tightenco/ziggy` - Laravel route helper for JavaScript
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@tanstack/react-table` - Headless table library
- `sonner` - Toast notifications
- `shadcn` - UI component CLI
- `laravel/fortify` - Authentication backend
- `tailwindcss` v4 - Utility-first CSS framework

## Notes

- Project uses **Wayfinder** for enhanced Laravel-Vite integration
- SSR support is built-in but optional
- ShadCN components use **New York style** variant
- CSS variables enabled for theming
- Icon library: Lucide React
