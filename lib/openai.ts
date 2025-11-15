import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function generateMatchExplanation(patient: any, score: number, reasons: string[]) {
  const prompt = `You are a medical transplant coordinator explaining why a patient is an optimal candidate for a domino liver transplant.

Patient Details:
- Name: ${patient.name}
- Age: ${patient.age}
- MELD Score: ${patient.meld_score}
- Diagnosis: ${patient.diagnosis}
- Comorbidities: ${patient.comorbidities?.join(', ') || 'None'}
- Life Expectancy Without Transplant: ${patient.life_expectancy_months} months

Match Score: ${score}/100

Key Reasons:
${reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Write a clear, compassionate explanation (2-3 sentences) for why this patient is an optimal domino recipient. Use professional but accessible language.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a medical professional explaining transplant decisions with empathy and clarity.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return completion.choices[0]?.message?.content || 'This patient is a good candidate for domino transplant.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    return 'This patient is a good candidate for domino transplant based on the matching criteria.'
  }
}

export async function generateConsentForm(patientB: any, patientC: any, metabolicDisease: string) {
  const prompt = `Generate a patient-friendly informed consent form for a domino liver transplant.

Patient C (Recipient) Details:
- Age: ${patientC.age}
- Current Diagnosis: ${patientC.diagnosis}
- MELD Score: ${patientC.meld_score}
- Life Expectancy Without Transplant: ${patientC.life_expectancy_months} months

Metabolic Disease from Patient B: ${metabolicDisease}

Create a clear, compassionate consent form that explains:
1. What a domino transplant is (in simple terms)
2. The specific risks of receiving a liver with ${metabolicDisease}
3. When symptoms might appear (timeline)
4. Comparison to waiting for a standard donor
5. Expected benefits and risks

Use layman's terms, be empathetic, and include key statistics. Format as a structured document.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a medical professional creating patient-friendly consent forms.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0]?.message?.content || 'Consent form content'
  } catch (error) {
    console.error('OpenAI API error:', error)
    return 'Consent form content could not be generated at this time.'
  }
}

