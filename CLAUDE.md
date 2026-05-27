@AGENTS.md

# Global Claude Code Preferences

# Project: Rent Desk

Rent Desk is a web application that helps users find and rent desks in co-working spaces.

# Workflow

Before modifying the code:

1. Read relevant files first
2. Explain the implementation plan briefly
3. Modify only necessary files
4. Verify changes do not unintentionally affect other areas
5. Summarize completed changes clearly

## Core Commands

Use Command Prompt (CMD) to run the following commands:

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Run production build locally
- `npm run lint`: Run ESLint checks
- `npm run type-check`: Run type checking
- `npm run test`: Run tests

## Tech Stack

- **Framework:** Next.js 16.2+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Backend:** Express.js, TypeScript, Prisma ORM
- **Database:** Prisma ORM, MySQL
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics
- **Animations:** Use `framer-motion`

## Project Structure

- `src/app/`: App router routes and layouts
- `src/app/projects/`: Project detail pages and components
- `src/app/experiences/`: Career journey pages
- `src/components/`: Reusable UI components (e.g., BentoCard)
- `public/assets/project/`: Image assets for projects

## Design & UI Standards

- **Theme:** Dark mode only (Primary background: `#0a0a0a`)
- **Accent:** Custom accent colors (usually purple/blue shades) with subtle glows/blur effects
- **Typography:** Poppins font family
- **Aesthetic:** Minimalist, premium, "Apple-like" or "Bento-style" layouts
- **Components:** Use `BentoCard` for consistent grid items
- **Animations:** Use `framer-motion` for page transitions and hover effects. Keep animations smooth and subtle.

## Coding Standards

- **Components:** Functional components with proper TypeScript typing
- **Client Directives:** Use `"use client"` at the top of files for components using hooks or framer-motion
- **Naming:** PascalCase for components, camelCase for variables/functions
- **Icons:** Always use `lucide-react` for consistent iconography
- **Images:** Always use `next/image` with proper `fill` or dimensions and `priority` for LCP images
- **Data:** Prefer separating content/data from UI components (moving towards `src/data/` or similar)

## Development Rules

- Heed warnings in `AGENTS.md` regarding Next.js 16 breaking changes
- Maintain accessibility (semantic HTML)
- Ensure responsive design for mobile, tablet, and desktop
- Avoid hardcoded magic numbers; use Tailwind spacing/sizing classes

## Coding Rules

- Use TypeScript in all files
- Comment only when the code genuinely needs explanation
- Break down components into smaller, more readable parts
- Write readable code instead of making it overly short and concise
- Don't delete existing code if you don't understand its function
- Use readable and maintainable naming
- Favor clarity over cleverness

## Git Commit Style

- **Always use convertionnal commit style** (feat, fix, docs, refactor, chore, test, etc.)
- **Do NOT add Claude Code as co-author** - never include `Co-Authored-By`

# Final Engineering Philosophy

This repository prioritizes:

- Maintainability over shortcuts
- Readability over cleverness
- Scalability over temporary hacks
- Long-term architecture over rapid patching
- Learning proper engineering practices over quick solutions
