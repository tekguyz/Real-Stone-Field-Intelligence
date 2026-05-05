# Product Requirements Document (PRD): Rugged Field Management

## 1. Product Vision
To provide field installers and administrators with an uncompromising, professional-grade pipeline management tool that bridges the gap between office-side administration and field-side execution.

## 2. Core Features
### Administrative Module (Command Center)
- **Unified Pipeline Tracking**: View active, pending, verified, and urgent jobs in a centralized dashboard.
- **Inventory Metrics**: Real-time tracking of slab inventory states (On-Site, In Transit).
- **Automated Workflow**: Ability to transition job status, assign installers, and archive records.
- **Data Integrity**: Enforce strict status tracking via Supabase RLS and internal status guards.

### Field Module (Mobile Interface)
- **Job Execution Flow**: Clear, step-by-step job interface (Scope, Site, Arrival, Documentation).
- **Proof of Work**: Document-oriented photo capture workflow.
- **Site Verification**: Controlled status progression with JIT permission prompts and offline resilience.

## 3. User Roles
- **Admin**: Full access to the Command Center, inventory management, and pipeline oversight.
- **Installer**: Field-constrained access focused on job execution and documentation.

## 4. Design Philosophy
- **"Rugged" Aesthetic**: High-contrast, utilitarian design. Intentionally bold borders, heavy font weights, and semantic status tokens.
- **Mobile-First UX**: Fast, touch-friendly interfaces with synchronous capture triggers.
- **JIT Governance**: Permissions (GPS/Camera) are only requested during the active documentation phase.

## 5. Technical Specification
- **Engine**: Next.js 15
- **Persistence**: Supabase + Dexie.js (Offline Sync)
- **Aesthetic**: Neo-Brutalist / Industrial
- **Theme**: Rugged Onyx & Brand Gold
