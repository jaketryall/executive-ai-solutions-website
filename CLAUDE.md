# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Executive AI Solutions is a marketing website built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. The site features a dark theme with electric blue (#0066ff) accents and modern glassmorphic design elements.

## Development Commands

```bash
# Start development server (uses Turbopack by default in Next.js 16)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture & Key Technical Decisions

### Tailwind CSS v4 with PostCSS
This project uses Tailwind CSS v4 with the official PostCSS integration:
- `app/globals.css` contains Tailwind imports and custom utilities
- PostCSS handles CSS compilation automatically via `postcss.config.mjs`
- NO separate CSS build step needed - Next.js handles it
- NO `tailwind.config.js/ts` needed - Tailwind v4 auto-detects content

**Critical Tailwind v4 Notes:**
- Import syntax is `@import "tailwindcss";` NOT `@tailwind base/components/utilities`
- PostCSS config uses `@tailwindcss/postcss` plugin
- Custom utilities must be defined in `@layer utilities {}` blocks
- CSS custom properties (like `--primary-blue`) work directly without theme config
- Arbitrary values like `bg-[#0066ff]` work without configuration
- Content detection is automatic - no need to configure content paths

### Custom CSS Utilities
The project defines several custom utilities in `app/globals.css`:
- `.bg-gradient-radial` - Radial blue gradient effect
- `.text-glow-blue` - Blue text glow effect
- `.border-glow-blue` - Blue border glow effect
- `.bg-glass` & `.bg-glass-blue` - Glassmorphic effects
- `.bg-grid-pattern` - Blue grid background pattern
- `.bg-noise` - Subtle noise texture overlay

### Component Structure
All components use client-side rendering (`"use client"`) for Framer Motion animations:
- Components are in `/components` directory
- Each section has its own component (Hero, Services, UseCases, etc.)
- Icons are custom SVG components in `Icons.tsx`
- All animations use Framer Motion with `useInView` for scroll triggers

### Design System
- Primary color: Electric blue (#0066ff)
- Dark theme by default
- Inter font from Google Fonts
- Glassmorphic card designs
- Blue glow effects on interactive elements

### Important Files
- `app/globals.css` - Source CSS with Tailwind imports and custom utilities
- `postcss.config.mjs` - PostCSS configuration with @tailwindcss/postcss
- `app/layout.tsx` - Root layout with metadata and font configuration
- `components/Icons.tsx` - Custom SVG icon components

### Next.js 16 Notes
- Turbopack is the default bundler (2-5x faster builds)
- The `next lint` command has been replaced with direct `eslint .`
- Dynamic Request APIs (params, searchParams, cookies, headers) require `await`
- React 19.2 is used

### Common Pitfalls to Avoid
1. Do NOT use `@tailwind base; @tailwind components; @tailwind utilities;` - this is v3 syntax
2. Do NOT create separate CSS build scripts - PostCSS handles everything
3. Do NOT expect `@apply` to work with custom utilities that aren't defined
4. CSS class names cannot start with a number (use `\33xl` escape for `3xl` prefix)
5. When using TypeScript with union types, always add null/undefined checks
