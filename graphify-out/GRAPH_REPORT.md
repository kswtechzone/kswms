# Graph Report - kswms  (2026-05-27)

## Corpus Check
- 173 files · ~77,864 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 980 nodes · 1287 edges · 105 communities (75 shown, 30 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `03709c49`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]

## God Nodes (most connected - your core abstractions)
1. `PrismaService` - 24 edges
2. `compilerOptions` - 22 edges
3. `compilerOptions` - 18 edges
4. `PrismaModule` - 18 edges
5. `WebsiteService` - 17 edges
6. `WebsiteController` - 16 edges
7. `RestaurantService` - 14 edges
8. `PublicModuleController` - 14 edges
9. `TenantGuard` - 13 edges
10. `useToast()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `OrgSettingsPage()` --calls--> `useToast()`  [EXTRACTED]
  frontend/src/app/dashboard/settings/page.tsx → frontend/src/components/Toast.tsx
- `ParlorOverview()` --calls--> `useToast()`  [EXTRACTED]
  frontend/src/app/dashboard/parlor/page.tsx → frontend/src/components/Toast.tsx
- `HMSOverview()` --calls--> `useToast()`  [EXTRACTED]
  frontend/src/app/dashboard/hotel-management/page.tsx → frontend/src/components/Toast.tsx
- `UnifiedInventoryPage()` --calls--> `useToast()`  [EXTRACTED]
  frontend/src/app/dashboard/inventory/page.tsx → frontend/src/components/Toast.tsx
- `ManageMenuModal()` --calls--> `useToast()`  [EXTRACTED]
  frontend/src/components/FnbModals.tsx → frontend/src/components/Toast.tsx

## Communities (105 total, 30 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (12): 2. Hotel Property Operations (HMS), A. Retrieve Available Rooms, B. Query Room Availability Statistics, C. Request Direct Room Stay Reservation, code:json ({), code:javascript (fetch('http://localhost:4000/api/v1/public/techzone/website'), code:json ([), Example Request: (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (45): dependencies, bcryptjs, compression, dotenv, @nestjs/common, @nestjs/core, @nestjs/jwt, @nestjs/passport (+37 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (34): 1. Central KSW Federated Identity Platform (`/modules/identity`), 1. Host-Header Tenant Resolution (`Multi-Tenancy`), 1. Prerequisites, 2. Central Centralized Scheduling & Booking Engine (`/modules/scheduling`), 2. Environment Configuration, 2. Subscription Feature-Flagging (`Modular Engine`), 3. Database Soft-Delete Hook Extension, 3. Installation (+26 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (4): AuthController, AuthModule, AuthService, JwtStrategy

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (5): CreateCouponDto, ValidateCouponDto, PromotionController, PromotionModule, PromotionService

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (6): apiFetch(), deleteRequest(), getRequest(), patchRequest(), postRequest(), putRequest()

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (24): 1. High-Level Architecture Blueprint, 2.1 Multi-Tenant Spacing & Scope Resolution, 2.2 Modular Activation Engine (Feature Flagging), 2.3 Prisma Soft-Delete Query Engine, 2.4 Consolidated Cross-Module Billing & Guest Folio System, 2. Core Architectural Design Patterns, 3.1 Frontend Tier (`/frontend`), 3.2 Backend Tier (`/backend`) (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (24): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (3): IdentityController, IdentityModule, IdentityService

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (8): jsonLd, metadata, viewport, Toast, ToastContext, ToastContextType, ToastProvider(), ToastType

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (24): dependencies, framer-motion, lucide-react, next, react, react-dom, @tailwindcss/postcss, devDependencies (+16 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (8): FinanceModule, HrModule, OrganizationModule, ParlorModule, PrismaModule, RestaurantModule, AppModule, WebsiteModule

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (5): FeaturesSectionProps, HeroSectionProps, RoomsSectionProps, ServicesSectionProps, TestimonialsSectionProps

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (6): ADMIN_MENU, DashboardShellProps, MenuItem, ORG_MENU, GuestProfile, NotificationItem

### Community 17 - "Community 17"
Cohesion: 0.16
Nodes (3): UserController, UserModule, UserService

### Community 20 - "Community 20"
Cohesion: 0.13
Nodes (14): 1. Initial Server Setup & Dependencies, 2. Deploying the Application, 3. Starting the Applications with PM2, 4. Configuring Nginx (Reverse Proxy), 5. Setting up SSL, code:bash (# Update packages), code:bash (cd /apps/kswms/backend), code:bash (cd /apps/kswms/frontend) (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (10): FinanceWidget, HotelWidget, HrWidget, InventoryWidget, LiveWebsitePreviewShowcase, LoyaltyItem, ParlorWidget, PosWidget (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.06
Nodes (7): JwtAuthGuard, TenantGuard, CmsController, FinanceController, HrController, InventoryController, RestaurantController

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (4): CmsModule, CrmModule, PrismaService, SeedService

### Community 25 - "Community 25"
Cohesion: 0.15
Nodes (14): 4. Parlor, Salon & Spa Scheduling, A. Fetch Salon Service Catalog, B. Schedule Multi-Service Salon Appointment, code:json ({), code:json ([), code:json ({), code:json ({), code:json ({) (+6 more)

### Community 27 - "Community 27"
Cohesion: 0.18
Nodes (10): devDependencies, concurrently, name, private, scripts, build, dev, install-all (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.24
Nodes (11): 1. General Organization Settings & Themes, 1. General Organization & Website Settings, A. Fetch Branding & Active Modules, 📂 API Reference Index, B. Retrieve Website & CMS Page Configuration, code:javascript (fetch('http://localhost:4000/api/v1/public/techzone')), code:json ({), code:json ({) (+3 more)

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (9): 3. Restaurant POS & Dining Operations, A. Retrieve Full Category Menu Cards, B. Request Dining Table Reservation, code:json ([), code:json ({), Successful Response (`200 OK`):, Successful Response (`200 OK`):, Successful Response (`200 OK`): (+1 more)

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (7): fs, ignoreDirs, path, replaceContent(), rootDir, targetExtensions, traverseAndReplace()

### Community 37 - "Community 37"
Cohesion: 0.25
Nodes (6): Base URL, code:block1 (http://localhost:4000/api/v1/public/:slug), 🛡️ Error Response Mapping, 🛠️ Global Integration Architecture, 🌐 Public Integration API Documentation - KSWMS, Security & Authentication

### Community 40 - "Community 40"
Cohesion: 0.24
Nodes (6): ManageMenuModal(), POSModal(), useToast(), HMSOverview(), UnifiedInventoryPage(), ParlorOverview()

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (5): fs, ignoredDirs, path, replacements, rootDir

### Community 42 - "Community 42"
Cohesion: 0.40
Nodes (5): code:json ({), code:json ({), Error Response (`404 Not Found`):, Request Payload Schema:, Successful Response (`200 OK`):

### Community 43 - "Community 43"
Cohesion: 0.22
Nodes (4): HotelModule, CacheEntry, CacheService, PublicModule

### Community 44 - "Community 44"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 45 - "Community 45"
Cohesion: 0.25
Nodes (6): adapter, { Pool }, prisma, bcrypt, { PrismaClient }, { PrismaPg }

### Community 46 - "Community 46"
Cohesion: 0.29
Nodes (5): adapter, pool, prisma, adapter, pool

### Community 47 - "Community 47"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 48 - "Community 48"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 49 - "Community 49"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 50 - "Community 50"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 52 - "Community 52"
Cohesion: 0.40
Nodes (3): adapter, pool, prisma

### Community 54 - "Community 54"
Cohesion: 0.40
Nodes (5): code:json ({), code:json ({), Error Response (`404 Not Found` - Room Unavailable/Occupied):, Successful Response (`200 OK`):, Successful Response (`200 OK`):

### Community 59 - "Community 59"
Cohesion: 0.15
Nodes (8): FormData, ButtonProps, Size, sizeStyles, Variant, variantStyles, Input, InputProps

### Community 60 - "Community 60"
Cohesion: 0.21
Nodes (3): NotificationModule, NotificationService, RealTimeNotificationEvent

### Community 86 - "Community 86"
Cohesion: 0.20
Nodes (4): FEATURES, WHY_CHOOSE_US, cardVariants, SectionHeadingProps

### Community 87 - "Community 87"
Cohesion: 0.18
Nodes (7): FAQ_ITEMS, Feature, INDUSTRIES, PricingFeature, PricingPlan, TESTIMONIALS, companyLogos

### Community 89 - "Community 89"
Cohesion: 0.22
Nodes (3): posts, PRICING_PLANS, BadgeProps

### Community 92 - "Community 92"
Cohesion: 0.29
Nodes (3): docSections, FOOTER_LINKS, SOCIAL_LINKS

### Community 93 - "Community 93"
Cohesion: 0.29
Nodes (3): containerVariants, itemVariants, StatsCounterProps

### Community 96 - "Community 96"
Cohesion: 0.50
Nodes (3): SchedulingModule, SchedulingEventsService, TimeSlot

### Community 97 - "Community 97"
Cohesion: 0.40
Nodes (3): activityLog, teamMembers, widgets

### Community 98 - "Community 98"
Cohesion: 0.67
Nodes (3): code:json ({), Successful Response (`200 OK`):, Successful Response (`200 OK`):

### Community 100 - "Community 100"
Cohesion: 0.50
Nodes (3): COUNTRIES, CURRENCIES, OrgSettingsPage()

## Knowledge Gaps
- **276 isolated node(s):** `name`, `version`, `private`, `workspaces`, `dev` (+271 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PrismaModule` connect `Community 14` to `Community 96`, `Community 3`, `Community 4`, `Community 35`, `Community 8`, `Community 43`, `Community 23`, `Community 60`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `PrismaService` connect `Community 23` to `Community 96`, `Community 34`, `Community 99`, `Community 4`, `Community 3`, `Community 35`, `Community 8`, `Community 43`, `Community 14`, `Community 17`, `Community 60`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `WebsiteService` connect `Community 18` to `Community 14`, `Community 22`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _276 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1437908496732026 - nodes in this community are weakly interconnected._