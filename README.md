# Laravel React ShadCN Starter Kit

A modern, production-ready starter kit for building full-stack web applications with Laravel 12, React 19, TypeScript, and ShadCN UI components.

## 🚀 Features

### Backend
- **Laravel 12.x** - Latest PHP framework with modern features
- **Inertia.js v2.0** - Seamless SPA bridge between Laravel and React
- **Ziggy** - Type-safe route helpers for JavaScript
- **Laravel Fortify** - Authentication scaffolding
- **Pest v4** - Elegant testing framework
- **Laravel Wayfinder** - Enhanced Vite integration

### Frontend
- **React 19** - Latest React with TypeScript support
- **Vite 7.x** - Lightning-fast build tool
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **ShadCN UI** - Beautifully designed components (New York style)
- **Lucide React** - Consistent icon library
- **React Hook Form + Zod** - Type-safe form validation
- **TanStack Table** - Powerful table/datagrid library
- **Sonner** - Toast notifications

### Developer Experience
- **TypeScript** - Full type safety across the stack
- **ESLint + Prettier** - Code quality and formatting
- **Feature-based architecture** - Scalable folder structure
- **SSR Support** - Built-in server-side rendering
- **Hot Module Replacement** - Instant feedback during development

## 📋 Requirements

- PHP ^8.2
- Composer
- Node.js 18+ & npm
- Database (MySQL, PostgreSQL, SQLite, etc.)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd boilerplate-laravel-react-shadcn
```

### 2. Quick Setup

```bash
composer setup
```

This command will:
- Install PHP dependencies
- Copy `.env.example` to `.env`
- Generate application key
- Run database migrations
- Install npm dependencies
- Build frontend assets

### 3. Manual Setup (Alternative)

```bash
# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Install npm dependencies
npm install

# Build assets
npm run build
```

## 🏃 Development

### Start Development Server

```bash
composer dev
```

This command starts:
- **Laravel development server** (http://localhost:8000)
- **Vite dev server** with HMR
- **Queue worker**
- **Log viewer** (Pail)

All services run concurrently with color-coded output.

### Start with SSR

```bash
composer dev:ssr
```

### Individual Commands

```bash
# Start Laravel server only
php artisan serve

# Start Vite dev server only
npm run dev

# Run queue worker
php artisan queue:listen

# View logs
php artisan pail
```

## 🏗️ Project Structure

### Frontend (Feature-Based)

```
resources/js/
├── app.tsx                     # Inertia app entry point
├── ssr.tsx                    # SSR entry point
├── components/
│   └── ui/                    # ShadCN UI components
├── pages/                     # Application pages (kebab-case)
│   └── homepage/
│       └── welcome.tsx        # Example page
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
├── types/                    # TypeScript definitions
├── routes/                   # Route configurations
└── wayfinder/               # Wayfinder integration
```

### Backend (Laravel Standard)

```
app/
├── Http/
│   ├── Controllers/          # Application controllers
│   └── Middleware/           # Custom middleware
├── Models/                   # Eloquent models
└── Providers/               # Service providers

routes/
├── web.php                  # Web routes
└── console.php              # Artisan commands
```

## 📝 Usage Examples

### Creating a New Page

```bash
# 1. Create page component (kebab-case filename)
# resources/js/pages/user-profile/index.tsx
```

```tsx
import { Head } from '@inertiajs/react';

interface Props {
  user: {
    name: string;
    email: string;
  };
}

export default function UserProfile({ user }: Props) {
  return (
    <>
      <Head title="User Profile" />
      <div className="p-8">
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </>
  );
}
```

```php
// 2. Add route in routes/web.php
Route::get('/user/{id}', [UserController::class, 'show'])->name('user.profile');
```

```tsx
// 3. Navigate using Ziggy
import { router } from '@inertiajs/react';
import route from 'ziggy-js';

router.visit(route('user.profile', { id: 1 }));
```

### Adding ShadCN Components

```bash
# Add button component
npx shadcn@latest add button

# Add form components
npx shadcn@latest add form input label

# Add table component
npx shadcn@latest add table
```

Components will be installed in `resources/js/components/ui/`

### Form Handling

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from '@inertiajs/react';
import route from 'ziggy-js';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    router.post(route('login'), data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### Flash Messages

```php
// Backend
return redirect()->back()->with('success', 'Profile updated successfully!');
return redirect()->back()->with('error', 'Something went wrong!');
```

```tsx
// Frontend - Add to layout
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

function Layout({ children }) {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  return <div>{children}</div>;
}
```

## 🧪 Testing

```bash
# Run all tests
composer test

# Run specific test file
php artisan test --filter=ExampleTest

# Run with coverage
php artisan test --coverage
```

## 🎨 Code Quality

### Linting & Formatting

```bash
# Lint JavaScript/TypeScript
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check

# Type check
npm run types
```

### Code Conventions

**Frontend:**
- Files: `kebab-case` (e.g., `user-profile.tsx`)
- Components: `PascalCase` (e.g., `UserProfile`)
- Functions: `camelCase` (e.g., `handleSubmit`)
- Types: `PascalCase` (e.g., `User`, `PageProps`)

**Backend:**
- Controllers: `PascalCase` + `Controller` (e.g., `UserController`)
- Models: `PascalCase` singular (e.g., `User`)
- Routes: `kebab-case` (e.g., `/user-profile`)
- Methods: `camelCase` (e.g., `index`, `store`)

## 🏭 Production Build

### Build Assets

```bash
# Standard build
npm run build

# Build with SSR
npm run build:ssr
```

### Deploy

```bash
# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

## 📦 Key Dependencies

### Backend
- `laravel/framework` ^12.0
- `inertiajs/inertia-laravel` ^2.0
- `tightenco/ziggy` ^2.6
- `laravel/fortify` - Authentication
- `laravel/wayfinder` ^0.1.11
- `pestphp/pest` ^4.1

### Frontend
- `react` ^19.0.0
- `@inertiajs/react` ^2.0.0
- `tailwindcss` ^4.0.0
- `vite` ^7.0.4
- `typescript` ^5.7.2
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@tanstack/react-table` - Tables
- `sonner` - Toast notifications
- `lucide-react` - Icons

## 🔧 Configuration

### Tailwind CSS

Tailwind 4 is configured in `resources/css/app.css`:

```css
@import "tailwindcss";

@theme {
  /* Custom theme variables */
}
```

### ShadCN UI

Configuration in `components.json`:
- Style: `new-york`
- Base color: `neutral`
- CSS variables: `enabled`
- Icon library: `lucide`

### TypeScript

TypeScript is configured for:
- Strict mode
- ESNext target
- Bundler module resolution
- Path aliases via Vite

## 📚 Documentation

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [ShadCN UI Components](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Ziggy Documentation](https://github.com/tighten/ziggy)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## 🙏 Credits

Built with:
- [Laravel](https://laravel.com)
- [React](https://react.dev)
- [Inertia.js](https://inertiajs.com)
- [ShadCN UI](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
