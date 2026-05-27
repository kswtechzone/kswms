# 🌐 Public Integration API Documentation - KSWMS

This reference guide provides developers with the request/response payloads, validation rules, and integration methodologies required to build custom consumer-facing websites (e.g., brand landing sites, boutique booking portals, salon reservation widgets) using the public APIs of the **KSWMS** (branded as **KSWMS**) platform.

---

## 🛠️ Global Integration Architecture

### Base URL
All public endpoints are scoped under a uniform base path mapping. Replace `:slug` with the organization's unique identifying URL slug (e.g., `techzone`, `regency`, `ksw-resort`).
```
http://localhost:4000/api/v1/public/:slug
```

### Security & Authentication
- **No Token Required**: These endpoints do not require authorization headers (`Bearer` JWT tokens) to facilitate seamless, low-latency integration on guest-facing sites.
- **Module Authorization Check**: The system automatically cross-references the organization's subscription modules list on every request. If a module (e.g. `PARLOR`, `RESTAURANT`) is disabled in the organization's backend settings, the API will immediately reject requests with a `403 Forbidden` status code.
- **CORS Handling**: Cross-Origin Resource Sharing (CORS) is enabled by default to allow calls from public web client scripts.

---

## 📂 API Reference Index

### 1. General Organization & Website Settings

#### A. Fetch Branding & Active Modules
Fetch branding details, theme palettes, and active subscription modules.
- **Path**: `GET /`
- **Use Case**: Bootstrapping dynamic client websites, setting custom color-palettes, and deciding which pages/widgets (Rooms, Menus, Salon Bookings) should be visible to guests.

#### Example Request:
```javascript
fetch('http://localhost:4000/api/v1/public/techzone')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Successful Response (`200 OK`):
```json
{
  "name": "TechZone Hospitality Group",
  "slug": "techzone",
  "enabledModules": ["DASHBOARD", "HOTEL_MANAGEMENT", "RESTAURANT", "PARLOR", "WEBSITE"],
  "brands": [
    {
      "name": "TechZone Premium Residences",
      "slug": "techzone-premium",
      "domain": "techzone-premium.com",
      "themeColors": {
        "primary": "#A67653",
        "primaryHover": "#8B5E3C",
        "accent": "#D4AF37",
        "bgMain": "#0F172A"
      }
    }
  ]
}
```

#### Error Response (`404 Not Found`):
```json
{
  "statusCode": 404,
  "message": "Organization not found",
  "error": "Not Found"
}
```

---

#### B. Retrieve Website & CMS Page Configuration
Fetches the organization's published website settings, brand information, and pages with active CMS sections ordered by their layout hierarchy.
- **Path**: `GET /website`
- **Use Case**: Dynamically rendering guest-facing custom brand sites, populating custom navigation bars, and drawing custom block sections (Hero, Rooms, Testimonials, Gallery, Features) configured by administrators via the CMS web builder.

#### Example Request:
```javascript
fetch('http://localhost:4000/api/v1/public/techzone/website')
  .then(res => res.json())
  .then(data => console.log(data));
```

#### Successful Response (`200 OK`):
```json
{
  "id": "web182d3-0291-4e2b-a0d1-d28ea9018e2c",
  "organizationId": "org-id-uuid-1234-5678",
  "brandId": "brand-id-uuid-9876-5432",
  "title": "Grand Regency Hotel & Resort",
  "description": "Experience luxury like never before.",
  "subdomain": "regency",
  "customDomain": "regencyhotel.com",
  "status": "PUBLISHED",
  "config": {
    "headerStyle": "transparent",
    "showFooterNewsletter": true
  },
  "createdAt": "2026-05-18T10:00:00.000Z",
  "updatedAt": "2026-05-18T10:00:00.000Z",
  "brand": {
    "id": "brand-id-uuid-9876-5432",
    "organizationId": "org-id-uuid-1234-5678",
    "name": "Regency Brands",
    "slug": "regency",
    "domain": "regencyhotel.com",
    "themeColors": {
      "primary": "#A67653",
      "accent": "#D4AF37"
    }
  },
  "pages": [
    {
      "id": "page-home-uuid-001",
      "websiteId": "web182d3-0291-4e2b-a0d1-d28ea9018e2c",
      "title": "Home",
      "slug": "home",
      "isHome": true,
      "seoTitle": "Regency Hotel - Home",
      "seoDescription": "Welcome to Grand Regency Hotel & Resort",
      "createdAt": "2026-05-18T10:00:00.000Z",
      "updatedAt": "2026-05-18T10:00:00.000Z",
      "sections": [
        {
          "id": "section-hero-001",
          "pageId": "page-home-uuid-001",
          "type": "HERO",
          "content": {
            "title": "Discover Unparalleled Luxury",
            "subtitle": "Your home away from home",
            "backgroundImage": "/assets/hero-bg.jpg"
          },
          "order": 1,
          "isActive": true
        },
        {
          "id": "section-rooms-002",
          "pageId": "page-home-uuid-001",
          "type": "ROOMS",
          "content": {
            "title": "Our Luxurious Accommodations",
            "maxRooms": 6
          },
          "order": 2,
          "isActive": true
        }
      ]
    }
  ]
}
```

#### Error Response (`404 Not Found`):
```json
{
  "statusCode": 404,
  "message": "Website not found",
  "error": "Not Found"
}
```

---

### 2. Hotel Property Operations (HMS)

#### A. Retrieve Available Rooms
Fetches active rooms that are currently marked as vacant and ready for guest booking.
- **Path**: `GET /hotel/rooms`
- **Required Module**: `HOTEL_MANAGEMENT`

#### Successful Response (`200 OK`):
```json
[
  {
    "id": "e4a2c5a2-9118-47fb-9fa2-5881a2e88a01",
    "hotelId": "b182d3c9-0291-4e2b-a0d1-d28ea9018e2c",
    "roomNumber": "304",
    "type": "Suite",
    "dailyRate": 185.00,
    "capacity": 4,
    "status": "AVAILABLE",
    "isHourlyAvailable": true,
    "rate3h": 60.00,
    "rate6h": 100.00,
    "rate9h": 140.00,
    "rate12h": 160.00,
    "createdAt": "2026-05-18T10:00:00.000Z",
    "updatedAt": "2026-05-18T10:00:00.000Z",
    "hotel": {
      "id": "b182d3c9-0291-4e2b-a0d1-d28ea9018e2c",
      "name": "Regency Premium Hotel",
      "address": "404 luxury lane, LA"
    }
  }
]
```

---

#### B. Query Room Availability Statistics
Provides simple counts and indicators of vacant rooms.
- **Path**: `GET /hotel/availability`
- **Required Module**: `HOTEL_MANAGEMENT`

#### Successful Response (`200 OK`):
```json
{
  "availableRooms": 8,
  "status": "AVAILABLE"
}
```
*Note: If `availableRooms` equals `0`, status resolves to `"SOLD_OUT"`.*

---

#### C. Request Direct Room Stay Reservation
Submit a reservation form to book a hotel room.
- **Path**: `POST /hotel/book`
- **Required Module**: `HOTEL_MANAGEMENT`
- **Content-Type**: `application/json`

#### Request Payload Schema:
```json
{
  "roomId": "e4a2c5a2-9118-47fb-9fa2-5881a2e88a01",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+15550199283",
  "checkIn": "2026-05-20T14:00:00.000Z",
  "checkOut": "2026-05-25T11:00:00.000Z",
  "totalPrice": 925.00
}
```

#### Successful Response (`201 Created`):
```json
{
  "id": "c19b88a1-2d3e-4fb8-9c2e-4b2a8d9a20b1",
  "organizationId": "a98d88e8-3a1b-411d-8f2c-5b29c8aa711a",
  "roomId": "e4a2c5a2-9118-47fb-9fa2-5881a2e88a01",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+15550199283",
  "startTime": "2026-05-20T14:00:00.000Z",
  "endTime": "2026-05-25T11:00:00.000Z",
  "totalPrice": 925,
  "status": "PENDING",
  "createdAt": "2026-05-18T15:00:00.000Z",
  "updatedAt": "2026-05-18T15:00:00.000Z"
}
```

#### Error Response (`404 Not Found` - Room Unavailable/Occupied):
```json
{
  "statusCode": 404,
  "message": "Room not available",
  "error": "Not Found"
}
```

---

### 3. Restaurant POS & Dining Operations

#### A. Retrieve Full Category Menu Cards
Fetches the active menu catalog items grouped by food categories.
- **Path**: `GET /restaurant/menu`
- **Required Module**: `RESTAURANT`

#### Successful Response (`200 OK`):
```json
[
  {
    "id": "m11c8a1e-2fb8-411a-a0f1-0982739a8bc1",
    "restaurantId": "r9a2c3d8-11a2-4a0b-9fb2-d0e2e9c8e8c1",
    "name": "Main Lunch Menu",
    "isActive": true,
    "categories": [
      {
        "id": "cat1a901-2e3d-49f2-8cb2-20c8192a8bc1",
        "menuId": "m11c8a1e-2fb8-411a-a0f1-0982739a8bc1",
        "name": "Appetizers",
        "order": 1,
        "items": [
          {
            "id": "item9c2e-4b2a-8d9a-20b1-c19b88a12d3e",
            "categoryId": "cat1a901-2e3d-49f2-8cb2-20c8192a8bc1",
            "name": "Crispy Garlic Calamari",
            "description": "Tossed in garlic oil and fresh pepper, served with a lime wedge.",
            "price": 14.50,
            "image": "http://localhost:4000/assets/calamari.jpg",
            "isAvailable": true
          }
        ]
      }
    ]
  }
]
```

---

#### B. Request Dining Table Reservation
Schedule a table dining spot booking.
- **Path**: `POST /restaurant/book`
- **Required Module**: `RESTAURANT`
- **Content-Type**: `application/json`

#### Request Payload Schema:
```json
{
  "restaurantId": "r9a2c3d8-11a2-4a0b-9fb2-d0e2e9c8e8c1",
  "guestName": "Sarah Connor",
  "guestPhone": "+15551239845",
  "guestEmail": "sarah@resistance.org",
  "partySize": 4,
  "reservationTime": "2026-05-21T19:30:00.000Z"
}
```

#### Successful Response (`200 OK`):
```json
{
  "message": "Table reservation received",
  "data": {
    "restaurantId": "r9a2c3d8-11a2-4a0b-9fb2-d0e2e9c8e8c1",
    "guestName": "Sarah Connor",
    "guestPhone": "+15551239845",
    "guestEmail": "sarah@resistance.org",
    "partySize": 4,
    "reservationTime": "2026-05-21T19:30:00.000Z"
  }
}
```

---

### 4. Parlor, Salon & Spa Scheduling

#### A. Fetch Salon Service Catalog
Retrieve salon categories and services.
- **Path**: `GET /parlor/services`
- **Required Module**: `PARLOR`

#### Successful Response (`200 OK`):
```json
[
  {
    "id": "p8e2c9a1-02d1-4e2b-a01b-5881a2e88a01",
    "organizationId": "a98d88e8-3a1b-411d-8f2c-5b29c8aa711a",
    "categoryId": "cat88a91-4fb8-9c2e-4b2a-8d9a20b1c19b",
    "name": "Spa Hydrafacial Treatment",
    "description": "Premium multi-step facial cleansing, extraction, and skin hydration.",
    "price": 120.00,
    "duration": 45,
    "isActive": true,
    "createdAt": "2026-05-18T10:00:00.000Z",
    "updatedAt": "2026-05-18T10:00:00.000Z",
    "category": {
      "id": "cat88a91-4fb8-9c2e-4b2a-8d9a20b1c19b",
      "organizationId": "a98d88e8-3a1b-411d-8f2c-5b29c8aa711a",
      "name": "Skincare"
    }
  }
]
```

---

#### B. Schedule Multi-Service Salon Appointment
Book an appointment with automated cost calculation.
- **Path**: `POST /parlor/book`
- **Required Module**: `PARLOR`
- **Content-Type**: `application/json`

#### Request Payload Schema:
```json
{
  "serviceIds": [
    "p8e2c9a1-02d1-4e2b-a01b-5881a2e88a01",
    "p9b2c3d8-11a2-4a0b-9fb2-d0e2e9c8e8c1"
  ],
  "guestName": "Emma Watson",
  "guestPhone": "+15557788992",
  "guestEmail": "emma@hogwarts.edu",
  "bookingTime": "2026-05-21T15:00:00.000Z",
  "paymentMethod": "PAY_NOW",
  "notes": "Prefers late afternoon slots, allergic to lavender."
}
```
*Note: `paymentMethod` is optional and defaults to `"PAY_ON_VISIT"`. Allowed values are `"PAY_NOW"` and `"PAY_ON_VISIT"`. `notes` is optional and is automatically mapped to the customer's central profile preferences.*

#### Successful Response (`201 Created`):
```json
{
  "id": "b09182d3-11a2-4fb8-8c2e-5881a2e88a01",
  "organizationId": "a98d88e8-3a1b-411d-8f2c-5b29c8aa711a",
  "guestName": "Emma Watson",
  "guestEmail": "emma@hogwarts.edu",
  "guestPhone": "+15557788992",
  "bookingTime": "2026-05-21T15:00:00.000Z",
  "status": "CONFIRMED",
  "paymentMethod": "PAY_NOW",
  "paymentStatus": "PAID",
  "totalPrice": 185.00,
  "createdAt": "2026-05-18T16:00:00.000Z",
  "updatedAt": "2026-05-18T16:00:00.000Z"
}
```
*Note: The API automatically queries the individual price metrics for each `serviceId` inside `serviceIds`, compiles the exact total, and inserts the snapshot values into `totalPrice`. If `paymentMethod` is `"PAY_NOW"`, the `status` defaults to `"CONFIRMED"` and `paymentStatus` to `"PAID"`; otherwise, they default to `"PENDING"` and `"UNPAID"` respectively.*

#### Error Response (`403 Forbidden` - Module Disabled):
```json
{
  "statusCode": 403,
  "message": "PARLOR is not enabled for this organization",
  "error": "Forbidden"
}
```

---

## 🛡️ Error Response Mapping

The public API returns standardized HTTP response codes and JSON error blocks.

| Status Code | Error Label | Underlying Trigger Scenario |
| :--- | :--- | :--- |
| **`400 Bad Request`** | `Bad Request` | Missing required parameters, parsing failures (e.g. invalid Date strings). |
| **`403 Forbidden`** | `Forbidden` | Accessing endpoints for modules that are disabled on this tenant's subscription profile. |
| **`404 Not Found`** | `Not Found` | Invalid organizational `:slug`, non-existent service UUID, or occupied Hotel room. |
| **`500 Internal Error`**| `Internal Server Error`| Database connection failures or unexpected system exceptions. |
