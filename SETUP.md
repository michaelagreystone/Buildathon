# Setup Instructions for DominoMatch

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- OpenAI API key

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key
```

### Getting Supabase Credentials:
1. Go to https://supabase.com
2. Create a new project (or use existing)
3. Go to Settings → API
4. Copy "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy "anon public" key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Getting OpenAI API Key:
1. Go to https://platform.openai.com
2. Navigate to API Keys
3. Create a new secret key
4. Copy the key → `OPENAI_API_KEY`

## Step 3: Set Up Supabase Database (Optional)
The app works with mock data, but if you want to use Supabase:

1. Go to your Supabase project SQL Editor
2. Run this SQL to create tables:

```sql
-- Patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  meld_score INTEGER NOT NULL,
  blood_type TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  comorbidities TEXT[],
  life_expectancy_months INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domino chains table
CREATE TABLE domino_chains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_a_id TEXT,
  patient_b_id TEXT,
  patient_c_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('planning', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  surgery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 4: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Features

### 1. Candidate Matcher
- Go to `/matcher`
- Upload `data/sample-waitlist.csv`
- Set Patient B details
- Click "Find Top Matches"

### 2. Survival Calculator
- Go to `/calculator`
- Adjust patient parameters
- View survival curves

### 3. Consent Generator
- Go to `/consent`
- Enter patient details
- Generate and download PDF

### 4. Dashboard
- Go to `/dashboard`
- View domino chain coordination

## Troubleshooting

### OpenAI API Errors
- Make sure your API key is valid
- Check you have credits in your OpenAI account
- The app will fall back to default explanations if API fails

### Supabase Connection Issues
- Verify your URL and anon key are correct
- Check that your Supabase project is active
- The app works without Supabase (uses mock data)

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run dev`

## For Lovable Integration
If using Lovable, you can:
1. Import this codebase
2. Connect your Supabase project
3. Add your OpenAI API key in Lovable's environment settings
4. Deploy directly from Lovable

## Demo Data
Sample waitlist CSV is available at `data/sample-waitlist.csv` with 20 realistic patient records for testing.

