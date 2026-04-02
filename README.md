# Prompt Verse

A full-stack web application for sharing, testing, and managing AI prompts.

## Tech Stack

- **Frontend**: Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Backend**: Express.js (TypeScript)
- **Database**: PostgreSQL with Prisma ORM v6
- **State Management**: React Query (TanStack Query) + Zustand
- **UI Components**: Custom components with Radix UI primitives

## Features

- **Prompt Library**: Create, read, update, delete prompts
- **Prompt Playground**: Test prompts with mock AI responses
- **Voting System**: Upvote/downvote prompts
- **Versioning**: Track changes to prompts
- **Fork/Remix**: Duplicate prompts from others

## Project Structure

```
prompt-project/
├── backend/                 # Express.js API
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Error handling, validation
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utilities
│   │   └── index.ts         # Entry point
│   └── package.json
├── frontend/                # Next.js App
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utilities, API client, stores
│   │   └── types/           # TypeScript types
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- pnpm

## Getting Started

### 1. Database Setup

Make sure PostgreSQL is running and create a database:

```sql
CREATE DATABASE promptverse;
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
pnpm run db:generate

# Push schema to database
pnpm run db:push

# Start development server
pnpm run dev
```

The backend will run on `http://localhost:3001`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The frontend will run on `http://localhost:3000`.

## API Endpoints

### Prompts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/prompts | List prompts (paginated) |
| GET | /api/prompts/:id | Get single prompt |
| POST | /api/prompts | Create prompt |
| PUT | /api/prompts/:id | Update prompt |
| DELETE | /api/prompts/:id | Delete prompt |
| POST | /api/prompts/:id/upvote | Upvote prompt |
| POST | /api/prompts/:id/downvote | Downvote prompt |
| POST | /api/prompts/:id/fork | Fork prompt |
| GET | /api/prompts/:id/versions | Get version history |

### Playground

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/playground/run | Execute prompt |

## Environment Variables

### Backend (.env)

```
DATABASE_URL="postgresql://user:password@localhost:5432/promptverse"
PORT=3001
NODE_ENV=development
```

## Database Schema

### Prompt

- `id` (cuid) - Unique identifier
- `title` (string) - Prompt title
- `description` (string) - Prompt description
- `content` (string) - The actual prompt content
- `category` (string) - Category for grouping
- `tags` (string[]) - Array of tags
- `upvotes` (int) - Upvote count
- `downvotes` (int) - Downvote count
- `forkedFrom` (string?) - Reference to original prompt if forked
- `createdBy` (string) - Creator identifier
- `createdAt` (datetime) - Creation timestamp
- `updatedAt` (datetime) - Last update timestamp

### PromptVersion

- `id` (cuid) - Unique identifier
- `promptId` (string) - Reference to parent prompt
- `content` (string) - Previous prompt content
- `createdAt` (datetime) - Version creation timestamp

### Vote

- `id` (cuid) - Unique identifier
- `promptId` (string) - Reference to prompt
- `userId` (string) - Voter identifier
- `type` (enum) - UP or DOWN
- `createdAt` (datetime) - Vote timestamp

## Scripts

### Backend

```bash
pnpm run dev         # Start development server (tsx watch)
pnpm run build       # Build for production
pnpm run start       # Start production server
pnpm run db:generate # Generate Prisma client
pnpm run db:push     # Push schema to database
pnpm run db:migrate  # Run migrations
pnpm run db:studio   # Open Prisma Studio
```

### Frontend

```bash
pnpm run dev    # Start development server
pnpm run build # Build for production
pnpm run start # Start production server
```

## Development Notes

- The frontend proxies `/api/*` requests to the backend at `localhost:3001`
- Voting uses IP address as a simple user identifier (not persistent across sessions)
- Playground uses mock AI responses (no real AI integration)
- Versions are created automatically when a prompt is updated
