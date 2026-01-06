# StudyFlow - Study Management Application

## Overview

StudyFlow is a study management web application designed to help students track their academic progress. The app allows users to manage subjects with upcoming exams, log study sessions, track problems/questions that need attention, and organize personal events on a calendar. The application features a dashboard with study statistics, subject management with color-coded progress indicators, and file attachments for study materials.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query for server state, React Context for local UI state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite

The frontend follows a page-based architecture with shared components. Key pages include Dashboard, Subjects, Calendar, and Statistics. The `StudyProvider` context wraps the application to provide centralized data access and mutations.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints under `/api/*`
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Build**: esbuild for production bundling

The server handles CRUD operations for subjects, problems, study logs, personal events, and study files. All routes are registered in `server/routes.ts` with validation using Zod schemas.

### Data Storage
- **Database**: PostgreSQL (configured via `DATABASE_URL` environment variable)
- **Schema Location**: `shared/schema.ts` using Drizzle's pgTable definitions
- **Migrations**: Managed via `drizzle-kit push`

Key entities:
- **Subjects**: Exam courses with dates, colors, study scores, and target hours
- **Problems**: Questions/issues linked to subjects with status tracking
- **Study Logs**: Time-tracked study sessions with optional problem resolution
- **Personal Events**: Calendar events (classes, appointments, training)
- **Study Files**: File attachments linked to subjects

### API Structure
All API endpoints follow REST conventions:
- `GET/POST /api/subjects` - List and create subjects
- `PATCH/DELETE /api/subjects/:id` - Update and delete subjects
- `GET/POST /api/problems` - List and create problems
- `GET/POST /api/study-logs` - List and create study logs
- `GET/POST /api/personal-events` - List and create events
- `GET/POST /api/files` - List and create file attachments

### Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle table definitions and Zod validation schemas (via drizzle-zod)

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection string via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and migrations

### UI Components
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **Radix UI**: Headless UI primitives for dialogs, dropdowns, tooltips, etc.
- **Lucide React**: Icon library

### Frontend Libraries
- **React Query (@tanstack/react-query)**: Server state management and caching
- **React Hook Form**: Form state management with Zod validation
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Variant-based component styling
- **embla-carousel-react**: Carousel functionality

### Development Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type checking across the codebase
- **Tailwind CSS v4**: Utility-first CSS framework
- **esbuild**: Production server bundling

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Development tooling (dev only)
- **@replit/vite-plugin-dev-banner**: Development banner (dev only)