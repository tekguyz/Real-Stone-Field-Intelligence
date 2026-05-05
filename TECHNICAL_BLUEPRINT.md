# Technical Blueprint: Rugged Field Management System

## Overview
This application is a specialized field management solution designed for tracking, managing, and verifying industrial installation jobs. It leverages a modern full-stack architecture optimized for field operations where connectivity may be intermittent.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) with custom CSS Variable Design Tokens
- **Database**: Supabase (PostgreSQL + Real-time)
- **Auth**: Supabase Auth (Google OAuth)
- **State Management**: Zustand
- **Data Fetching/Caching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Animation**: motion/react

## Architecture
The codebase is structured using a feature-based architecture to ensure scalability and maintainability:

### Core Structure
- `/app`: Routing (App Router)
- `/features`: Domain-driven feature modules (e.g., `admin-inventory`, `field-jobs`, `admin-jobs`)
- `/entities`: Core shared domain entities and their API/Service logic
- `/components`: Re-usable, UI-library agnostic components
- `/lib`: Shared utilities, constants, and global hooks

### Data Layer
- **Data Layer**: Supabase is the source of truth. Offline resilience managed via Dexie.js for sync queuing.
- API logic is colocated within `/entities/<entity>/api.ts`.
- Client-side data management is handled by TanStack Query for caching and synchronization.

### Styling System
- We use a custom, tokenized color system defined in `app/globals.css`.
- Colors are referenced via CSS variables (e.g., `var(--status-active-bg)`) to ensure consistency across the application.
- Tailwind utility classes are applied directly for responsiveness and layout.

## Data Invariants & Security
- **Strict Validation**: All writes to Firestore are validated via `isValid` helpers in `firestore.rules`.
- **Identity-Aware**: Resources are tied to authorized users through relationship checks (no client-side filtering).
- **Atomic Operations**: State transitions (e.g., Start Job) are performed using Firestore transactions or batched writes where applicable.
