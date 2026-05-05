# 🏗️ Field Ops Terminal | Real Stone & Granite

An industrial-grade, mobile-first job management and verification system designed for high-glare field environments. Built with a **Neo-Brutalist** aesthetic and a texture system to match the stone fabrication industry.

## 🛠️ The Stack
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) with custom CSS Variable Design Tokens
- **Database**: Supabase (PostgreSQL + Real-time)
- **Auth**: Supabase Auth (Google OAuth)
- **State Management**: Zustand
- **Data Fetching/Caching**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Animation**: motion/react

## 🏗 Architecture Principles

### 1. JIT (Just-In-Time) Permissions
We strictly enforce a "Don't Ask Until Necessary" policy. Users are never prompted for Camera or Geolocation permissions on the initial app load. 
- **The Primer Pattern**: Before a system permission prompt is triggered, the app displays a "Verification Primer" explaining why the data is needed (GPS-stamped evidence for billing/insurance).
- **Gesture Persistence**: To ensure the `<input type="file" capture>` triggers correctly across all mobile browsers (especially Safari), the permission state is checked synchronously before firing the target input.

### 2. Rugged UI Philosophy
The interface ignores standard web softness in favor of industrial density:
- **High Contrast**: Pure black/white/gold boundaries.
- **Micro-Haptics**: Shutter feedback on capture and success vibrations on submission.
- **Workflow Integrity**: Status transitions are linear and immutable once verified.

## 📱 Field Operations
The field module is optimized for high-glare environments and glove-friendly touch targets. 
- **Capture**: `capture="environment"` forces native camera apps on mobile devices.
- **Sync**: Batch uploads via Dexie-powered sync queue ensure no data loss during intermittent site connectivity.

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
