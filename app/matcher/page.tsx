'use client'

import { useState } from 'react'
import { Upload, FileText, Sparkles } from 'lucide-react'
import { findTopMatches, type WaitlistPatient, type PatientB, type MatchResult } from '@/lib/matching'
import Papa from 'papaparse'

export default function MatcherPage() {
  const [patientB, setPatientB] = useState<PatientB>({
    metabolic_disease: 'FAP',
    liver_function: 'good',
    blood_type: 'O',
    age: 42,
  })
  const [waitlist, setWaitlist] = useState<WaitlistPatient[]>([])
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const patients: WaitlistPatient[] = results.data
          .filter((row: any) => row.name && row.age)
          .map((row: any) => ({
            id: row.id || Math.random().toString(),
            name: row.name || 'Unknown',
            age: parseInt(row.age) || 0,
            meld_score: parseInt(row.meld_score || row.meld) || 0,
            blood_type: row.blood_type || 'O',
            diagnosis: row.diagnosis || 'Liver failure',
            comorbidities: row.comorbidities ? row.comorbidities.split(',').map((c: string) => c.trim()) : [],
            life_expectancy_months: parseInt(row.life_expectancy_months || row.life_expectancy) || 12,
          }))
        setWaitlist(patients)
      },
    })
  }

  const handleMatch = async () => {
    if (waitlist.length === 0) {
      alert('Please upload a waitlist CSV file first')
      return
    }

    setLoading(true)
    try {
      const topMatches = findTopMatches(waitlist, patientB, 10)
      
      // Generate AI explanations for top 3 matches using API route
      for (let i = 0; i < Math.min(3, topMatches.length); i++) {
        try {
          const response = await fetch('/api/match-explanation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient: topMatches[i].patient,
              score: topMatches[i].score,
              reasons: topMatches[i].reasons,
            }),
          })
          const data = await response.json()
          topMatches[i].explanation = data.explanation
        } catch (error) {
          console.error('Error generating explanation:', error)
          topMatches[i].explanation = 'This patient is a good candidate for domino transplant based on the matching criteria.'
        }
      }

      setMatches(topMatches)
    } catch (error) {
      console.error('Error matching:', error)
      alert('Error performing match. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Domino Candidate Matcher</h1>
        <p className="text-gray-600 mb-8">
          Upload Patient B details and waitlist data to find optimal domino recipients
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Patient B Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Patient B (Metabolic Disease Donor)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metabolic Disease Type
                </label>
                <select
                  value={patientB.metabolic_disease}
                  onChange={(e) => setPatientB({ ...patientB, metabolic_disease: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="FAP">FAP (Familial Amyloid Polyneuropathy)</option>
                  <option value="Metabolic">Other Metabolic Disease</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  value={patientB.blood_type}
                  onChange={(e) => setPatientB({ ...patientB, blood_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="O">O</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={patientB.age}
                  onChange={(e) => setPatientB({ ...patientB, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Waitlist Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Waitlist Data (CSV)</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Upload CSV File
              </label>
              {csvFile && (
                <p className="mt-4 text-sm text-gray-600">
                  {csvFile.name} ({waitlist.length} patients loaded)
                </p>
              )}
              <p className="mt-4 text-xs text-gray-500">
                CSV should include: name, age, meld_score, blood_type, diagnosis, comorbidities, life_expectancy_months
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleMatch}
            disabled={loading || waitlist.length === 0}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'Matching...' : 'Find Top Matches'}
          </button>
        </div>

        {/* Results */}
        {matches.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Top 10 Matches</h2>
            <div className="space-y-4">
              {matches.map((match, index) => (
                <div
                  key={match.patient.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold">
                        #{index + 1} {match.patient.name}
                      </h3>
                      <p className="text-gray-600">
                        Age {match.patient.age} • MELD {match.patient.meld_score} • {match.patient.blood_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{match.score}/100</div>
                      <div className="text-sm text-gray-500">Match Score</div>
                    </div>
                  </div>
                  
                  {match.explanation && (
                    <div className="bg-blue-50 rounded p-3 mb-3">
                      <p className="text-sm text-gray-700">{match.explanation}</p>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-sm font-semibold mb-2">Key Reasons:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {match.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                    <p><strong>Diagnosis:</strong> {match.patient.diagnosis}</p>
                    <p><strong>Life Expectancy:</strong> {match.patient.life_expectancy_months} months without transplant</p>
                    {match.patient.comorbidities.length > 0 && (
                      <p><strong>Comorbidities:</strong> {match.patient.comorbidities.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

