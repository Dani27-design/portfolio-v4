# Daniansyah Chusyaidin — Portfolio

High-fidelity portfolio website for Daniansyah Chusyaidin, Fullstack & Mobile Engineer.

**Live**: https://daniansyah.dev

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4
- **Animation**: motion/react
- **i18n**: next-intl (EN/ID)
- **Data**: Firebase Firestore + Firebase Admin SDK
- **Auth**: Firebase Auth + next-firebase-auth-edge
- **Deployment**: Vercel
- **Testing**: Vitest + Testing Library

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Type-check with tsc |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |

## Environment Variables

Copy `.env.example` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

## Project Structure

```
src/
  app/              # Next.js App Router pages
  components/       # React components (sections/, ui/, gimmicks/, game/, layout/, pages/, admin/)
  context/          # ThemeProvider, AuthContext
  i18n/             # next-intl routing, navigation, request config
  lib/              # Firebase client/admin, Firestore queries
  actions/          # Server actions (CRUD)
  types/            # TypeScript interfaces
  test/             # Vitest tests
messages/           # Translation JSON files (en.json, id.json)
scripts/            # Seed scripts
```
