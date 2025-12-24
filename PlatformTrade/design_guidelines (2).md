# JTECH Trading World - Design Guidelines

## Design Approach

**Selected System**: Material Design 3 principles with inspiration from fintech platforms (Coinbase, PayPal, Stripe)

**Rationale**: Trading platform requiring trust, clarity, and efficient transaction flows. Material Design provides excellent form patterns, visual feedback systems, and professional aesthetics suitable for financial services.

---

## Typography System

**Font Families** (via Google Fonts):
- Primary: Inter (clean, professional, excellent readability)
- Headings: Inter (weights: 600, 700)
- Body: Inter (weights: 400, 500)
- UI Elements: Inter (weights: 500, 600)

**Type Scale**:
- Hero/Page Titles: text-4xl md:text-5xl font-bold
- Section Headings: text-2xl md:text-3xl font-semibold
- Card Headers: text-xl font-semibold
- Body Text: text-base
- Form Labels: text-sm font-medium
- Helper Text: text-sm
- Button Text: text-sm md:text-base font-medium

---

## Layout System

**Spacing Units**: Tailwind units of 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, mt-8, py-12, space-y-16, py-24)

**Container Strategy**:
- Full-width sections with inner max-w-7xl mx-auto px-4
- Form containers: max-w-3xl mx-auto
- Dashboard grids: max-w-7xl mx-auto

**Grid Patterns**:
- Service Cards: grid grid-cols-1 md:grid-cols-3 gap-6
- Form Sections: Single column for clarity
- Dashboard: grid grid-cols-1 lg:grid-cols-3 gap-4 (sidebar + main content)
- Gadgets Display: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6

---

## Component Library

### Navigation
- Fixed top navbar with logo left, main nav center, WhatsApp/profile right
- Mobile: Hamburger menu with slide-out drawer
- Height: h-16 md:h-20
- Services dropdown mega-menu showing all three services

### Hero Section
- Height: min-h-[500px] md:min-h-[600px]
- Image: Professional workspace/technology imagery (blurred background)
- Content: Centered with headline, subtitle, dual CTA buttons with backdrop-blur-lg bg-white/10 treatment
- Trust indicators below CTAs: "Trusted by 5,000+ customers" with small icons

### Service Cards (Homepage)
- Three prominent cards for Gift Cards, Crypto, Gadgets
- Each card: Icon, title, 2-3 feature bullets, "Get Started" button
- Elevated appearance with shadow-lg, hover:shadow-xl transition
- Border-l-4 accent line (different for each service)

### Forms (Critical Component)
**Structure**: Multi-step where appropriate
- Gift Card Form: 5 steps (Card Type → Region → Amount → Upload → Payment Details)
- Crypto Form: 3 steps (Buy/Sell → Details → Confirmation)
- Gadget Trade-in: 4 steps (Device Type → Details → Images → Contact)

**Form Elements**:
- Labels: Always above inputs, font-medium text-sm
- Inputs: h-12, rounded-lg, border-2, focus:ring-2 focus:ring-offset-2
- File uploads: Drag-and-drop zone with preview thumbnails
- Select dropdowns: Custom styled with chevron icons
- Progress indicator: Steps at top with connecting lines
- Validation: Inline error messages, red border on error state

### Payment Integration
- Stripe Elements embedded with consistent styling
- Payment summary card: Border, shadow-md, showing breakdown
- Security badges: "Secured by Stripe" + SSL icon
- Alternative payment: Prominent "Pay with Card" vs "Bank Transfer" toggle

### Product Cards (Gadgets)
- Image: aspect-video, rounded-t-lg
- Content: p-4 space-y-2
- Title: text-lg font-semibold
- Price: text-2xl font-bold
- Specs: List with checkmarks
- Condition badge: Top-right absolute positioned
- CTA: Full-width button at bottom

### Admin Dashboard
- Sidebar: w-64, fixed, with navigation links
- Stats Cards: 4-column grid showing pending/completed counts
- Tables: Striped rows, hover:bg-gray-50, action buttons right-aligned
- Status badges: Rounded-full px-3 py-1 text-xs font-medium
- Filters: Top of table with date range, status dropdowns

### WhatsApp Integration
- Floating Action Button: fixed bottom-8 right-8, rounded-full, w-14 h-14
- Icon: WhatsApp logo (Font Awesome)
- Shadow: shadow-2xl with hover:scale-110 transition
- Mobile: bottom-4 right-4

### Trust Elements
- Reviews section: Cards with star ratings, customer photos, testimonials
- Security badges: Footer with SSL, payment provider logos
- Transaction counter: "15,234 transactions completed"
- Response time indicator: "Average response: 15 minutes"

---

## Page Structures

### Homepage
1. Hero with background image
2. Three service cards (Gift Cards, Crypto, Gadgets)
3. How It Works (4 steps with icons)
4. Featured Gadgets (8-item grid)
5. Customer Reviews (3-column testimonials)
6. CTA section with contact options

### Service Pages (Gift Cards/Crypto/Gadgets)
1. Page header with breadcrumb
2. Service explanation (2-column: text + illustration)
3. Main form (centered, max-w-3xl)
4. FAQ accordion
5. Support section

### Gadgets Marketplace
1. Filters sidebar (collapsible on mobile)
2. Sort options bar
3. Product grid (responsive columns)
4. Pagination
5. "Request Gadget" CTA if not found

### Admin Dashboard
1. Top stats row (4 cards)
2. Recent activity feed
3. Tabbed interface (Gift Cards | Crypto | Gadgets)
4. Data tables with sorting, filtering
5. Quick actions (Approve, Reject, Contact Customer)

---

## Icons

**Library**: Heroicons (outline and solid variants via CDN)

**Usage**:
- Navigation: 24px outline icons
- Service cards: 48px feature icons
- Form inputs: 20px left-aligned icons
- Status badges: 16px inline icons
- Buttons: 20px with text

---

## Imagery

**Hero Section**: Professional workspace image showing laptop, phone, and modern office environment (conveys trust and technology)

**Service Icons**: Large illustrative icons for Gift Cards (card stack), Crypto (coin with graph), Gadgets (devices collage)

**Product Images**: High-quality gadget photos with white/neutral backgrounds, consistent aspect ratio

**Trust Elements**: Real customer photos for testimonials (circular avatars)

**Payment Logos**: Stripe, Visa, Mastercard, PayPal official logos in footer

---

## Interaction Patterns

- Form progression: Smooth transitions between steps
- Loading states: Skeleton screens for product grids, spinner for form submission
- Success feedback: Checkmark animation + confirmation message
- Error handling: Shake animation + inline error text
- Hover states: Subtle scale (1.02), shadow increase
- Mobile gestures: Swipeable product cards, collapsible sections

---

## Responsive Breakpoints

- Mobile: Base styles (< 768px) - stacked layouts, full-width forms
- Tablet: md: (768px+) - 2-column grids, expanded navigation
- Desktop: lg: (1024px+) - 3-4 column grids, sidebar layouts
- Large: xl: (1280px+) - Maximum content width enforced