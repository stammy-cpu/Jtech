# JTECH Trading World

## Overview

JTECH Trading World is a fintech trading platform that enables users to trade gift cards, buy/sell cryptocurrency, and exchange gadgets. The platform provides a secure marketplace connecting customers with the business owner through a web interface with real-time messaging, transaction management, and admin controls.

The application follows a monorepo structure with a React + TypeScript frontend and Express.js backend, using PostgreSQL (via Neon serverless) for data persistence and session management.

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
- Mobile-first responsive design

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with JSON payloads, following conventional HTTP methods (GET, POST, PUT, DELETE).

**Authentication & Sessions**:
- Session-based authentication using `express-session` with PostgreSQL session store (`connect-pg-simple`)
- SHA-256 password hashing (stored as hex strings)
- Session cookies with 30-day expiration
- Admin/user role-based access control via `isAdmin` boolean flag

**File Uploads**: Multer middleware for handling multipart form data (images for gift cards, gadgets, crypto receipts). Files stored in `uploads/` directory with size limit of 10MB, restricted to image file types only.

**Request Handling**:
- JSON body parsing with raw body preservation for webhook verification if needed
- CORS and credential support enabled
- Error handling with meaningful HTTP status codes

**Development vs Production**:
- Development mode (`server/index-dev.ts`): Vite dev server integration with HMR
- Production mode (`server/index-prod.ts`): Serves pre-built static assets from `dist/public/`

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver with WebSocket support.

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Design** (defined in `shared/schema.ts`):

1. **Users Table**: 
   - Fields: id (UUID), email, username, passwordHash, isAdmin, createdAt
   - Supports both customer and admin accounts

2. **Gift Card Submissions Table**:
   - Fields: cardType, region, amount, cardCode, imageUrls (array), bankName, accountNumber, accountName, customerEmail, status (pending/verified/paid/rejected)
   - Tracks customer gift card trade submissions

3. **Crypto Trades Table**:
   - Fields: tradeType (buy/sell), coin, amount, transactionHash, bankName, accountNumber, accountName, customerEmail, status
   - Manages cryptocurrency buy/sell requests

4. **Gadget Submissions Table**:
   - Fields: deviceType, brand, model, condition, description, imageUrls (array), bankName, accountNumber, accountName, customerEmail, status
   - Handles trade-in requests for devices

5. **Gadgets Table**:
   - Fields: name, price, condition, description, specs (array), imageUrl, available
   - Admin-managed inventory of gadgets available for purchase

6. **Messages Table**:
   - Fields: senderId, senderUsername, messageText, recipientId, isAdminMessage, createdAt
   - Bidirectional messaging between customers and admin

7. **Exchange Rates Table**:
   - Fields: usdToNaira, giftCardRate, btcToNaira, updatedAt
   - Admin-configurable exchange rates for platform transactions

8. **Session Table**: Automatically managed by `connect-pg-simple` for session persistence.

**Migration Strategy**: Drizzle Kit handles schema migrations with configuration in `drizzle.config.ts`. Push changes via `npm run db:push`.

### Authentication & Authorization

**User Registration/Login Flow**:
- Users register with email, username, and password
- Passwords hashed with SHA-256 before storage
- Login creates session stored in PostgreSQL
- Session ID returned as HTTP-only cookie
- `/api/auth/me` endpoint validates current session

**Admin Access**:
- Admin user initialized via `server/init-admin.ts` script
- Admin flag checked on protected routes
- Frontend uses `ProtectedAdminRoute` component wrapper
- Admin pages: trades dashboard, messages, post items, update exchange rates

### External Dependencies

**Payment Processing**: 
- Planned integration with Paystack/Flutterwave (mentioned in requirements but not yet implemented)
- Current implementation uses bank transfer details collection

**File Storage**: 
- Local filesystem storage in `uploads/` directory
- Images served as static files
- No cloud storage integration (S3, Cloudinary, etc.) currently implemented

**Messaging**:
- WhatsApp button linking to business WhatsApp (hardcoded number placeholder: 1234567890)
- In-app messaging system for customer-admin communication

**Email Notifications**: 
- Mentioned in requirements for submission confirmations
- Not yet implemented in current codebase

**Third-Party UI Libraries**:
- Radix UI primitives for accessible component foundations
- Framer Motion for animations
- React Icons for icon sets (WhatsApp, payment brands)
- date-fns for date formatting

**Development Tools**:
- Replit-specific plugins for development environment integration
- ESBuild for production bundling
- TypeScript for type safety across frontend and backend

**Environment Variables**:
- `DATABASE_URL`: Neon PostgreSQL connection string (required)
- `SESSION_SECRET`: Session encryption key (defaults to 'dev-secret-key')
- `NODE_ENV`: Environment flag (development/production)