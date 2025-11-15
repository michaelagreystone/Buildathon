import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: Request) {
  try {
    const { patient, score, reasons } = await request.json()

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
${reasons.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

Write a clear, compassionate explanation (2-3 sentences) for why this patient is an optimal domino recipient. Use professional but accessible language.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a medical professional explaining transplant decisions with empathy and clarity.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const explanation = completion.choices[0]?.message?.content || 'This patient is a good candidate for domino transplant.'

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { explanation: 'This patient is a good candidate for domino transplant based on the matching criteria.' },
      { status: 200 } // Still return 200 with fallback
    )
  }
}
