# Product Requirements Document (PRD): Rugged Field Management

## 1. Product Vision
To provide field installers and administrators with an uncompromising, professional-grade pipeline management tool that bridges the gap between office-side administration and field-side execution.

## 2. Core Features
### Administrative Module (Command Center)
- **Unified Pipeline Tracking**: View active, pending, verified, and urgent jobs in a centralized dashboard.
- **Inventory Metrics**: Real-time tracking of slab inventory states (On-Site, In Transit).
- **Automated Workflow**: Ability to transition job statuses, assign installers, and archive completed records.
- **Data Integrity**: Enforce strict status tracking to prevent workflow "jumping."

### Field Module (Mobile Interface)
- **Job Execution Flow**: Clear, step-by-step job interface (Scope, Site, Arrival, Documentation).
- **Proof of Work**: Document-oriented photo capture workflow.
- **Site Verification**: Controlled status progression from "Started" through to "Verified/Reviewed."

## 3. User Roles
- **Admin**: Full access to the Command Center, inventory management, user configuration, and pipeline oversight.
- **Installer**: Field-constrained access focused on job execution, status updates, and documentation.

## 4. Design Philosophy
- **"Rugged" Aesthetic**: High-contrast, utilitarian design. Intentionally bold borders, heavy font weights, and clear status tokens.
- **Mobile-First UX**: Fast, touch-friendly interfaces with clear calls-to-action (CTAs).
- **Typography & Color**: Systematic use of CSS tokens to reinforce state (Verified = Teal, Urgent = Warning Orange, Active = Brand Gold).

## 5. Roadmap & Future Scope
- [ ] Automated Reporting (Data export)
- [ ] Offline-first sync layer enhancement
- [ ] Deeply integrated mapping/navigation for jobs
- [ ] Enhanced role-based permission granularization
