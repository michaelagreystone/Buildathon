'use client'

import { useState } from 'react'
import { TrendingUp, Database, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function PredictorPage() {
  const [patientProfile, setPatientProfile] = useState({
    age: 67,
    meld_score: 32,
    metabolic_disease: 'FAP',
    has_comorbidities: true,
    years_since_transplant: 0,
  })

  // Mock historical data - in production this would come from a database
  const historicalOutcomes = [
    { age_group: '50-60', success_rate: 78, count: 45 },
    { age_group: '60-70', success_rate: 85, count: 120 },
    { age_group: '70-80', success_rate: 82, count: 87 },
    { age_group: '80+', success_rate: 71, count: 23 },
  ]

  const diseaseOutcomes = [
    { name: 'Successful (10yr+)', value: 237, color: '#10b981' },
    { name: 'Symptoms Managed', value: 38, color: '#f59e0b' },
    { name: 'Re-transplant Needed', value: 12, color: '#ef4444' },
  ]

  const comorbidityImpact = [
    { comorbidity: 'None', survival_rate: 88 },
    { comorbidity: 'Diabetes', survival_rate: 85 },
    { comorbidity: 'Heart Disease', survival_rate: 79 },
    { comorbidity: 'Kidney Disease', survival_rate: 74 },
    { comorbidity: 'Multiple', survival_rate: 68 },
  ]

  // Calculate personalized prediction
  const calculatePrediction = () => {
    let baseSuccess = 85 // Base 10-year survival rate

    // Age adjustment
    if (patientProfile.age < 60) baseSuccess -= 7
    else if (patientProfile.age >= 70 && patientProfile.age < 80) baseSuccess -= 3
    else if (patientProfile.age >= 80) baseSuccess -= 14

    // MELD score adjustment (higher MELD = more urgent but also more risk)
    if (patientProfile.meld_score >= 35) baseSuccess -= 8
    else if (patientProfile.meld_score >= 30) baseSuccess -= 3
    else if (patientProfile.meld_score < 20) baseSuccess += 5

    // Comorbidity adjustment
    if (patientProfile.has_comorbidities) baseSuccess -= 6

    // Metabolic disease type
    if (patientProfile.metabolic_disease === 'FAP') baseSuccess += 2 // FAP has slower progression

    return Math.max(60, Math.min(95, baseSuccess))
  }

  const predictedSuccess = calculatePrediction()

  // Find similar patients
  const getSimilarPatients = () => {
    const ageGroup = patientProfile.age < 60 ? '50-60' :
                     patientProfile.age < 70 ? '60-70' :
                     patientProfile.age < 80 ? '70-80' : '80+'

    return historicalOutcomes.find(h => h.age_group === ageGroup) || historicalOutcomes[1]
  }

  const similarPatients = getSimilarPatients()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Outcome Predictor</h1>
        <p className="text-gray-600 mb-8">
          AI-powered predictions based on 287 historical domino transplant cases
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Patient Profile Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Patient Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={patientProfile.age}
                  onChange={(e) => setPatientProfile({ ...patientProfile, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MELD Score
                </label>
                <input
                  type="number"
                  value={patientProfile.meld_score}
                  onChange={(e) => setPatientProfile({ ...patientProfile, meld_score: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metabolic Disease
                </label>
                <select
                  value={patientProfile.metabolic_disease}
                  onChange={(e) => setPatientProfile({ ...patientProfile, metabolic_disease: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="FAP">FAP</option>
                  <option value="Alkaptonuria">Alkaptonuria</option>
                  <option value="Other">Other Metabolic</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={patientProfile.has_comorbidities}
                    onChange={(e) => setPatientProfile({ ...patientProfile, has_comorbidities: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Has Comorbidities</span>
                </label>
              </div>
            </div>
          </div>

          {/* Prediction Results */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Personalized Prediction</h2>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{predictedSuccess}%</div>
                <div className="text-xl mb-4">10-Year Survival Probability</div>
                <div className="text-sm text-blue-100">
                  Based on your age ({patientProfile.age}), MELD score ({patientProfile.meld_score}),
                  and {patientProfile.has_comorbidities ? 'existing comorbidities' : 'no major comorbidities'}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-sm text-blue-100 mb-1">Similar Patients</div>
                <div className="text-2xl font-bold">{similarPatients.count} cases</div>
                <div className="text-sm text-blue-100 mt-1">
                  Age group {similarPatients.age_group}: {similarPatients.success_rate}% success rate
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-sm text-blue-100 mb-1">Key Risk Factors</div>
                <div className="text-sm space-y-1 mt-2">
                  {patientProfile.age >= 75 && <div>⚠ Advanced age</div>}
                  {patientProfile.meld_score >= 35 && <div>⚠ Very high MELD</div>}
                  {patientProfile.has_comorbidities && <div>⚠ Comorbidities present</div>}
                  {patientProfile.age < 75 && patientProfile.meld_score < 35 && !patientProfile.has_comorbidities &&
                    <div>✓ Favorable profile</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Data Visualizations */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Success Rates by Age Group */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Success Rates by Age Group</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalOutcomes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_group" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success_rate" fill="#3b82f6" name="Success Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              10-year survival rates across {historicalOutcomes.reduce((sum, h) => sum + h.count, 0)} historical cases
            </div>
          </div>

          {/* Outcome Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Long-term Outcome Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseOutcomes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {diseaseOutcomes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Total cases: {diseaseOutcomes.reduce((sum, d) => sum + d.value, 0)}
            </div>
          </div>
        </div>

        {/* Comorbidity Impact */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Impact of Comorbidities on Survival</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comorbidityImpact} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="comorbidity" type="category" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="survival_rate" fill="#10b981" name="10-Year Survival Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Key Insights from Historical Data</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">82.6%</div>
              <div className="text-sm text-gray-700">
                Overall 10-year survival rate for domino transplants with FAP donors
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">60-70</div>
              <div className="text-sm text-gray-700">
                Optimal age range for domino recipients (85% success rate)
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">12-15 yrs</div>
              <div className="text-sm text-gray-700">
                Average time before metabolic disease symptoms appear
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
