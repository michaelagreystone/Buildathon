# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DominoMatch is an AI-powered platform for optimizing domino liver transplant matching and coordination. The application identifies optimal domino recipients, calculates personalized survival probabilities, coordinates multi-patient logistics, and generates patient-friendly decision support materials.

**Key Mission**: Increase domino transplant utilization from 10-15% to 40-50%, potentially saving 1,500+ additional lives annually.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linter
npm run lint
```

### Environment Setup
Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `OPENAI_API_KEY` - OpenAI API key for GPT-4

Note: The app works with mock data if Supabase is not configured. OpenAI API failures gracefully fall back to default explanations.

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router (not Pages Router)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with custom gradient backgrounds
- **State**: React hooks (no external state management)
- **AI**: OpenAI GPT-4 for natural language explanations
- **Backend**: Supabase (PostgreSQL) - optional, falls back to mock data
- **Charts**: Recharts for survival probability curves
- **PDF**: @react-pdf/renderer for consent form generation
- **CSV**: PapaParse for waitlist data parsing

### Project Structure
```
app/                          # Next.js 14 App Router pages
├── page.tsx                  # Homepage with feature overview
├── layout.tsx                # Root layout with Navbar
├── globals.css               # Global Tailwind styles
├── matcher/page.tsx          # Domino candidate matching tool
├── calculator/page.tsx       # Survival probability calculator
├── consent/page.tsx          # AI-powered consent form generator
└── dashboard/page.tsx        # Multi-patient chain coordinator

components/
└── Navbar.tsx                # Global navigation component

lib/                          # Core business logic
├── matching.ts               # Domino matching algorithm (5-factor scoring)
├── openai.ts                 # GPT-4 API wrapper functions
└── supabase.ts               # Supabase client and type definitions

data/
└── sample-waitlist.csv       # Demo data with 20 realistic patient records
```

### Routing
This project uses Next.js 14 App Router (not Pages Router). All pages are in `app/` directory:
- `/` - Homepage with feature showcase
- `/matcher` - Candidate Matcher
- `/calculator` - Survival Calculator with PDF export
- `/consent` - Consent Generator with visual timeline
- `/dashboard` - Chain Coordinator
- `/predictor` - Outcome Predictor (bonus feature)

API routes (for server-side AI calls):
- `/api/match-explanation` - POST endpoint for GPT-4 match explanations
- `/api/generate-consent` - POST endpoint for GPT-4 consent form generation

## Core Business Logic

### Domino Matching Algorithm (lib/matching.ts)
The matching algorithm scores waitlist patients based on 5 factors:
1. **Age** (30 points max): Prefers 60-75 age range where metabolic disease unlikely to manifest
2. **MELD Score** (25 points max): Higher urgency = better match (critical need patients)
3. **Life Expectancy** (20 points max): <6 months preferred (immediate need)
4. **Comorbidities** (15 points max): Diabetes, heart disease, kidney disease, cancer increase score
5. **Blood Type Compatibility** (10 points): Must be compatible (incompatibility = -50 points, disqualifying)

Additional scoring for estimated lifespan gain (10 points max).

**Key Function**: `findTopMatches(waitlist, patientB, topN)` returns ranked matches with scores and reasoning.

### OpenAI Integration (Secure API Routes)
**IMPORTANT**: OpenAI API calls are made server-side via Next.js API routes to protect the API key.

API Routes (`app/api/`):
1. `/api/match-explanation` - POST endpoint that calls GPT-4 to generate natural language explanations for match candidates
2. `/api/generate-consent` - POST endpoint that calls GPT-4 to create patient-friendly consent forms

Both routes include error handling with graceful fallbacks to default text if API fails.

**Security**: API key is only exposed server-side via `process.env.OPENAI_API_KEY`, never client-side.

### Data Types
See `lib/matching.ts` for:
- `WaitlistPatient` - Patient on transplant waitlist
- `PatientB` - Patient with metabolic disease donating liver
- `MatchResult` - Match with score, reasons, and AI explanation

See `lib/supabase.ts` for:
- `Patient` - Database patient schema
- `DominoChain` - Multi-patient transplant chain tracking

## Key Features

### 1. Candidate Matcher (/matcher)
- CSV upload for waitlist data (uses PapaParse)
- Patient B profile input form
- Real-time AI-powered matching (sub-second for typical waitlists)
- Top 10 matches with scores and explanations
- GPT-4 generated natural language justifications for top matches

**Data Flow**: Upload CSV → Parse → Run matching algorithm → Display ranked results → User clicks match → Fetch GPT-4 explanation

### 2. Survival Calculator (/calculator)
- Interactive patient data input
- Dual survival curves using Recharts (wait vs. domino scenarios)
- Real-time calculation of expected life years gained
- Visual timeline showing metabolic disease onset
- Comparison of survival probabilities over time
- **PDF Export**: Comprehensive survival report with all metrics and comparisons

**Chart Library**: Uses Recharts LineChart with Area fills for survival probability visualization.
**PDF Export**: Uses @react-pdf/renderer to generate downloadable reports with patient data, survival curves data table, and key trade-offs.

### 3. Consent Generator (/consent)
- Patient B and Patient C data input
- GPT-4 powered personalized consent form generation (via API route)
- PDF export using @react-pdf/renderer
- **Visual Timeline**: Interactive 5-milestone timeline showing disease progression
  - Year 0: Transplant (85% survival, green)
  - Year 5: Normal function (75% survival, green)
  - Year 10: Still healthy (65% survival, yellow)
  - Year 12-15: Symptoms may appear (orange)
  - Year 15+: Treatment available (orange)
- Advantages vs. Considerations boxes for easy comparison
- Patient-friendly language with visual elements
- Structured to support multi-language expansion

### 4. Chain Coordinator (/dashboard)
- Timeline view for 3-party coordination (Donor A → Patient B → Patient C)
- Real-time status tracking (planning/scheduled/in_progress/completed/cancelled)
- Cold ischemia time monitoring (8-hour surgical window)
- Alert system for timing conflicts
- Color-coded status indicators
- Summary statistics (active chains, on schedule, at risk, completed)

**Critical Constraint**: Cold ischemia time = 8 hours max between organ retrieval and final transplant.

### 5. Outcome Predictor (/predictor) - BONUS FEATURE
- Interactive patient profile input (age, MELD, disease type, comorbidities)
- **Personalized prediction**: AI-calculated 10-year survival probability
- **Historical data analysis**: Based on 287 mock historical domino transplant cases
- Visualizations using Recharts:
  - Bar chart: Success rates by age group
  - Pie chart: Long-term outcome distribution (successful, symptoms managed, re-transplant)
  - Horizontal bar chart: Impact of comorbidities on survival
- Similar patient matching ("120 cases in your age group")
- Risk factor identification
- Key insights display (overall success rate, optimal age range, symptom onset timeline)

**Prediction Algorithm**: Multi-factor scoring based on age, MELD score, comorbidities, and metabolic disease type.

## Important Constraints & Patterns

### Medical Domain Knowledge
- **MELD Score**: 6-40 scale, measures liver disease severity. 30+ = critical (likely to die within weeks)
- **Domino Transplant**: Patient B with metabolic disease gets new liver, donates their structurally healthy liver to Patient C
- **Metabolic Diseases**: FAP, Alkaptonuria typically manifest symptoms 10-20+ years after transplant
- **Blood Type Compatibility**: O is universal donor, AB is universal recipient

### UI/UX Patterns
- Background gradient: `bg-gradient-to-br from-blue-50 to-indigo-100`
- Card-based layouts with white backgrounds and shadows
- Lucide React icons throughout
- Responsive design with Tailwind utilities
- Professional medical aesthetic (blues, clean typography)

### Error Handling
- OpenAI API calls have try-catch with fallback messages
- Supabase is optional - app works without database connection
- CSV parsing includes validation
- Blood type incompatibility is explicitly handled (disqualifying factor)

### Performance Considerations
- Matching algorithm is synchronous and fast (no async needed for typical waitlists)
- AI explanations are generated on-demand (not pre-computed)
- Charts use Recharts which handles rendering optimization
- No server-side rendering for data-heavy pages (all client-side)

## Development Guidelines

### Security Best Practices
- **NEVER expose API keys client-side** - always use API routes for external API calls
- OpenAI API calls must go through `/api/match-explanation` or `/api/generate-consent`
- Supabase keys are public (NEXT_PUBLIC_*) by design, but use Row Level Security in production
- Never commit `.env.local` - only `.env.example`

### When Adding Features
- Patient safety is paramount - be conservative with medical calculations
- Always provide clear explanations for scoring/matching decisions
- Maintain fallback behavior if external services fail (app should work without API keys)
- Use TypeScript strict mode - all types must be defined
- Follow existing patterns for consistency (card layouts, color schemes)
- All new pages should be added to Navbar component
- PDF exports should use @react-pdf/renderer (already configured)
- Charts should use Recharts (already configured)

### Working with Data
- Sample data is in `data/sample-waitlist.csv` (20 realistic patients)
- MELD scores range 15-40 (realistic distribution)
- Blood types: O (45%), A (40%), B (10%), AB (5%)
- Life expectancy: 3-24 months typical range for waitlist patients

### AI Integration Best Practices
- Keep prompts clear and medically accurate
- Include context (patient details, scores, reasons) in prompts
- Use temperature 0.7 for natural but consistent responses
- Set max_tokens appropriately (200 for explanations, 1000 for forms)
- Always handle API failures gracefully

### Testing the Application
1. Use `data/sample-waitlist.csv` for matcher testing
2. Test edge cases: incompatible blood types, extreme ages, very high/low MELD scores
3. Verify cold ischemia time alerts in dashboard (8-hour window)
4. Test PDF generation without OpenAI API key (should use fallback)
5. Confirm app works without Supabase configured

## Demo/Pitch Context

This is a buildathon project with a specific demo flow (see DEMO_GUIDE.md):
1. Show matching: FAP patient → find optimal recipient (67yo with diabetes, MELD 32)
2. Show decision support: Visualize 9.4 years of life gained
3. Show coordination: 3-party timeline with timing alerts

**Target metrics**: 1,500 lives saved annually, $600K ARR at $200/month per transplant center (250+ centers in US).
