# JTECH Trading World

## Overview

JTECH Trading World is a fintech trading platform that enables users to trade gift cards, buy/sell cryptocurrency, and exchange gadgets. The platform provides a secure marketplace connecting customers with the business owner through a web interface with real-time messaging, transaction management, and admin controls.

The application follows a monorepo structure with a React + TypeScript frontend and Express.js backend, using PostgreSQL (via Neon serverless) for data persistence and session management.

## Status

**✅ Fully Functional**
- Local development: Complete and working perfectly
- Vercel deployment: Ready (requires environment variables)
- Windows-compatible: Uses `cross-env` for npm scripts
- Admin credentials: Configurable via environment variables
- Mobile-optimized with WhatsApp-style bottom navigation

## How to Run

```bash
npm run dev
# Launches on http://localhost:5000
```

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Client-side routing via `wouter` (lightweight React Router alternative).

**State Management**: 
- React Context API for authentication state (`AuthContext`)
- TanStack Query (React Query) for server state management and API caching
- Local component state with React hooks

**UI Framework**: 
- Shadcn/ui component library (Radix UI primitives with custom styling)
- Tailwind CSS for styling with custom design system based on Material Design 3 principles
- Custom color palette with HSL-based theming supporting light/dark modes
- Inter font family for all typography

**Key Design Decisions**:
- Component-based architecture with reusable UI components in `client/src/components/ui/`
- Page-level components in `client/src/pages/` for route handling
- Design guidelines documented in `design_guidelines.md` emphasizing fintech platform aesthetics (inspired by Coinbase, PayPal, Stripe)
- Hover and active state elevation effects for interactive elements
- Mobile-first responsive design with WhatsApp-style bottom navigation
- MobileBottomNav component for mobile navigation (replaces hamburger menu)
- Safe area support for devices with notches
- Responsive typography and spacing across all pages

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with JSON payloads, following conventional HTTP methods (GET, POST, PUT, DELETE).

**Authentication & Sessions**:
- Session-based authentication using `express-session` with memory store fallback (`memorystore`)
- Hardcoded admin credentials for no-database deployments
- SHA-256 password hashing (stored as hex strings)
- Session cookies with 30-day expiration
- Admin/user role-based access control via `isAdmin` boolean flag

**File Uploads**: Multer middleware for handling multipart form data (images for gift cards, gadgets, crypto receipts). Files stored in memory on Vercel (read-only filesystem), disk locally. Size limit: 10MB, restricted to image file types only.

**Request Handling**:
- JSON body parsing with raw body preservation for webhook verification if needed
- CORS and credential support enabled
- Error handling with meaningful HTTP status codes

**Development vs Production**:
- Development mode (`server/index-dev.ts`): Vite dev server integration with HMR
- Production mode (`server/index-prod.ts`): Serves pre-built static assets from `dist/public/`

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver with WebSocket support (optional).

**Fallback Mode**: When database unavailable, app uses in-memory storage with hardcoded admin credentials.

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Design** (defined in `shared/schema.ts`):

1. **Users Table**: id (UUID), email, username, passwordHash, isAdmin, createdAt
2. **Gift Card Submissions Table**: cardType, region, amount, cardCode, imageUrls, bankName, accountNumber, accountName, customerEmail, status
3. **Crypto Trades Table**: tradeType (buy/sell), coin, amount, transactionHash, bankName, accountNumber, accountName, customerEmail, status
4. **Gadget Submissions Table**: deviceType, brand, model, condition, description, imageUrls, bankName, accountNumber, accountName, customerEmail, status
5. **Gadgets Table**: name, price, condition, description, specs, imageUrl, available
6. **Messages Table**: senderId, senderUsername, messageText, recipientId, isAdminMessage, createdAt
7. **Exchange Rates Table**: usdToNaira, giftCardRate, btcToNaira, updatedAt
8. **Session Table**: Automatically managed by session store

**Static Gadget Data** (defined in `client/src/data/featuredGadgets.ts`):
When no database is available, displays 3 pre-configured gadget listings:
- MacBook Pro M3 14-inch (₦1,850,000)
- iPhone 16 Pro Max 256GB (₦1,650,000)
- PlayStation 5 Digital Edition (₦520,000)

### Authentication & Authorization

**Login Flow**:
- Users register with email, username, and password
- Passwords hashed with SHA-256 before storage
- Login creates session stored in PostgreSQL or memory fallback
- Session ID returned as HTTP-only cookie
- `/api/auth/me` endpoint validates current session

**Admin Access**:
- Admin user: `Fatahstammy@gmail.com` / `696233` (hardcoded for no-database mode)
- Admin flag checked on protected routes
- Frontend uses `ProtectedAdminRoute` component wrapper
- Admin pages: trades dashboard, messages, post items, update exchange rates

### External Dependencies

**File Storage**: 
- Local filesystem storage in `uploads/` directory (development)
- Memory storage on Vercel (read-only filesystem)
- Images served as static files

**Messaging**: WhatsApp integration with business WhatsApp button (configurable number)

**Email Notifications**: Placeholder for future implementation

**Third-Party UI Libraries**:
- Radix UI, Framer Motion, React Icons, date-fns

**Development Tools**:
- Replit-specific plugins for development environment integration
- ESBuild for production bundling
- TypeScript for type safety
- Vite for frontend dev/build
- Cross-env for cross-platform npm scripts

## Deployment Notes

### Local Development
```bash
npm run dev
# Runs on http://localhost:5000
# All features work, including file uploads and database fallback
```

### Production Build
```bash
npm run build
# Builds frontend and Express backend to dist/
# Can be served with: node dist/index.js
```

## Environment Variables

**Required for Vercel Production:**
- `ADMIN_EMAIL`: Admin login email (required in production)
- `ADMIN_PASSWORD`: Admin login password (required in production)
- `SESSION_SECRET`: Session encryption key (required for security)
- `DATABASE_URL`: Neon PostgreSQL connection string (optional, uses memory fallback)

**Development defaults (only used locally):**
- Admin email: `Fatahstammy@gmail.com`
- Admin password: `696233`
- Session secret: auto-generated fallback

## Recent Changes (Dec 2, 2025)

- ✅ Added Windows compatibility with `cross-env`
- ✅ Implemented memory fallback for session store and file uploads
- ✅ Created vercel.json for serverless function routing
- ✅ Created api/index.ts as Vercel serverless entry point
- ✅ Moved admin credentials to environment variables
- ✅ Fixed session cookie settings for production (secure, sameSite)
- ✅ Added trust proxy for Vercel reverse proxy
- ✅ All local features verified working

## Vercel Deployment

### Setup Steps:
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard:
   - `ADMIN_EMAIL` - your admin email
   - `ADMIN_PASSWORD` - your admin password
   - `SESSION_SECRET` - a strong random string
   - `DATABASE_URL` - (optional) Neon PostgreSQL connection string
3. Deploy

### Configuration Files:
- `vercel.json` - Routes API calls to serverless functions, serves static assets
- `api/index.ts` - Serverless function entry point with all API routes

## Next Steps (For Future)

1. Implement email notifications for submissions
2. Add payment processing integration (Paystack/Flutterwave)
3. Add cloud storage for file uploads (Cloudinary/S3)
4. Add user registration when database is available
