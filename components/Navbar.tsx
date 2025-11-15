import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-600" />
            <span className="text-xl font-bold text-gray-900">DominoMatch</span>
          </Link>
          <div className="flex space-x-6">
            <Link href="/matcher" className="text-gray-700 hover:text-blue-600 font-medium">
              Matcher
            </Link>
            <Link href="/calculator" className="text-gray-700 hover:text-blue-600 font-medium">
              Calculator
            </Link>
            <Link href="/consent" className="text-gray-700 hover:text-blue-600 font-medium">
              Consent
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link href="/predictor" className="text-gray-700 hover:text-blue-600 font-medium">
              Predictor
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

