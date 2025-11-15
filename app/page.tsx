import Link from 'next/link'
import { Heart, Zap, Users, FileText, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          DominoMatch
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          AI-Powered Platform to Save 1,500+ Lives Annually Through Efficient Domino Transplants
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/matcher"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Matching
          </Link>
          <Link
            href="/calculator"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Survival Calculator
          </Link>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">The Problem</h2>
        <p className="text-lg text-gray-700 mb-4">
          Domino transplantation could save <strong>2,000+ additional lives annually</strong> in the US, 
          but only <strong>50-100 domino transplants</strong> happen because:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Transplant coordinators lack tools to identify optimal Patient C candidates (manual screening takes 8-12 hours)</li>
          <li>Risk-benefit calculations are subjective and inconsistent across hospitals</li>
          <li>Complex multi-patient logistics cause 30-40% of potential domino chains to fail</li>
          <li>Informed consent is difficult - patients can't visualize long-term risks vs. immediate survival benefit</li>
        </ul>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <Link href="/matcher" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <Zap className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Candidate Matcher</h3>
          <p className="text-gray-600">
            AI-powered matching algorithm identifies optimal domino recipients from waitlists in seconds
          </p>
        </Link>

        <Link href="/calculator" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <Heart className="w-12 h-12 text-red-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Survival Calculator</h3>
          <p className="text-gray-600">
            Personalized survival probability curves showing life expectancy with vs. without domino transplant
          </p>
        </Link>

        <Link href="/consent" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <FileText className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Consent Generator</h3>
          <p className="text-gray-600">
            AI-generated patient-friendly consent forms with visual infographics and personalized risk timelines
          </p>
        </Link>

        <Link href="/dashboard" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <Users className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Chain Coordinator</h3>
          <p className="text-gray-600">
            Timeline management dashboard coordinating Donor A → Patient B → Patient C with conflict alerts
          </p>
        </Link>

        <Link href="/predictor" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
          <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Outcome Predictor</h3>
          <p className="text-gray-600">
            ML-powered predictions based on 287 historical cases showing personalized success probability
          </p>
        </Link>
      </div>

      {/* Impact Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-6">Market Impact</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="text-4xl font-bold mb-2">250+</div>
            <div className="text-blue-100">Transplant Centers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">30,000+</div>
            <div className="text-blue-100">Patients on Waitlist</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">1,500</div>
            <div className="text-blue-100">Additional Lives Saved/Year</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">40-50%</div>
            <div className="text-blue-100">Target Utilization Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

