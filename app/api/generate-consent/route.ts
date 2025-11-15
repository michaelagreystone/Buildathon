import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: Request) {
  try {
    const { patientB, patientC, metabolicDisease } = await request.json()

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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a medical professional creating patient-friendly consent forms.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content || 'Consent form content'

    return NextResponse.json({ content })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { content: 'Consent form content could not be generated at this time. Please refer to the standard consent form template.' },
      { status: 200 } // Still return 200 with fallback
    )
  }
}
