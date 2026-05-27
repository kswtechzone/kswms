# 🌐 KSWMS / KSWMS SaaS Platform

Welcome to the central repository for **KSWMS** (branded as **KSWMS**), an enterprise-grade, high-performance, multi-tenant SaaS application engineered to streamline end-to-end hospitality operations. 

From single boutique hotels to global hospitality groups managing multiple brands, this monorepo provides a unified framework to manage properties (hotels, rooms, bookings), POS systems (restaurant tables, menus, orders), scheduling engines (salons, parlors, service portfolios), stock tracking (inventories, transactions), personnel (staff payroll, attendance tracking), finances (aggregate incomes, expense ledgers), and custom brand websites (CMS builders).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18.0.0 or higher)
- **PostgreSQL** instance running locally or hosted on a cloud database service (e.g., Railway, Neon)

### 2. Environment Configuration
Create a `.env` file inside the [`/backend`](file:///Users/sanjay/Business/kswms/backend) directory to configure database credentials and cryptographic tokens:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kswms?sslmode=disable"
JWT_SECRET="ksw_hospitality_jwt_secret_token_key"
```

### 3. Installation
From the monorepo root directory, execute the recursive package installer. This installs top-level packages and automatically triggers recursive installation in the `/frontend` and `/backend` directories:
```bash
npm run install-all
```

### 4. Database Setup & Seeding
Sync your PostgreSQL database schema and load initial administrative data using the following helper scripts:
```bash
# Generate the Prisma Client
npm run prisma:generate --prefix backend

# Push the schema changes directly to the PostgreSQL database
npm run prisma:push --prefix backend

# Seed initial system configuration, default organization, brands, hotels, and super-admin credentials
npm run prisma:seed --prefix backend
```

#### Seeded Super Admin Credentials:
- **Identifier**: `admin@kswtechzone.com.np`
- **Credential**: `Admin@123`
- **Role Scoping**: `SUPER_ADMIN`

### 5. Running the Dev Servers
To launch both the Next.js frontend presentation client (`localhost:3000`) and the NestJS API server (`localhost:4000`) concurrently in watch/hot-reload mode:
```bash
npm run dev
```

---

## 🏗️ System & Monorepo Architecture

KSWMS utilizes a monorepo workspace dividing the presentation client and server logic.

```mermaid
graph TD
    %% Monorepo Root
    subgraph Client [Frontend App - Next.js 16 App Router]
        Dashboard[Dynamic Feature Dashboard]
        CMSBuilder[Interactive CMS Web Builder]
        AdminConsole[Super Admin Management Console]
    end

    subgraph ServiceGateway [Gateway & Route Guards - NestJS]
        TRM[TenantResolverMiddleware]
        JwtG[JwtAuthGuard]
        TenantG[TenantGuard]
    end

    subgraph CoreEngine [SaaS Micro-Modules]
        hotel_mod[Hotel Operations & HMS]
        pos_mod[Restaurant POS & Ordering]
        parlor_mod[Parlor Spa scheduling]
        fin_mod[Finance Ledger & Invoices]
        hr_mod[HR Payroll & Attendance]
        inv_mod[Stock Inventory Tracker]
        web_mod[Website Settings & CMS Pages]
    end

    subgraph Data [Persistence Layer - Prisma ORM]
        Extension[Soft-Delete Extension Rules]
        DB[(PostgreSQL Database)]
    end

    Client -->|REST API Requests| TRM
    TRM --> JwtG
    JwtG --> TenantG
    TenantG --> CoreEngine
    CoreEngine --> Extension
    Extension --> DB
```

### Monorepo Workspaces:
- **[`/frontend`](file:///Users/sanjay/Business/kswms/frontend)**: Next.js 16 React 19 single-page workspace with dynamic CSS styling.
- **[`/backend`](file:///Users/sanjay/Business/kswms/backend)**: NestJS 11 TypeScript API server configured with custom route guards and database middlewares.
- **[`/backend/prisma`](file:///Users/sanjay/Business/kswms/backend/prisma)**: Prisma ORM database models, relations, seed scripts, and migration files.

---

## 🛠️ Technology Stack & Versions

### Frontend Frameworks & Libraries
- **Framework Core**: [Next.js 16.2.6 (App Router)](https://nextjs.org/)
- **Component Engine**: [React 19.0.0](https://react.dev/)
- **Typing Engine**: TypeScript 5.7.3
- **Icon Assets**: Lucide React
- **Styling Token System**: Vanilla CSS Variables and Glassmorphic Utilities (`.glass` & `.card` tokens) supporting instant color-palette themes.

### Backend Frameworks & Libraries
- **Framework Core**: [NestJS 11.0.1](https://nestjs.com/)
- **ORM Interface**: [Prisma ORM 7.8.0](https://www.prisma.io/)
- **DB Driver Integration**: `@prisma/adapter-pg` & `pg` connection pools
- **Security & Tokens**: `passport` & `passport-jwt` authentication strategies
- **Password Hashes**: `bcryptjs`
- **Concurrency Utility**: `concurrently` (handles concurrent workspace servers execution)

---

## 🧩 Advanced Architectural Design Patterns

### 1. Host-Header Tenant Resolution (`Multi-Tenancy`)
The platform separates tenant resources at the database query level without requiring complex multi-database schemas.
- **Subdomain & Virtual Host Mapping**: The [TenantResolverMiddleware](file:///Users/sanjay/Business/kswms/backend/src/middleware/tenant-resolver.middleware.ts) scans incoming HTTP request `Host` headers. If a request is routed via a customer's custom URL (e.g. `regencyhotel.com`) or dynamic platform subdomains (e.g. `regency.kswtechzone.com.np`), the middleware resolves the unique `Organization` ID and links it to the express request object as `req.resolvedTenantId`.
- **Administrative Boundary Guard**: The custom [TenantGuard](file:///Users/sanjay/Business/kswms/backend/src/modules/auth/tenant.guard.ts) checks permissions contextually. Platform `SUPER_ADMIN` logs are unlocked, allowing them to contextually switch domains by passing the `x-tenant-id` header. Regular `ADMIN` or `USER` roles are strictly bound to their parent `user.orgId`, and any attempts to override headers are rejected.

### 2. Subscription Feature-Flagging (`Modular Engine`)
KSWMS is dynamic; organizations only view and execute features they have paid for. Feature modules are defined by keys stored within the `enabledModules` array field of the `Organization` table.

- **Backend Route Shielding**: Endpoints utilize a `checkModule` function to cross-reference request organization logs against active modules, throwing a `403 Forbidden` if disabled functions are requested.
- **Frontend Context adaptation**: The Next.js dashboard tile list and sidebar items are computed dynamically based on the active organization's subscription modules list, disabling or locking cards using premium overlay layouts.

### 3. Database Soft-Delete Hook Extension
To prevent devastating accidents, tables are equipped with a `deletedAt` field, and physical SQL records are preserved.
- **Automatic Interception**: The custom [PrismaService](file:///Users/sanjay/Business/kswms/backend/src/modules/prisma/prisma.service.ts) extends the Prisma client, intercepting all model reads (`findMany`, `findFirst`, etc.) to automatically inject a `deletedAt: null` filter, rendering soft-delete behavior completely transparent to developer APIs.

### 4. Consolidated Cross-Module Billing & Guest Folio
The application seamlessly links distinct operational units together.
- **Unified Charge Entries**: When a room guest orders food at a restaurant or books a massage at a salon parlor, front-office staff can specify their Room stay Booking ID.
- **Folio Compilation**: The [FinanceService](file:///Users/sanjay/Business/kswms/backend/src/modules/finance/finance.service.ts) aggregates room rates, linked meal order invoices, and salon appointments together, creating a unified comprehensive billing folio for collection during checkout.

---

## 🗄️ Database Entity & Schema Map

The PostgreSQL schema is managed via the main [schema.prisma](file:///Users/sanjay/Business/kswms/backend/prisma/schema.prisma) file. Below is an overview of the key models and relations:

```mermaid
erDiagram
    ORGANIZATION ||--o{ BRAND : owns
    ORGANIZATION ||--o{ USER : contains
    ORGANIZATION ||--o{ HOTEL : manages
    ORGANIZATION ||--o{ BOOKING : schedules
    ORGANIZATION ||--o{ WEBSITE : builds
    ORGANIZATION ||--o{ SERVICE_BOOKING : tracks
    
    BRAND ||--o{ HOTEL : operates
    BRAND ||--o{ WEBSITE : hosts
    
    HOTEL ||--o{ ROOM : contains
    HOTEL ||--o{ RESTAURANT : operates
    
    ROOM ||--o{ BOOKING : hosts
    
    BOOKING ||--o{ ORDER : links
    BOOKING ||--o{ SERVICE_BOOKING : associates
    BOOKING ||--o{ INVOICE : logs
```

### Detailed Schema Entities:
1. **`Organization`**: Represents the root tenant (a hotel corporation). Stores name, unique `slug`, and `enabledModules` array.
2. **`Brand`**: Sub-branding layer under an organization. Contains unique domain setup and JSON `themeColors` (primary, accents, header styles).
3. **`User`**: Admin and employee user records. Stores authentication hashes and user roles (`SUPER_ADMIN`, `ADMIN`, `USER`).
4. **`Hotel`**: Physical hospitality property under a specific Brand and Organization.
5. **`Room`**: Rooms connected to Hotels. Tracks daily and flexible hourly rates (`rate3h`, `rate6h`, `rate9h`, `rate12h`) for the "Hourly Place" booking engine.
6. **`Booking`**: Room stay reservations tracking check-in/out, guests, notes, total stays price, and status (`PENDING`, `CONFIRMED`, `CHECKED_IN`, `COMPLETED`, `CANCELLED`).
7. **`Website`**: CMS site builder profile for public web deployments. Links brands to pages and custom theme configurations.
8. **`CMSPage` & `CMSSection`**: Visual sections (`HERO`, `ROOMS`, `TESTIMONIALS`, etc.) and sub-pages under a dynamic Website domain.
9. **`Restaurant` & `Table` & `Menu` & `MenuItem`**: POS Restaurant configuration tracking active dine-in tables, item categories, pricing, and availability.
10. **`Order` & `OrderItem`**: Standalone or room-stay linked POS restaurant orders.
11. **`InventoryItem` & `InventoryTransaction`**: Storage tracking SKU stock counts, item units, and transactions (`IN`, `OUT`, `WASTE`).
12. **`Staff` & `Attendance`**: HR log tracking staff payroll salary, designations, joining dates, and clock-in/clock-out timestamps.
13. **`Invoice` & `Expense`**: Aggregate finance log tracking incoming revenue ledger records (linked to bookings, orders, parlor services) and outgoing expenses.
14. **`ParlorCategory` & `ParlorService`**: Salon and spa service catalogs detailing standard durations (minutes) and active prices.
15. **`ServiceBooking` & `BookingServiceItem`**: Parlor service appointment logs tracking client, scheduled time, and linked services.

---

## 📁 Repository Folder Map

```
├── backend/                             # --- NESTJS API WORKSPACE ---
│   ├── prisma/
│   │   ├── schema.prisma                # Core Prisma Models & DB Schema
│   │   └── seed.ts                      # Multi-tenant DB Seeding script
│   ├── src/
│   │   ├── app.module.ts                # NestJS Root module configurations
│   │   ├── main.ts                      # NestJS bootstrapping entrypoint
│   │   ├── middleware/
│   │   │   └── tenant-resolver.middleware.ts # Dynamic Subdomain & Custom URL resolver
│   │   └── modules/
│   │       ├── auth/                    # Passport strategies, JWT tokens & TenantGuard
│   │       ├── hotel/                   # HMS room bookings and hourly rate systems
│   │       ├── parlor/                  # Salon categories, stylists & appointments
│   │       ├── restaurant/              # Menu catalogs, active POS tables and orders
│   │       ├── finance/                 # Unified invoice generations & expenses
│   │       ├── hr/                      # Staff logs & Clock-in attendance tracking
│   │       ├── inventory/               # Stock levels and transactions tracker
│   │       ├── prisma/                  # Prisma PgAdapter SSL connection wrapper
│   │       ├── public/                  # Public unauthenticated web widgets controller
│   │       ├── identity/                # KSW central SaaS federated login & auth platform
│   │       └── scheduling/              # central dynamic Multi-Tenant Scheduling engine
│   └── scratch/                         # Developer sandbox scripts
│
├── frontend/                            # --- NEXT.JS presentation WORKSPACE ---
│   ├── src/
│   │   └── app/
│   │       ├── globals.css              # Core design tokens, CSS variables & utilities
│   │       ├── layout.tsx               # Workspace base shell wrapper
│   │       ├── login/ & register/       # Auth portal flows
│   │       ├── admin/                   # Super-Admin Tenant & Modules configurations
│   │       └── dashboard/               # Core business features
│   │           ├── hotel-management/    # HMS Room scheduler interface
│   │           ├── pos/ & restaurant/   # Real-time Table ordering POS screen
│   │           ├── parlor/              # Spa services scheduler board
│   │           ├── website/             # Interactive CMS Page builder
│   │           ├── finance/             # Aggregate balance sheet invoices and expenses
│   │           └── hr/                  # Attendance rosters dashboard
│   └── package.json                     # Frontend dependencies
│
├── PROJECT_ARCHITECTURE.md              # Detailed visual architecture blueprint
├── PUBLIC_API_DOCS.md                   # Public APIs contracts integration guides
├── package.json                         # Root workspaces package
└── README.md                            # Comprehensive Developer Onboarding Guide
```

---

## 🎨 Visual Design Tokens & Styling System

KSWMS uses custom design variables in [globals.css](file:///Users/sanjay/Business/kswms/frontend/src/app/globals.css) configured for responsive light/dark themes.

```css
/* Color Styling Variables */
--primary: #A67653;        /* Warm luxury brown tone */
--primary-hover: #8B5E3C;  /* Deep hover brown */
--accent: #D4AF37;         /* Elegant gold accent */

/* Light Mode Defaults */
--bg-main: #F8FAFC;
--bg-card: #FFFFFF;
--text-main: #1E293B;
--border: #E2E8F0;
--glass-bg: rgba(255, 255, 255, 0.7);

/* Dark Mode Override */
[data-theme='dark'] {
  --bg-main: #0F172A;
  --bg-card: #1E293B;
  --text-main: #F8FAFC;
  --border: #334155;
  --glass-bg: rgba(15, 23, 42, 0.7);
}
```

### Core Utility Tokens:
*   **`.glass`**: Combines dynamic background overlays (`var(--glass-bg)`) with backdrop blur styling (`backdrop-filter: blur(12px)`) to provide premium glassmorphism layouts.
*   **`.card`**: Provides premium layout borders and light/dark theme reactive shadow elevations.
*   **`.btn-primary`**: High-fidelity CTA buttons utilizing dynamic brand coloring with subtle transformations on hover.

---

## 🔄 Centralized SaaS Infrastructure Modules

### 1. Central KSW Federated Identity Platform (`/modules/identity`)
Responsible for cross-platform credential resolution and centralized SaaS account control under **kswtechzone.com**:
*   `POST /identity/auth/register` — Registers unique, globally non-duplicated platform users.
*   `POST /identity/auth/login` — SSO gateway, resolves organization scopes.
*   `POST /identity/auth/refresh` — Standardized OAuth2/SSO-style refresh tokens.
*   `GET /identity/auth/me` — Authenticated session retrieval.
*   `POST /identity/customers/link` — Non-duplicated dynamic global customer deduping engine.

### 2. Central Centralized Scheduling & Booking Engine (`/modules/scheduling`)
Decoupled dynamic scheduling coordinator used across multiple business domains (Hotel stays, Salon appointments, Restaurant tables):
*   **Dynamic Time-Slot Calculations**: Availability is computed on-the-fly inside requested timezone boundaries (`AvailabilityService`).
*   **Database Mutex Row Locking**: Implements raw database `SELECT FOR UPDATE` transactions to completely eliminate overlapping race allocations under high concurrent request traffic.
*   **Decoupled Domain Extensions**: Bridges generic bookings to modular domain tables (`HotelBookingDetails`, `SalonBookingDetails`, `RestaurantReservationDetails`) via events-driven publishers.

