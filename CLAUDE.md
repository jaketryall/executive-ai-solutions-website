# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Executive AI Solutions is a marketing website built with Next.js 15, TypeScript, Tailwind CSS v4, and Framer Motion. The site features a dark theme with electric blue (#0066ff) accents and modern glassmorphic design elements.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Build CSS only (with watch mode)
npm run build:css

# Build CSS for production (minified)
npm run build:css:prod
```

## Architecture & Key Technical Decisions

### Tailwind CSS v4 CLI Setup
This project uses Tailwind CSS v4 with a CLI build process instead of PostCSS:
- `input.css` contains Tailwind imports and custom utilities
- CSS is compiled to `app/output.css` using `@tailwindcss/cli`
- The build process runs before Next.js starts
- NO `postcss.config.mjs` file - Tailwind v4 uses CLI compilation instead
- NO `tailwind.config.js/ts` needed - Tailwind v4 auto-detects content

**Critical Tailwind v4 Notes:**
- Import syntax is `@import "tailwindcss";` NOT `@tailwind base/components/utilities`
- The `@tailwindcss/postcss` package is installed but NOT used in postcss config
- Custom utilities must be defined in `@layer utilities {}` blocks
- CSS custom properties (like `--primary-blue`) work directly without theme config
- Arbitrary values like `bg-[#0066ff]` work without configuration
- Content detection is automatic - no need to configure content paths

### Custom CSS Utilities
The project defines several custom utilities in `input.css`:
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
- `input.css` - Source CSS with Tailwind imports and custom utilities
- `app/output.css` - Compiled CSS (do not edit directly)
- `app/layout.tsx` - Root layout with metadata and font configuration
- `components/Icons.tsx` - Custom SVG icon components

### Common Tailwind v4 Pitfalls to Avoid
1. Do NOT use `@tailwind base; @tailwind components; @tailwind utilities;` - this is v3 syntax
2. Do NOT create a `postcss.config.mjs` with tailwindcss plugin - use CLI instead
3. Do NOT expect `@apply` to work with custom utilities that aren't defined
4. If styles aren't applying, check that CSS is being rebuilt: `npm run build:css`
5. Remember that Tailwind v4 requires running the CLI to generate CSS - it doesn't work via PostCSS anymore