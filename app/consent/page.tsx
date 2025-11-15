'use client'

import { useState } from 'react'
import { FileText, Download, Sparkles } from 'lucide-react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
})

function ConsentPDF({ content, patientC, patientB, metabolicDisease }: any) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Informed Consent for Domino Liver Transplant</Text>
        
        <View style={styles.section}>
          <Text style={styles.heading}>1. What is a Domino Transplant?</Text>
          <Text style={styles.paragraph}>
            A domino transplant is a special type of organ transplant where a patient with a metabolic disease 
            (Patient B) receives a healthy liver from a deceased donor (Donor A). Because Patient B's liver is 
            still functional but carries a genetic metabolic condition, it can then be transplanted to you 
            (Patient C), giving you a second chance at life.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>2. Your Current Situation</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Age:</Text> {patientC.age} years old{'\n'}
            <Text style={styles.bold}>Diagnosis:</Text> {patientC.diagnosis}{'\n'}
            <Text style={styles.bold}>MELD Score:</Text> {patientC.meld_score} (indicates urgent need for transplant){'\n'}
            <Text style={styles.bold}>Life Expectancy Without Transplant:</Text> {patientC.life_expectancy_months} months
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>3. The Metabolic Disease: {metabolicDisease}</Text>
          <Text style={styles.paragraph}>
            The liver you will receive comes from a patient with {metabolicDisease}. This means the liver 
            carries the genetic condition, but it will function normally for you for many years. However, 
            over time (typically 10-15 years), you may begin to experience symptoms of this metabolic disease.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>4. Expected Timeline</Text>
          <Text style={styles.paragraph}>
            • <Text style={styles.bold}>Years 0-10:</Text> Liver functions normally, no symptoms expected{'\n'}
            • <Text style={styles.bold}>Years 10-15:</Text> Early symptoms may begin to appear{'\n'}
            • <Text style={styles.bold}>Years 15+:</Text> Symptoms may progress, potentially requiring another transplant
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>5. Comparison to Waiting for Standard Donor</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>If you wait for a standard donor:</Text>{'\n'}
            • Only 15% chance of surviving the next 6 months{'\n'}
            • Average life expectancy: 2-3 years{'\n'}
            • High risk of death while waiting{'\n\n'}
            <Text style={styles.bold}>If you accept the domino liver:</Text>{'\n'}
            • 85% chance of immediate survival{'\n'}
            • Expected to gain 9-12 additional years of life{'\n'}
            • 70% chance of 10-year survival{'\n'}
            • Risk of metabolic disease symptoms after 10-15 years
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>6. Risks and Benefits</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Benefits:</Text>{'\n'}
            • Immediate life-saving opportunity{'\n'}
            • Significantly increased life expectancy{'\n'}
            • Opportunity to see family milestones{'\n\n'}
            <Text style={styles.bold}>Risks:</Text>{'\n'}
            • Standard transplant risks (infection, rejection, complications){'\n'}
            • Future development of metabolic disease symptoms{'\n'}
            • May require another transplant in 15-20 years
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>7. Your Decision</Text>
          <Text style={styles.paragraph}>
            This is a significant decision. We encourage you to discuss this with your family and medical team. 
            This consent form is designed to help you understand the trade-offs so you can make an informed choice.
          </Text>
        </View>

        <View style={[styles.section, { marginTop: 30 }]}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Patient Name:</Text> _________________{'\n\n'}
            <Text style={styles.bold}>Date:</Text> _________________{'\n\n'}
            <Text style={styles.bold}>Signature:</Text> _________________
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default function ConsentPage() {
  const [patientB, setPatientB] = useState({
    metabolic_disease: 'FAP',
    age: 42,
  })
  const [patientC, setPatientC] = useState({
    name: 'Michael Johnson',
    age: 67,
    meld_score: 32,
    diagnosis: 'Acute liver failure',
    life_expectancy_months: 2,
  })
  const [aiContent, setAiContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientB,
          patientC,
          metabolicDisease: patientB.metabolic_disease,
        }),
      })
      const data = await response.json()
      setAiContent(data.content)
    } catch (error) {
      console.error('Error generating consent form:', error)
      alert('Error generating consent form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Informed Consent Generator</h1>
        <p className="text-gray-600 mb-8">
          Generate patient-friendly consent forms with personalized risk timelines and visual explanations
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Patient B Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Patient B (Metabolic Disease Donor)</h2>
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

          {/* Patient C Input */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Patient C (Recipient)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={patientC.name}
                  onChange={(e) => setPatientC({ ...patientC, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={patientC.age}
                  onChange={(e) => setPatientC({ ...patientC, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MELD Score
                </label>
                <input
                  type="number"
                  value={patientC.meld_score}
                  onChange={(e) => setPatientC({ ...patientC, meld_score: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis
                </label>
                <input
                  type="text"
                  value={patientC.diagnosis}
                  onChange={(e) => setPatientC({ ...patientC, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Life Expectancy (months)
                </label>
                <input
                  type="number"
                  value={patientC.life_expectancy_months}
                  onChange={(e) => setPatientC({ ...patientC, life_expectancy_months: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            {loading ? 'Generating...' : 'Generate Consent Form'}
          </button>
        </div>

        {/* Generated Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Generated Consent Form</h2>
              <PDFDownloadLink
                document={<ConsentPDF content={aiContent} patientC={patientC} patientB={patientB} metabolicDisease={patientB.metabolic_disease} />}
                fileName="domino-consent-form.pdf"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </PDFDownloadLink>
            </div>
            
            {aiContent && (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">{aiContent}</div>
              </div>
            )}

            {/* Visual Timeline */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Risk Timeline Visualization</h3>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
                <div className="relative">
                  {/* Timeline bar */}
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-orange-500 rounded-full"></div>

                  {/* Timeline markers */}
                  <div className="relative flex justify-between items-center h-24">
                    <div className="flex flex-col items-center z-10">
                      <div className="w-4 h-4 bg-green-600 rounded-full mb-2"></div>
                      <div className="bg-white px-3 py-2 rounded shadow-md text-center">
                        <div className="text-sm font-bold">Year 0</div>
                        <div className="text-xs text-gray-600">Transplant</div>
                        <div className="text-xs text-green-600 font-semibold">85% survival</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center z-10">
                      <div className="w-4 h-4 bg-green-500 rounded-full mb-2"></div>
                      <div className="bg-white px-3 py-2 rounded shadow-md text-center">
                        <div className="text-sm font-bold">Year 5</div>
                        <div className="text-xs text-gray-600">Normal function</div>
                        <div className="text-xs text-green-600 font-semibold">75% survival</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center z-10">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mb-2"></div>
                      <div className="bg-white px-3 py-2 rounded shadow-md text-center">
                        <div className="text-sm font-bold">Year 10</div>
                        <div className="text-xs text-gray-600">Still healthy</div>
                        <div className="text-xs text-green-600 font-semibold">65% survival</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center z-10">
                      <div className="w-4 h-4 bg-orange-500 rounded-full mb-2"></div>
                      <div className="bg-white px-3 py-2 rounded shadow-md text-center">
                        <div className="text-sm font-bold">Year 12-15</div>
                        <div className="text-xs text-gray-600">Symptoms may appear</div>
                        <div className="text-xs text-orange-600 font-semibold">Early signs</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center z-10">
                      <div className="w-4 h-4 bg-orange-600 rounded-full mb-2"></div>
                      <div className="bg-white px-3 py-2 rounded shadow-md text-center">
                        <div className="text-sm font-bold">Year 15+</div>
                        <div className="text-xs text-gray-600">Manage symptoms</div>
                        <div className="text-xs text-blue-600 font-semibold">Treatment available</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/80 p-4 rounded">
                    <div className="font-bold text-green-700 mb-2">✓ Advantages</div>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Immediate life-saving opportunity</li>
                      <li>• 10-15 years of normal liver function</li>
                      <li>• Time to see family milestones</li>
                      <li>• Significantly better than waiting</li>
                    </ul>
                  </div>
                  <div className="bg-white/80 p-4 rounded">
                    <div className="font-bold text-orange-700 mb-2">⚠ Considerations</div>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Metabolic disease symptoms after 10-15 years</li>
                      <li>• Regular monitoring required</li>
                      <li>• May need future treatments</li>
                      <li>• Symptoms are typically manageable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview of PDF content */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-bold mb-4">Form Preview</h3>
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <h4 className="font-bold text-lg mb-2">1. What is a Domino Transplant?</h4>
                  <p className="text-gray-700">
                    A domino transplant is a special type of organ transplant where a patient with a metabolic disease 
                    (Patient B) receives a healthy liver from a deceased donor (Donor A). Because Patient B's liver is 
                    still functional but carries a genetic metabolic condition, it can then be transplanted to you 
                    (Patient C), giving you a second chance at life.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">2. Your Current Situation</h4>
                  <p className="text-gray-700">
                    <strong>Age:</strong> {patientC.age} years old<br />
                    <strong>Diagnosis:</strong> {patientC.diagnosis}<br />
                    <strong>MELD Score:</strong> {patientC.meld_score} (indicates urgent need for transplant)<br />
                    <strong>Life Expectancy Without Transplant:</strong> {patientC.life_expectancy_months} months
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">3. The Metabolic Disease: {patientB.metabolic_disease}</h4>
                  <p className="text-gray-700">
                    The liver you will receive comes from a patient with {patientB.metabolic_disease}. This means the liver 
                    carries the genetic condition, but it will function normally for you for many years. However, 
                    over time (typically 10-15 years), you may begin to experience symptoms of this metabolic disease.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">4. Expected Timeline</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Years 0-10:</strong> Liver functions normally, no symptoms expected</li>
                    <li><strong>Years 10-15:</strong> Early symptoms may begin to appear</li>
                    <li><strong>Years 15+:</strong> Symptoms may progress, potentially requiring another transplant</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">5. Comparison to Waiting for Standard Donor</h4>
                  <div className="text-gray-700 space-y-2">
                    <p><strong>If you wait for a standard donor:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                      <li>Only 15% chance of surviving the next 6 months</li>
                      <li>Average life expectancy: 2-3 years</li>
                      <li>High risk of death while waiting</li>
                    </ul>
                    <p className="mt-2"><strong>If you accept the domino liver:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                      <li>85% chance of immediate survival</li>
                      <li>Expected to gain 9-12 additional years of life</li>
                      <li>70% chance of 10-year survival</li>
                      <li>Risk of metabolic disease symptoms after 10-15 years</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

