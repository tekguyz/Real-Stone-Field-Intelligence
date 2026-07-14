# 🏗️ Field Ops Terminal | Real Stone & Granite

An industrial-grade, mobile-first job management and verification system designed for high-glare field environments. Built with a **Neo-Brutalist** aesthetic and a texture system to match the stone fabrication industry.

## 🛠️ The Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) with custom CSS Variable Design Tokens
- **Database**: Supabase (PostgreSQL + Real-time)
- **Auth**: Supabase Auth (Google OAuth)
- **State Management**: Zustand
- **Data Fetching/Caching**: TanStack Query/React Query
- **Icons**: Lucide React
- **Animation**: motion/react

## 🏗 System Architecture & FSD

The project follows a **Modified Feature-Sliced Design (FSD)** architecture:
- **Entities**: Domain models (Job, User, Inventory).
- **Features**: User-facing high-level features (Field Jobs, Admin CommandCenter, Admin Dashboard, Import).
- **Shared**: Reusable infrastructure (API clients, UI components, types).

## 🛠️ The Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (v4) + OKLCH Color Space
- **State Management**: Zustand
- **Analytics**: Recharts (for Administrative Intelligence)
- **Animation**: motion/react (Industrial micro-interactions)

## 🏗 Architecture Principles

### 1. JIT (Just-In-Time) Permissions
We strictly enforce a "Don't Ask Until Necessary" policy. Users are never prompted for Camera or Geolocation permissions on the initial app load. 
- **The Primer Pattern**: Before a system permission prompt is triggered, the app displays a "Verification Primer".
- **Gesture Persistence**: Synchronous permission checks before firing capture inputs.

### 2. Rugged UI Philosophy
The interface ignores standard web softness in favor of industrial density:
- **Neo-Brutalist Foundations**: High-contrast boundaries, heavy shadows (2px/4px standard), and zero-radius corners.
- **High Contrast (Light/Dark)**: Optimized for high-glare field environments (Light) and fabrication shops (Dark).
- **Status Persistence**: Thicker badges (border-2) and black font weights for maximum legibility.
- **Workflow Integrity**: Status transitions are linear and immutable once verified.

## 📱 Field Operations
The field module is optimized for high-glare environments.
- **Capture**: `capture="environment"` forces native camera apps.
- **Sync**: Intelligent status management ensures offline-first reliability via persistence hooks.
- **Micro-Haptics**: Shutter feedback on capture and success vibrations on submission.

## 📊 Administrative Intelligence
The admin side provides high-level tactical oversight.
- **Command Center**: Live pipeline tracking and verification ledger.
- **Dashboard**: Visual distribution of operational velocity and status trends.
- **Automation**: One-click StoneApp CSV ingestion for job hydration.

## 🚀 Setup & Installation

1. **Environment Configuration**
   Create a `.env.example` as a template for your local variables.

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   npm run dev
   ```

---
**Developed by TEKGUYZ.**
