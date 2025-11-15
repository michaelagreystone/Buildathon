import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Patient {
  id: string
  name: string
  age: number
  meld_score: number
  blood_type: string
  diagnosis: string
  comorbidities: string[]
  life_expectancy_months: number
  created_at: string
}

export interface DominoChain {
  id: string
  donor_a_id: string
  patient_b_id: string
  patient_c_id: string
  status: 'planning' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  surgery_date: string
  created_at: string
}

