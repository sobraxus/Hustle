# Hustle - SLA/SLO Tracker

A 24/7 SLA/SLO tracking system built with the T3 Stack (Next.js, Prisma, tRPC, Tailwind, NextAuth).

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Prisma** - Database ORM
- **tRPC** - End-to-end typesafe APIs
- **Tailwind CSS** - Styling
- **NextAuth.js** - Authentication
- **TypeScript** - Type safety
- **SQLite** - Database (can be switched to PostgreSQL later)

## Features

- Case management with status tracking (OPEN, ASSIGNED, RESOLVED)
- Priority levels (LOW, MEDIUM, HIGH, CRITICAL)
- SLA/SLO threshold tracking
- Response and resolution SLI metrics
- Call-out trigger tracking

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   **Note:** SQLite doesn't require any credentials! Just use `file:./dev.db` as shown above.

3. **Set up the database:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Database Setup

### Using SQLite (Default - No Setup Required!)
SQLite is configured by default and requires **zero setup**. Just use:
```env
DATABASE_URL="file:./dev.db"
```

The database file (`dev.db`) will be created automatically in your project root when you run `npx prisma db push`.

### Switching to PostgreSQL Later
If you want to use PostgreSQL later, simply:
1. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
2. Update your `.env` with a PostgreSQL connection string
3. Run `npx prisma db push` again

## SLA/SLO Thresholds

The system uses the following static thresholds (defined in `src/config/sla-slo.ts`):

### SLA (Response Time)
- **CRITICAL**: 20 minutes
- **HIGH**: 1 hour
- **MEDIUM**: 2 hours
- **LOW**: 4 hours

### SLO (Resolution Time)
- **CRITICAL**: 2 hours
- **HIGH**: 4 hours
- **MEDIUM**: 8 hours
- **LOW**: 12 hours

## Database Schema

### Case Model
- `id`: Unique identifier (CUID)
- `status`: OPEN | ASSIGNED | RESOLVED
- `priority`: LOW | MEDIUM | HIGH | CRITICAL
- `createdAt`: Case creation timestamp
- `assignedAt`: Assignment timestamp (optional)
- `completedAt`: Completion timestamp (optional)
- `responseSli`: Response SLI in seconds (optional)
- `resolutionSli`: Resolution SLI in seconds (optional)
- `isCallOutTriggered`: Boolean flag for call-out status
- `updatedAt`: Last update timestamp

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma Client

## Project Structure

```
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js app router pages
│   ├── config/             # Configuration files
│   │   └── sla-slo.ts      # SLA/SLO thresholds
│   ├── server/             # Backend code
│   │   ├── api/            # tRPC routers
│   │   ├── auth.ts         # NextAuth configuration
│   │   └── db.ts           # Prisma client
│   ├── styles/             # Global styles
│   └── trpc/               # tRPC React client
└── package.json
```
