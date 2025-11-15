// Domino transplant matching algorithm

export interface WaitlistPatient {
  id: string
  name: string
  age: number
  meld_score: number
  blood_type: string
  diagnosis: string
  comorbidities: string[]
  life_expectancy_months: number
}

export interface PatientB {
  metabolic_disease: string
  liver_function: string
  blood_type: string
  age: number
}

export interface MatchResult {
  patient: WaitlistPatient
  score: number
  reasons: string[]
  explanation?: string
}

export function calculateMatchScore(patient: WaitlistPatient, patientB: PatientB): { score: number; reasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // Age scoring (60-75 preferred)
  if (patient.age >= 60 && patient.age <= 75) {
    score += 30
    reasons.push(`Optimal age (${patient.age}) - limited natural life expectancy means metabolic disease may not manifest`)
  } else if (patient.age >= 55 && patient.age < 60) {
    score += 20
    reasons.push(`Good age (${patient.age}) - reasonable life expectancy`)
  } else if (patient.age > 75) {
    score += 25
    reasons.push(`Advanced age (${patient.age}) - very limited life expectancy`)
  } else {
    score += 5
    reasons.push(`Younger patient (${patient.age}) - metabolic disease may manifest during lifetime`)
  }

  // MELD score (higher = more urgent = better match)
  if (patient.meld_score >= 30) {
    score += 25
    reasons.push(`High MELD score (${patient.meld_score}) - critical need, will die soon without transplant`)
  } else if (patient.meld_score >= 25) {
    score += 20
    reasons.push(`Elevated MELD score (${patient.meld_score}) - urgent need`)
  } else if (patient.meld_score >= 20) {
    score += 15
    reasons.push(`Moderate MELD score (${patient.meld_score}) - significant need`)
  } else {
    score += 5
    reasons.push(`Lower MELD score (${patient.meld_score}) - less urgent`)
  }

  // Life expectancy without transplant (<6 months optimal)
  if (patient.life_expectancy_months <= 6) {
    score += 20
    reasons.push(`Very limited life expectancy (${patient.life_expectancy_months} months) - immediate need`)
  } else if (patient.life_expectancy_months <= 12) {
    score += 15
    reasons.push(`Limited life expectancy (${patient.life_expectancy_months} months)`)
  } else {
    score += 5
    reasons.push(`Longer life expectancy (${patient.life_expectancy_months} months) - less urgent`)
  }

  // Comorbidities that might kill before metabolic disease manifests
  const highRiskComorbidities = ['diabetes', 'heart disease', 'kidney disease', 'cancer']
  const hasHighRiskComorbidity = patient.comorbidities.some(c => 
    highRiskComorbidities.some(hr => c.toLowerCase().includes(hr))
  )
  
  if (hasHighRiskComorbidity) {
    score += 15
    const matchingComorbidities = patient.comorbidities.filter(c =>
      highRiskComorbidities.some(hr => c.toLowerCase().includes(hr))
    )
    reasons.push(`High-risk comorbidities (${matchingComorbidities.join(', ')}) - likely to die before metabolic disease manifests`)
  }

  // Blood type compatibility
  if (patient.blood_type === patientB.blood_type) {
    score += 10
    reasons.push(`Blood type match (${patient.blood_type})`)
  } else {
    // Check for compatible types (simplified)
    const compatibleTypes: { [key: string]: string[] } = {
      'O': ['O', 'A', 'B', 'AB'],
      'A': ['A', 'AB'],
      'B': ['B', 'AB'],
      'AB': ['AB']
    }
    if (compatibleTypes[patientB.blood_type]?.includes(patient.blood_type)) {
      score += 10
      reasons.push(`Compatible blood type (${patient.blood_type} can receive from ${patientB.blood_type})`)
    } else {
      score -= 50 // Incompatible
      reasons.push(`Incompatible blood type - disqualifying factor`)
    }
  }

  // Expected lifespan with domino liver (>10 years valuable)
  // Estimate based on age and comorbidities
  const estimatedLifespanWithDomino = Math.max(0, 80 - patient.age - (hasHighRiskComorbidity ? 5 : 0))
  if (estimatedLifespanWithDomino >= 10) {
    score += 10
    reasons.push(`Expected to gain significant years of life (estimated ${estimatedLifespanWithDomino}+ years)`)
  } else if (estimatedLifespanWithDomino >= 5) {
    score += 5
    reasons.push(`Expected to gain moderate years of life (estimated ${estimatedLifespanWithDomino} years)`)
  }

  return { score: Math.max(0, Math.min(100, score)), reasons }
}

export function findTopMatches(
  waitlist: WaitlistPatient[],
  patientB: PatientB,
  topN: number = 10
): MatchResult[] {
  const matches: MatchResult[] = waitlist.map(patient => {
    const { score, reasons } = calculateMatchScore(patient, patientB)
    return {
      patient,
      score,
      reasons,
    }
  })

  // Filter out incompatible matches (score < 0)
  const compatibleMatches = matches.filter(m => m.score > 0)

  // Sort by score descending
  compatibleMatches.sort((a, b) => b.score - a.score)

  // Return top N
  return compatibleMatches.slice(0, topN)
}

