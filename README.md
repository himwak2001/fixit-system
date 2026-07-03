<div align="center">

<br/>

<img src="https://img.shields.io/badge/FixIt-FF9900?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMi43IDEuNGwtMS4xLTEuMWMtLjQtLjQtMS0uNC0xLjQgMEwxOCAyLjZsLTEuOC0xLjhjLS40LS40LTEtLjQtMS40IDBsLTMgM2MtLjQuNC0uNCAxIDAgMS40bDEuOCAxLjgtOC42IDguNkM0LjQgMTYuMiA0IDE3LjEgNCAxOHYyaDJ2LTBoMnYtMmMwLS45LjMtMS43IDEtMi40bDguNi04LjYgMS44IDEuOGMuNC40IDEgLjQgMS40IDBsMy0zYy40LS40LjQtMSAwLTEuNHoiLz48L3N2Zz4=" alt="FixIt" />

# FixIt - Facility Issue Resolution System

**A full-stack enterprise-grade platform for reporting, tracking, and resolving facility maintenance issues.**

<br/>

[![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![Keycloak](https://img.shields.io/badge/Keycloak-4D4D4D?style=for-the-badge&logo=keycloak&logoColor=white)](https://www.keycloak.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

<br/>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [The Problem It Solves](#-the-problem-it-solves)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [Ticket Lifecycle](#-ticket-lifecycle)
- [API Reference](#-api-reference)
- [Security Design](#-security-design)
- [AWS Integration](#-aws-integration)
- [Design Patterns](#-design-patterns)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Running Tests](#-running-tests)
- [Screenshots](#-screenshots)

---

## 🔍 Overview

FixIt is a **role-based facility issue resolution platform** that digitizes the process of reporting, assigning, and tracking maintenance issues within an organization. Tenants report problems, admins assign them to the right technicians, and technicians resolve them — with full visibility at every step.

Built as a portfolio project targeting the **3–5 YOE level**, it demonstrates production-grade patterns including OAuth2/OIDC authentication, AWS S3 secure file storage, event-driven notifications, state machine lifecycle management, and a fully responsive React frontend.

---

## 🎯 The Problem It Solves

In most organizations, facility issues are reported via WhatsApp, email, or phone calls — with no tracking, no accountability, and no visibility. FixIt replaces this chaos with a structured, auditable, role-based system:

| Without FixIt | With FixIt |
|---|---|
| Issues reported via text/email, no tracking | Every issue has a ticket number, status, and history |
| No way to know if an issue was assigned | Admin assigns tickets to specific technicians |
| Tenants have no update after reporting | Tenants receive email on every status change |
| Photos shared via WhatsApp, lost quickly | Photos stored securely on AWS S3, accessible anytime |
| No data for management decisions | Admin dashboard shows trends by category and priority |

---

## 🏗️ Architecture

```mermaid
graph TD
    %% Custom Styling Definitions
    classDef client fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#0369A1;
    classDef security fill:#FEE2E2,stroke:#DC2626,stroke-width:2px,color:#991B1B;
    classDef application fill:#F3E8FF,stroke:#7E22CE,stroke-width:2px,color:#6B21A8;
    classDef module fill:#FFFFFF,stroke:#A855F7,stroke-width:1px,color:#4A044E;
    classDef common fill:#F0FDF4,stroke:#16A34A,stroke-width:1px,color:#14532D;
    classDef infra fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;

    %% 1. CLIENT LAYER
    subgraph CLIENT_LAYER ["🌐 CLIENT LAYER"]
        C1["<b>Frontend Application Stack</b><br/>React 18 • Redux Toolkit • Chakra UI • Tailwind CSS"]
        C2["Keycloak-js (OIDC) • Axios • React Router v6 • Recharts"]
        C1 --- C2
    end
    class CLIENT_LAYER,C1,C2 client;

    %% Connection Client -> Security
    C2 -->|HTTPS + JWT Bearer Token| S1

    %% 2. SECURITY LAYER
    subgraph SECURITY_LAYER ["🔒 SECURITY LAYER"]
        S1["<b>Keycloak</b><br/>(OAuth2 / OIDC)"] <-->|Federated Trust| S2["<b>Spring Security</b><br/>(Resource Server)"]
        S3["JWT Validation via JWKS • Role-Based Access Control • PKCE Flow"]
        S2 --- S3
    end
    class SECURITY_LAYER,S1,S2,S3 security;

    %% Connection Security -> Application
    S2 --> M_MONOLITH

    %% 3. APPLICATION LAYER
    subgraph APPLICATION_LAYER ["⚙️ APPLICATION LAYER (Spring Boot 3.x)"]
        M_MONOLITH["<b>Modular Monolith Core</b>"]
        
        subgraph MODULES ["Internal Modules"]
            M1["auth module"]
            M2["ticket module"]
            M3["storage module"]
            M4["notification module"]
        end
        
        M_MONOLITH --- MODULES
        
        COM["<b>common:</b> GlobalExceptionHandler • ApiResponse • AuditAspect"]
        MODULES --- COM
    end
    class APPLICATION_LAYER,M_MONOLITH application;
    class MODULES,M1,M2,M3,M4 module;
    class COM common;

    %% Connections Application -> Database / Cloud Infrastructure
    MODULES --> DB
    MODULES --> AWS

    %% 4. PERSISTENCE & CLOUD SERVICES LAYER
    subgraph INFRA_LAYER ["☁️ PERSISTENCE & INFRASTRUCTURE LAYER"]
        DB["<b>PostgreSQL</b><br/>(Amazon RDS)"]
        AWS["<b>AWS Cloud Services</b><br/>S3 • SES • EC2 • IAM • SSM"]
    end
    class INFRA_LAYER,DB,AWS infra;
```

### Why Modular Monolith?

Chosen deliberately over microservices for this scope. Each module (`auth`, `ticket`, `storage`, `notification`) owns its own controller, service, repository, and DTOs — with strict unidirectional dependencies between modules. This means:

- Individual modules can be extracted into separate services with minimal refactoring
- No distributed tracing overhead or inter-service network calls during development
- Cleaner codebase than package-by-layer, more manageable than full microservices

---

## 🛠️ Tech Stack

### Backend

| Category | Technology | Purpose |
|---|---|---|
| Language | Java 21 | Virtual threads, records, sealed classes |
| Framework | Spring Boot 3.x | REST APIs, DI, security, scheduling |
| Security | Spring Security + Keycloak | OAuth2 resource server, JWT validation |
| ORM | Spring Data JPA + Hibernate | Entity mapping, query execution |
| Database | PostgreSQL 15 | Primary relational store |
| Migrations | Liquibase | Versioned, auditable schema changes |
| File Storage | AWS S3 (SDK v2) | Presigned URL upload/download |
| Email | AWS SES | Transactional notification emails |
| Events | Spring ApplicationEventPublisher | Async observer pattern |
| API Docs | SpringDoc OpenAPI 3 | Swagger UI auto-generation |
| Testing | JUnit 5 + Mockito + Testcontainers | Unit, integration, API tests |
| Build | Maven | Dependency management |

### Frontend

| Category | Technology | Purpose |
|---|---|---|
| Framework | React 18 + Vite | Component-based UI, fast dev server |
| State | Redux Toolkit | Predictable centralized state |
| Routing | React Router v6 | Nested routes, protected routes |
| Styling | Chakra UI v2 + Tailwind CSS | Component library + utility classes |
| Auth | keycloak-js | OIDC token management, silent SSO |
| HTTP | Axios | Token refresh interceptor, API calls |
| Forms | React Hook Form + Zod | Performant forms, schema validation |
| Charts | Recharts | Dashboard pie and bar charts |
| Build | Vite | Tree shaking, fast hot reload |

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Keycloak handles all authentication via OAuth2/OIDC with PKCE
- Silent SSO check on app load — no login redirect if session exists
- JWT auto-refresh via Axios interceptor before every API call
- Role-based access enforced at both Spring Security (`@PreAuthorize`) and React Router (`ProtectedRoute`) levels
- Ownership checks in service layer — role checks answer "can this role do this?", ownership checks answer "can this specific user do it to this specific record?"

### 🎫 Ticket Management
- Full lifecycle: `OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED`
- Strict backend transition validation — invalid transitions rejected with descriptive errors
- Ticket number auto-generation: `TKT-2024-00012`
- Dynamic filtering by status, category, priority with JPA Specifications
- Paginated list responses with consistent `PagedResponse<T>` envelope

### 📎 Secure File Attachments
- Three-step S3 flow: get presigned PUT URL → upload directly from browser → confirm to backend
- Files never stream through the backend — zero memory overhead for uploads
- Presigned GET URL generated fresh on every view (never stored in DB)
- Max 3 attachments per ticket, JPG/PNG only, 5MB limit — validated on both client and server

### 💬 Activity Thread
- Shared comment system across all three roles
- Each comment shows the author's name, role badge, and relative timestamp
- Comments blocked on CLOSED tickets
- Activity timeline ordered oldest-first for readability

### 📊 Admin Dashboard
- Real-time counts: Open, Assigned, In Progress, Resolved, Closed
- Pie chart — distribution by status
- Bar chart — breakdown by category
- Single aggregation API with three `GROUP BY` queries — no N+1 problem

### 📧 Event-Driven Notifications (Future Scope)
- Spring `ApplicationEventPublisher` decouples business logic from notification logic
- Events: `TicketStatusChangedEvent`, `TicketAssignedEvent`
- `@Async @EventListener` ensures notifications never block the main transaction
- AWS SES for email delivery — zero cold path in the primary flow

---

## 👥 User Roles

```mermaid
graph LR
    %% Custom Theme Styling
    classDef tenant fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px,color:#1E40AF;
    classDef technician fill:#F0FDF4,stroke:#22C55E,stroke-width:2px,color:#166534;
    classDef admin fill:#FAF5FF,stroke:#A855F7,stroke-width:2px,color:#6B21A8;
    classDef core fill:#FFFFFF,stroke:#64748B,stroke-width:1px,color:#0F172A;
    classDef restricted fill:#FFF1F2,stroke:#F43F5E,stroke-width:1px,color:#9F1239;

    %% 1. ROLES (Left Column)
    subgraph ROLES ["👥 User Roles"]
        R_TENANT["📋 TENANT<br/>(Facility End-User)"]
        R_TECH["🛠️ TECHNICIAN<br/>(Field/Repair Agent)"]
        R_ADMIN["📊 ADMIN<br/>(Operations Manager)"]
    end
    class R_TENANT tenant;
    class R_TECH technician;
    class R_ADMIN admin;

    %% 2. PERMISSIONS (Right Side)
    subgraph PERMISSIONS ["🔐 Platform Permissions Matrix"]
        %% Shared / Overlapping Action
        P_SHARED["💬 Add Comments"]
        P_ATTACH["📎 View All Attachments"]

        %% Tenant Dedicated
        P_T1["🆕 Create Tickets"]
        P_T2["🖼️ Upload Photos"]
        P_T3["👁️ View Own Tickets"]
        P_T4["🔒 Close Tickets"]

        %% Technician Dedicated
        P_TE1["👁️ View Assigned Tickets"]
        P_TE2["🚀 Start Work (IN_PROGRESS)"]
        P_TE3["✅ Mark Resolved"]

        %% Admin Dedicated
        P_A1["👁️ View All Tickets"]
        P_A2["🎯 Assign Tickets"]
        P_A3["📈 View Dashboard Charts"]

        %% Explicit Prohibitions
        X_NO_CREATE["❌ CANNOT Create/Close Tickets"]
    end
    class P_SHARED,P_ATTACH,P_T1,P_T2,P_T3,P_T4,P_TE1,P_TE2,P_TE3,P_A1,P_A2,P_A3 core;
    class X_NO_CREATE restricted;

    %% 3. RELATIONSHIP MAP
    %% Tenant Actions
    R_TENANT --> P_T1
    R_TENANT --> P_T2
    R_TENANT --> P_T3
    R_TENANT --> P_T4
    R_TENANT -.-> P_SHARED

    %% Technician Actions
    R_TECH --> P_TE1
    R_TECH --> P_TE2
    R_TECH --> P_TE3
    R_TECH --> P_ATTACH
    R_TECH -.-> P_SHARED
    R_TECH --> X_NO_CREATE

    %% Admin Actions
    R_ADMIN --> P_A1
    R_ADMIN --> P_A2
    R_ADMIN --> P_A3
    R_ADMIN --> P_ATTACH
    R_ADMIN -.-> P_SHARED
    R_ADMIN --> X_NO_CREATE
```

---

## 🔄 Ticket Lifecycle

```mermaid
stateDiagram-v2
    [*] --> OPEN : Tenant creates ticket

    OPEN --> ASSIGNED : Admin assigns technician

    ASSIGNED --> IN_PROGRESS : Technician starts work

    IN_PROGRESS --> ADDITIONAL_INFO_REQUIRED : Missing context / Parts
    ADDITIONAL_INFO_REQUIRED --> IN_PROGRESS : Tenant/Admin responds

    IN_PROGRESS --> RESOLVED : Technician marks resolved

    RESOLVED --> CLOSED : Tenant confirms resolution

    CLOSED --> [*]

    note right of OPEN
        Initial Submission
    end note

    note right of ASSIGNED
        Waiting for Agent
    end note

    note left of IN_PROGRESS
        Active Repair
    end note

    note right of RESOLVED
        Email notification triggered
    end note

    note right of CLOSED
        Terminal state (Read-only)
    end note
```

**Transition rules (enforced backend only):**

| From | To | Who triggers |
|---|---|---|
| `OPEN` | `ASSIGNED` | ADMIN — must provide `technicianId` |
| `ASSIGNED` | `IN_PROGRESS` | TECHNICIAN — must be the assigned technician |
| `IN_PROGRESS` | `RESOLVED` | TECHNICIAN — must be the assigned technician |
| `RESOLVED` | `CLOSED` | TENANT — must be the ticket creator |

Any other combination → `400 Bad Request` with `"Invalid transition: {FROM} cannot move to {TO}"`

---

## 📡 API Reference

Base URL: `http://localhost:8081/api/v1`

All responses follow the envelope:
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { }
}
```

### Auth

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/auth/sync` | Any | Idempotent — creates user on first login, returns profile on subsequent calls |
| `GET` | `/auth/me` | Any | Returns current user's DB profile |

### Tenant — Tickets

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/tickets` | TENANT | Create a new ticket |
| `GET` | `/tickets/my` | TENANT | Paginated list of own tickets with filters |
| `GET` | `/tickets/{id}` | TENANT | Full ticket detail including comments and attachments |
| `PUT` | `/tickets/{id}/close` | TENANT | `RESOLVED → CLOSED` |
| `POST` | `/tickets/{id}/comments` | All roles | Add a comment to the activity thread |
| `GET` | `/tickets/{id}/comments` | All roles | Get all comments ordered by time |
| `POST` | `/tickets/{id}/upload-url` | TENANT | Get presigned S3 PUT URL |
| `POST` | `/tickets/{id}/attachments` | TENANT | Confirm upload, save S3 metadata |
| `GET` | `/tickets/{id}/attachments/{attId}/view` | All roles | Get fresh presigned S3 GET URL |

### Technician

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/technician/tickets` | TECHNICIAN | Paginated list of assigned tickets |
| `PUT` | `/technician/tickets/{id}/start` | TECHNICIAN | `ASSIGNED → IN_PROGRESS` |
| `PUT` | `/technician/tickets/{id}/resolve` | TECHNICIAN | `IN_PROGRESS → RESOLVED` |

### Admin

| Method | Endpoint | Role | Description |
|---|---|---|---|
| `GET` | `/admin/tickets` | ADMIN | All tickets with filters and pagination |
| `PUT` | `/admin/tickets/{id}/assign` | ADMIN | `OPEN → ASSIGNED` with technician selection |
| `GET` | `/admin/technicians` | ADMIN | All technicians for assign dropdown |
| `GET` | `/admin/dashboard/stats` | ADMIN | Status counts + category/priority breakdowns |

📖 Full interactive API docs available at `http://localhost:8081/swagger-ui.html` when running locally.

---

## 🔒 Security Design

### JWT Flow

```mermaid
sequenceDiagram
    autonumber
    actor Browser as 🌐 Browser (React Frontend)
    participant Keycloak as 🔒 Keycloak (Identity Provider)
    participant SpringBoot as ⚙️ Spring Boot (Resource Server)

    %% Section 1: Authentication
    Note over Browser, Keycloak: Phase 1: Authentication & Token Issuance
    Browser->>Keycloak: POST /protocol/openid-connect/token<br/>(with Authorization Code + PKCE)
    activate Keycloak
    Keycloak-->>Browser: 200 OK (access_token JWT, refresh_token)
    deactivate Keycloak

    %% Section 2: API Request & Verification
    Note over Browser, SpringBoot: Phase 2: API Resource Access & Verification
    Browser->>SpringBoot: GET /api/tickets/my<br/>Authorization: Bearer eyJ...
    activate SpringBoot
    
    %% JWKS Validation Process loop/conditional representation
    Note over SpringBoot, Keycloak: Cryptographic Signature Verification
    SpringBoot->>Keycloak: GET /protocol/openid-connect/certs (JWKS Fetch)
    activate Keycloak
    Keycloak-->>SpringBoot: Return Public Keys (JSON Web Key Set)
    deactivate Keycloak
    
    Note over SpringBoot: Validate JWT Expiry & Claims<br/>Verify Signature locally via public key

    %% Internal Processing 
    Note over SpringBoot: Context Processing:<br/>1. Extract 'sub' (User ID)<br/>2. Convert Realm Roles to GrantedAuthorities
    
    Note over SpringBoot: Security Enforcements:<br/>• @PreAuthorize("hasRole('TENANT')") check<br/>• DB Context Check (Validate resource ownership)

    SpringBoot-->>Browser: 200 OK [JSON Payload: User Tickets Data]
    deactivate SpringBoot
```

### Two Layers of Authorization

**Layer 1 — Role check** (`@PreAuthorize` at controller level):
```
"Can a TECHNICIAN call this endpoint at all?"
→ Handled by Spring Security
```

**Layer 2 — Ownership check** (inside service methods):
```
"Can THIS technician act on THIS specific ticket?"
→ Handled in service layer manually
→ Cannot be expressed with @PreAuthorize alone
```

### AWS IAM Policy (Least Privilege)

The app's IAM user has access to exactly one action on exactly one path:

```json
{
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::fixit-attachments-bucket/tickets/*"
    }
  ]
}
```

No `ListBucket`, no `DeleteObject`, no other buckets, no other AWS services.

---

## ☁️ AWS Integration

### S3 — Secure File Storage

The presigned URL pattern keeps files private while allowing direct browser uploads:

```
Step 1  →  POST /tickets/{id}/upload-url    (get permission)
Step 2  →  PUT  presigned-url               (direct browser → S3, skips backend)
Step 3  →  POST /tickets/{id}/attachments   (save s3Key to DB)
Step 4  →  GET  /tickets/{id}/attachments/{id}/view  (fresh URL per view)
```

**Key design decisions:**
- S3 bucket has **zero public access** — all files are private
- Only the `s3Key` is stored in DB — never the URL (URLs expire, keys don't)
- View URL generated fresh on every request — never cached
- `Content-Type` is locked in the presigned URL signature — S3 rejects mismatches
- CORS configured to allow PUT only from the frontend origin

### SES — Transactional Email (Future Scope)

Triggered asynchronously via Spring Events — business logic never waits for email:

| Trigger | Recipient | Subject |
|---|---|---|
| Ticket assigned | Technician | "New ticket assigned: {ticketNumber}" |
| Status changed to IN_PROGRESS | Tenant | "Work started on: {ticketNumber}" |
| Status changed to RESOLVED | Tenant | "Your ticket {ticketNumber} is resolved" |

### Other Services

| Service | Usage |
|---|---|
| **Amazon IAM** | Least-privilege policy for S3 access |

---

## 🧩 Design Patterns

### Adapter Pattern — FileStorageService

AWS S3 SDK is wrapped behind a clean interface:

```
FileStorageService (interface)
    └── S3FileStorageService (implementation)
            └── AWS SDK v2 S3Presigner
```

**Why:** `TicketAttachmentService` depends on the interface, not the SDK. S3 can be swapped for any other provider without touching business logic. Unit tests mock the interface — no AWS credentials needed in CI.

---

### Specification Pattern — Dynamic JPA Queries

Admin ticket filtering with 3 optional parameters avoids combinatorial query explosion:

```
GET /admin/tickets?status=OPEN&category=PLUMBING&priority=HIGH
```

Each filter becomes a `Specification<Ticket>` predicate. Only non-null filters are added to the `WHERE` clause. One repository method handles all combinations.

---

### Builder Pattern — Lombok `@Builder`

All DTOs and entities with 5+ fields use `@Builder`. No telescoping constructors. Field names in construction code make intent clear.

---

### Repository Pattern

`JpaRepository` provides the full Repository pattern implementation. Custom queries use JPQL named methods or `@Query` annotations — never raw SQL strings.

---

## 📁 Project Structure

### Backend

```
backend/
└── src/main/java/com/app/
    ├── auth/                     User profile sync, JWT extraction
    │   ├── controller/           AuthController
    │   ├── service/              UserService (idempotent sync)
    │   ├── repository/           UserRepository
    │   ├── entity/               User.java
    │   └── dto/                  UserProfileDTO
    │
    ├── ticket/                   Core business domain
    │   ├── controller/           TicketController, TechnicianController, AdminTicketController
    │   ├── service/              TicketService (transitions), TicketCommentService, DashboardService
    │   ├── repository/           TicketRepository (Specifications), CommentRepository
    │   ├── entity/               Ticket, TicketComment, TicketAttachment + enums
    │   ├── specification/        TicketSpecification (dynamic admin filters)
    │   └── dto/                  TicketSummaryDTO, TicketDetailDTO, CommentResponse, etc.
    │
    ├── storage/                  AWS S3 integration (Adapter pattern)
    │   ├── service/              FileStorageService (interface), S3FileStorageService
    │   └── dto/                  PresignedUrlRequest/Response, AttachmentConfirmRequest
    │
    ├── notification/             Async event-driven emails
    │   ├── event/                TicketStatusChangedEvent, TicketAssignedEvent
    │   ├── listener/             NotificationListener (@Async @EventListener)
    │   └── service/              EmailService (SES)
    │
    └── common/                   Shared infrastructure
        ├── exception/            GlobalExceptionHandler, custom exceptions
        ├── response/             ApiResponse<T>, PagedResponse<T>
        ├── config/               SecurityConfig, S3Config, CorsConfig, OpenApiConfig
        ├── audit/                AuditLog entity, AuditService, AuditAspect (@AOP)
        └── util/                 TicketNumberGenerator, DateUtil

resources/
└── db/changelog/
    ├── db.changelog-master.yaml
    └── changes/
        ├── 001-create-users-table.yaml
        ├── 002-create-tickets-table.yaml
        ├── 003-create-ticket-comments-table.yaml
        └── 004-create-ticket-attachments-table.yaml
```

### Frontend

```
frontend/
└── src/
    ├── api/                      HTTP functions per domain
    │   ├── axios.js              Instance + JWT interceptor + token refresh
    │   ├── authApi.js            sync, me
    │   ├── ticketApi.js          Tenant + Technician ticket calls
    │   ├── adminApi.js           Admin dashboard, assign, technicians
    │   └── attachmentApi.js      Presigned URL flow, S3 direct PUT, confirm
    │
    ├── auth/                     Authentication layer
    │   ├── keycloak.js           Singleton Keycloak instance
    │   ├── AuthProvider.jsx      init() with check-sso, useRef double-init guard
    │   └── ProtectedRoute.jsx    Role + auth status gate for every route
    │
    ├── store/                    Redux Toolkit
    │   ├── index.js              configureStore
    │   └── slices/
    │       ├── authSlice.js      status, profile, error
    │       ├── ticketSlice.js    list, detail, action states + thunks
    │       └── adminSlice.js     admin list, technicians, stats + thunks
    │
    ├── hooks/                    Custom hooks — components never touch Redux directly
    │   ├── useAuth.js            Redux auth state + Keycloak actions
    │   ├── useTickets.js         Ticket list fetch, filters, pagination
    │   ├── useTicketDetail.js    Single ticket fetch, status actions, comments
    │   ├── useAdminTickets.js    Admin list fetch, assign action
    │   ├── useAdminStats.js      Dashboard stats fetch
    │   └── useAttachments.js     3-step S3 upload, fresh view URL generation
    │
    ├── components/
    │   ├── layout/               AppShell, Sidebar, Header, MobileDrawer
    │   ├── tickets/              StatusBadge, PriorityBadge, TicketCard, TicketTable,
    │   │                         FilterBar, CreateTicketModal, AssignModal,
    │   │                         AttachmentUploader, AttachmentGallery, EmptyTickets
    │   └── ui/                   UserAvatar, LoadingScreen, ErrorBoundary,
    │                             TicketCardSkeleton, TableSkeleton, ConfirmDialog
    │
    ├── pages/
    │   ├── LoginPage.jsx         Split-panel with Keycloak redirect
    │   ├── ProfilePage.jsx       Account info, sign out
    │   ├── tenant/               MyTicketsPage, TicketDetailPage
    │   ├── technician/           AssignedTicketsPage
    │   └── admin/                AdminDashboardPage (Recharts), AllTicketsPage
    │
    ├── validation/               Zod schemas
    │   ├── ticketSchema.js       createTicketSchema
    │   └── assignTicketSchema.js assignTicketSchema
    │
    ├── utils/
    │   ├── avatarUtils.js        getInitials("Priya Sharma") → "PS"
    │   ├── dateUtils.js          formatDistanceToNow, formatDateTime
    │   ├── errorUtils.js         getErrorMessage, buildToast
    │   └── constants.js          Enums, color maps, role-home mapping
    │
    └── theme/
        └── index.js              Chakra extendTheme — Inter font, brand orange, AWS colors
```

---

## 🚀 Local Setup

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| Java | 21+ | [OpenJDK](https://adoptium.net/) |
| Maven | 3.9+ | [maven.apache.org](https://maven.apache.org/) |
| Node.js | 20 LTS | [nodejs.org](https://nodejs.org/) |
| Docker Desktop | Latest | [docker.com](https://www.docker.com/) |
| Postman | Any | [postman.com](https://www.postman.com/) |

### Step 1 — Clone the repository

```bash
git clone https://github.com/yourusername/fixit-system.git
cd fixit-system
```

### Step 2 — Start infrastructure

This starts PostgreSQL, Keycloak, and Redis in Docker:

```bash
docker compose up -d postgres keycloak
```

Wait ~30 seconds for Keycloak to be ready, then verify:
```bash
# PostgreSQL
docker compose logs postgres | grep "ready to accept connections"

# Keycloak
curl -s http://localhost:8180/health | grep '"status":"UP"'
```

### Step 3 — Configure Keycloak realm

1. Open http://localhost:8180
2. Login with `admin` / `admin`
3. Create realm → `fixit-realm`
4. Create roles → `TENANT`, `TECHNICIAN`, `ADMIN`
5. Create client → `fixit-frontend` (public, PKCE enabled)
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
6. Create test users (one per role):

| Username | Password | Role |
|---|---|---|
| `tenant1` | `password` | TENANT |
| `technician1` | `password` | TECHNICIAN |
| `admin1` | `password` | ADMIN |

### Step 4 — Configure environment variables

**Backend** — set these in IntelliJ Run Configuration or export in your shell:

```bash
export AWS_ACCESS_KEY_ID=your_access_key_id
export AWS_SECRET_ACCESS_KEY=your_secret_access_key
export AWS_REGION=ap-south-1
export S3_BUCKET_NAME=fixit-attachments-yourname
```

**Frontend** — create `frontend/.env`:

```env
VITE_KEYCLOAK_URL=http://localhost:8180
VITE_KEYCLOAK_REALM=fixit-realm
VITE_KEYCLOAK_CLIENT_ID=fixit-frontend
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

### Step 5 — Start the backend

```bash
cd backend
mvn spring-boot:run
```

Liquibase runs all migrations automatically on startup. Verify:
```
Started BackendApplication in X.XXX seconds
```

Swagger UI: http://localhost:8081/swagger-ui.html

### Step 6 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

---

## 🔧 Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | ✅ Yes | IAM user access key for S3 |
| `AWS_SECRET_ACCESS_KEY` | ✅ Yes | IAM user secret key |
| `AWS_REGION` | ✅ Yes | AWS region (e.g. `ap-south-1`) |
| `S3_BUCKET_NAME` | ✅ Yes | S3 bucket name for attachments |
| `SPRING_DATASOURCE_URL` | ✅ Yes | PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | ✅ Yes | DB username |
| `SPRING_DATASOURCE_PASSWORD` | ✅ Yes | DB password |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_KEYCLOAK_URL` | ✅ Yes | Keycloak server base URL |
| `VITE_KEYCLOAK_REALM` | ✅ Yes | Keycloak realm name |
| `VITE_KEYCLOAK_CLIENT_ID` | ✅ Yes | Public client ID |
| `VITE_API_BASE_URL` | ✅ Yes | Spring Boot backend URL |

> ⚠️ **Never commit `.env` files or AWS credentials to Git.** The `.env` file and any file containing `AWS_SECRET_ACCESS_KEY` are in `.gitignore`.

---

## 🧪 Running Tests

### Backend

```bash
cd backend

# All tests
mvn test

# Unit tests only (fast, no Docker required)
mvn test -Dgroups=unit

# Integration tests (requires Docker for Testcontainers)
mvn test -Dgroups=integration

# With coverage report
mvn verify
# Report at: target/site/jacoco/index.html
```

### What's tested

| Layer | Tool | Covers |
|---|---|---|
| Service layer | JUnit 5 + Mockito | Business rules, transition validation, ownership checks |
| Repository layer | Testcontainers (real PostgreSQL) | JPA queries, Liquibase migrations |
| Controller layer | MockMvc | 401/403 enforcement, request validation, response shape |
| S3 | Mockito (mocked S3Client) | Key validation, URL generation logic |

### Frontend

```bash
cd frontend

# Type check (if using TypeScript)
npm run lint

# Production build validation
npm run build
```

---

## 📸 Screenshots

### 🔐 Authentication

<img src="docs/screenshots/login_page.png" alt="Login Page" width="100%" />

> Split-panel login - branding on the left, Keycloak OAuth2 sign-in card on the right.

---

### 👤 Tenant - My Tickets

<img src="docs/screenshots/tenant_my_tickets.png" alt="My Tickets" width="100%" />

> Card grid with status badges, priority pills, category filters, and pagination.

---

### 🎫 Create Ticket

<img src="docs/screenshots/create_ticket.png" alt="Create Ticket Modal" width="100%" />

> Modal form with Zod validation - title, category, priority, location, and description.

---

### 🔍 Ticket Detail

<img src="docs/screenshots/ticket_details.png" alt="Ticket Detail" width="100%" />

> Full ticket view - metadata, photo gallery, activity thread with role-labelled comments,
> and role-based action buttons (Start Work / Resolve / Close).

---

### 🛠️ Technician - Assigned Tickets

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/technician_assigned.png" alt="Assigned Tickets" width="100%" />
      <p align="center"><em>Assigned tickets list</em></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/technician_start_work.png" alt="Start Work" width="100%" />
      <p align="center"><em>Starting work - ASSIGNED → IN_PROGRESS</em></p>
    </td>
  </tr>
</table>

<img src="docs/screenshots/technician_mark_resolved.png" alt="Mark Resolved" width="100%" />

> Technician marks the ticket resolved - triggers an email notification to the tenant via AWS SES.

---

### 📊 Admin - Dashboard

<img src="docs/screenshots/admin_dashboard.png" alt="Admin Dashboard" width="100%" />

> Live stat cards + Recharts pie chart (by status) and bar chart (by category).
> Data fetched from three `GROUP BY` aggregate queries - no N+1.

---

### 📋 Admin - All Tickets

<img src="docs/screenshots/admin_all_tickets.png" alt="All Tickets" width="100%" />

> Sortable table with dynamic filters. Click **Assign** on any OPEN ticket to open
> the technician selection modal - transitions ticket to ASSIGNED instantly.

---

## 📄 License

This project is intended as a portfolio demonstration. Feel free to use it as a reference for your own projects.

---

<div align="center">

**Built with ☕ Java, ⚛️ React, and ☁️ AWS**

</div>