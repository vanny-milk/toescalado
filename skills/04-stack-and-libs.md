# Stack and Libraries

This document lists the approved stack, versions, and rules for adding new libraries to ToEscalado.

## 1. Core Stack
- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.8
- **Language:** TypeScript 5.3.3

## 2. Styling
- **CSS Framework:** Tailwind CSS 3.3.6 (with PostCSS & Autoprefixer)
- **Icons:** Lucide React (`lucide-react`)
- **Utilities:** `class-variance-authority`, `clsx`, `tailwind-merge`

## 3. Backend & State Management
- **Backend as a Service:** Supabase (`@supabase/supabase-js` ^2.38.0)
- **Data Fetching / State:** React Query (`@tanstack/react-query` ^5.90.19)

## 4. Policy on Adding New Libraries
- **Do not introduce heavy libraries unnecessarily.** Always check if the functionality can be implemented with native APIs or existing dependencies.
- **Consult before adding:** Before installing a new library via npm/yarn, you must ensure it does not bloat the bundle size significantly and aligns with the project's modern tech stack.
