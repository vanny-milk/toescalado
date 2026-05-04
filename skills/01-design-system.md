# Design System & UI Policies

This document outlines the rules and policies for styling and building UI components in the ToEscalado application.

## 1. Core Technologies
- **Styling Framework:** Tailwind CSS
- **Icons:** Lucide React
- **Utility Libraries:** `clsx`, `tailwind-merge` (always use a utility like `cn` to merge class names dynamically), `class-variance-authority` for variants.

## 2. Aesthetics & Visuals
- **Modern UI:** The interface must feel premium, responsive, and dynamic.
- **Glassmorphism:** Use subtle blurs (`backdrop-blur`), translucent backgrounds (`bg-opacity-*`), and border glows for highlighted or floating elements.
- **Micro-animations:** Always add smooth transitions to interactive elements (e.g., `transition-all duration-300 hover:scale-105 hover:bg-gray-100`).
- **Typography:** Use modern, readable fonts (e.g., Inter, Roboto, or Outfit). Avoid browser defaults.
- **Color Palette:** Do not use generic colors (like `bg-red-500` without purpose). Utilize tailored HSL variables or a sophisticated color scheme (e.g., sleek dark modes).

## 3. Component Architecture
- Always build small, focused, and reusable React components.
- Do not repeat complex utility strings; extract them into a reusable component or use `cva` (Class Variance Authority) to manage states and variants.

## 4. Guidelines & Absolutes
- **Tokens over values:** If there is no token, there is no style. NEVER use arbitrary values in Tailwind (`w-[37px]`, `#123456`).
- **Consistency over creativity:** The component does not decide the style, it just applies the system.
- Every new page must follow the established spacing and layout rules.
- Maintain consistent padding (`p-4`, `p-6`) and gaps (`gap-4`, `gap-2`).
- Responsive design is mandatory: always test and build mobile-first (using `md:`, `lg:` prefixes for larger screens).
- **AI Rule:** The AI CANNOT invent styles or bypass the design system. Any generated UI must use predefined tokens from `tailwind.config` and respect `shadcn/ui` conventions.
