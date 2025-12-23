# Bulk Email Campaign System - Phase 1

## ✅ Phase 1 Completed - Foundation (Core System)

Sistem dasar untuk mengelola email dan template telah selesai dibangun.

### Fitur yang Sudah Selesai

#### 1. **Recipient Management** ✓

- ✅ Tambah email manual (CRUD)
- ✅ Edit / hapus recipient
- ✅ Validasi format email
- ✅ Flag `is_subscribed`
- ✅ Search/filter recipients

#### 2. **Import Recipient** ✓

- ✅ Import dari CSV
- ✅ Skip duplikat otomatis
- ✅ Auto validasi email
- ✅ Error handling untuk invalid data

#### 3. **Email Template Management** ✓

- ✅ Create template (nama, subject, HTML body)
- ✅ Edit template
- ✅ Preview template (render HTML)
- ✅ Test send ke email sendiri
- ✅ Search/filter templates

### Teknologi yang Digunakan

**Backend:**

- Laravel 12
- PHP 8.2
- MySQL Database
- Laravel Mail

**Frontend:**

- React 19 + TypeScript
- Inertia.js v2.0
- ShadCN UI (New York style)
- Tailwind CSS 4.x
- Vite 7.x

### Struktur Database

```sql
-- Recipients table
CREATE TABLE recipients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NULL,
    is_subscribed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Email Templates table
CREATE TABLE email_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_body TEXT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Setup & Installation

1. **Install Dependencies:**

```bash
composer install
npm install
```

2. **Setup Environment:**

```bash
cp .env.example .env
php artisan key:generate
```

3. **Configure Database** di `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bulk_email
DB_USERNAME=root
DB_PASSWORD=
```

4. **Configure Mail** di `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

5. **Run Migrations:**

```bash
php artisan migrate
```

6. **Build Frontend:**

```bash
npm run build
# or for development
npm run dev
```

7. **Start Server:**

```bash
php artisan serve
# or
composer dev
```

### Routes Available

- `GET /recipients` - Recipient list page
- `POST /recipients` - Create new recipient
- `PUT /recipients/{id}` - Update recipient
- `DELETE /recipients/{id}` - Delete recipient
- `POST /recipients/import` - Import CSV

- `GET /email-templates` - Template list page
- `POST /email-templates` - Create new template
- `PUT /email-templates/{id}` - Update template
- `DELETE /email-templates/{id}` - Delete template
- `POST /email-templates/{id}/send-test` - Send test email

### Testing Features

#### Import CSV Format:

```csv
email,name
john@example.com,John Doe
jane@example.com,Jane Smith
```

#### Test Send Email:

1. Go to Email Templates page
2. Click "Test Send" on any template
3. Enter your email
4. Check your inbox

### File Structure

```
app/
├── Http/Controllers/
│   ├── RecipientController.php
│   ├── RecipientImportController.php
│   └── EmailTemplateController.php
├── Models/
│   ├── Recipient.php
│   └── EmailTemplate.php

resources/js/
├── pages/
│   ├── recipients/
│   │   └── index.tsx
│   └── email-templates/
│       └── index.tsx
├── layouts/
│   └── app-layout.tsx
└── types/
    └── index.d.ts

database/migrations/
├── 2025_12_18_110217_create_recipients_table.php
└── 2025_12_18_110226_create_email_templates_table.php
```

### What's Next? (Phase 2)

Phase 2 akan menambahkan:

- Recipient Groups (segmentasi)
- Campaign Management
- Queue untuk pengiriman email massal
- Basic tracking (open & click)

---

**Status:** ✅ Phase 1 Complete
**Date:** December 18, 2025
