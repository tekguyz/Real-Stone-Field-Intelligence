# 🏗️ Field Ops Terminal | Real Stone & Granite

An industrial-grade, mobile-first job management and verification system designed for high-glare field environments. Built with a **Neo-Brutalist** aesthetic and a texture system to match the stone fabrication industry.

## ⚡ The Stack
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4 (OKLCH Color Space)
* **Backend/Auth:** Supabase
* **Communications:** Resend (Server Actions)
* **Deployment:** Netlify

## 🛠️ Core Features
* **Command Center:** High-density Admin dashboard with a 5-tier status matrix and real-time activity feed.
* **Mobile Field Terminal:** Optimized PWA interface for installers with "Safe Area" edge-to-edge rendering and large tactile touch targets.
* **GPS Evidence Ledger:** Automated capture of high-accuracy geolocation metadata and 12-hour timestamps for all job site photos.
* **Master Job Reports:** Industrial PDF/Print-ready verification records with strict `@media print` layout hardening.
* **Executive Auth:** Role-based permission system allowing Admins to verify and close work orders from any interface.

## 🎨 Semantic Status Matrix
The system utilizes a strict OKLCH color wheel to ensure legibility in direct sunlight:
* **ASSIGNED:** Neutral Slate (Quiet)
* **PENDING:** Safety Orange (Warning)
* **ACTIVE:** Royal Blue (In Progress)
* **REVIEW:** Industrial Purple (Gated)
* **VERIFIED:** Success Green (Final)

## 🚀 Setup & Installation

1. **Environment Configuration**
   Create a `.env.local` file in the root:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   RESEND_API_KEY=your_key
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   npm run dev
   ```

## 📱 PWA Configuration
The application is configured as a Progressive Web App. Ensure `manifest.json` and icons are present in `/public`. The `themeColor` is dynamically handled via `app/layout.tsx` to match the **Onyx/White** theme across iOS and Android system bars.

## 📜 Deployment
Currently optimized for deployment on **Netlify** using Next.js Runtime. Ensure "Contains Secrets" is enabled in the Netlify dashboard for the `RESEND_API_KEY`.

---
**Developed by TEKGUYZ.**