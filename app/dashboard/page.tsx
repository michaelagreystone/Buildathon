'use client'

import { useState } from 'react'
import { Calendar, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'

interface ChainStatus {
  id: string
  donorA: {
    name: string
    status: 'scheduled' | 'in_progress' | 'completed'
    surgeryTime: string
  }
  patientB: {
    name: string
    status: 'scheduled' | 'in_progress' | 'completed'
    surgeryTime: string
    metabolicDisease: string
  }
  patientC: {
    name: string
    status: 'scheduled' | 'in_progress' | 'completed'
    surgeryTime: string
  }
  overallStatus: 'on_schedule' | 'at_risk' | 'delayed'
  coldIschemiaTime: number // hours
}

export default function DashboardPage() {
  const [chains] = useState<ChainStatus[]>([
    {
      id: '1',
      donorA: {
        name: 'Deceased Donor A',
        status: 'completed',
        surgeryTime: '2024-01-15T08:00:00',
      },
      patientB: {
        name: 'Sarah Chen (FAP)',
        status: 'in_progress',
        surgeryTime: '2024-01-15T08:00:00',
        metabolicDisease: 'FAP',
      },
      patientC: {
        name: 'Michael Johnson',
        status: 'scheduled',
        surgeryTime: '2024-01-15T14:00:00',
      },
      overallStatus: 'on_schedule',
      coldIschemiaTime: 6,
    },
    {
      id: '2',
      donorA: {
        name: 'Deceased Donor B',
        status: 'scheduled',
        surgeryTime: '2024-01-20T10:00:00',
      },
      patientB: {
        name: 'Robert Martinez (Metabolic)',
        status: 'scheduled',
        surgeryTime: '2024-01-20T10:00:00',
        metabolicDisease: 'Metabolic Disease',
      },
      patientC: {
        name: 'Emily Davis',
        status: 'scheduled',
        surgeryTime: '2024-01-20T16:00:00',
      },
      overallStatus: 'at_risk',
      coldIschemiaTime: 6,
    },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-gray-600" />
      default:
        return <XCircle className="w-5 h-5 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'scheduled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'on_schedule':
        return 'bg-green-500'
      case 'at_risk':
        return 'bg-yellow-500'
      case 'delayed':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const calculateTimeRemaining = (surgeryTime: string) => {
    const now = new Date()
    const surgery = new Date(surgeryTime)
    const diff = surgery.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diff < 0) return 'Past'
    if (hours < 0) return 'Overdue'
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Domino Chain Coordinator Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Track and coordinate multi-patient domino transplant chains in real-time
        </p>

        {/* Alerts */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <div>
              <p className="font-semibold text-yellow-800">Chain #2: Timing Risk Detected</p>
              <p className="text-sm text-yellow-700">
                Patient C surgery scheduled 6 hours after Patient B. Cold ischemia time limit is 8 hours. 
                Monitor closely for delays.
              </p>
            </div>
          </div>
        </div>

        {/* Chains Grid */}
        <div className="grid gap-6">
          {chains.map((chain) => (
            <div key={chain.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Domino Chain #{chain.id}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getOverallStatusColor(chain.overallStatus)}`}></div>
                  <span className="text-sm font-semibold capitalize">
                    {chain.overallStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Timeline View */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(chain.donorA.status)}
                      <div>
                        <h3 className="font-semibold">Donor A: {chain.donorA.name}</h3>
                        <p className="text-sm text-gray-600">{formatTime(chain.donorA.surgeryTime)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(chain.donorA.status)}`}>
                        {chain.donorA.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-center mx-4">
                    <div className="text-xs text-gray-500">↓</div>
                    <div className="text-xs text-gray-500">Liver</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(chain.patientB.status)}
                      <div>
                        <h3 className="font-semibold">Patient B: {chain.patientB.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatTime(chain.patientB.surgeryTime)} • {chain.patientB.metabolicDisease}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(chain.patientB.status)}`}>
                        {chain.patientB.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-center mx-4">
                    <div className="text-xs text-gray-500">↓</div>
                    <div className="text-xs text-gray-500">Domino Liver</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(chain.patientC.status)}
                      <div>
                        <h3 className="font-semibold">Patient C: {chain.patientC.name}</h3>
                        <p className="text-sm text-gray-600">
                          {formatTime(chain.patientC.surgeryTime)}
                          {chain.patientC.status === 'scheduled' && (
                            <span className="ml-2 text-blue-600">
                              (in {calculateTimeRemaining(chain.patientC.surgeryTime)})
                            </span>
                          )}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(chain.patientC.status)}`}>
                        {chain.patientC.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Cold Ischemia Time</div>
                  <div className="text-2xl font-bold">
                    {chain.coldIschemiaTime}h / 8h
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {chain.coldIschemiaTime < 8 ? 'Within limit' : 'Exceeded'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Time Between Surgeries</div>
                  <div className="text-2xl font-bold">
                    {chain.coldIschemiaTime}h
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Patient B → Patient C
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Chain Status</div>
                  <div className="text-2xl font-bold capitalize">
                    {chain.overallStatus.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {chain.overallStatus === 'on_schedule' ? 'All on track' : 'Action needed'}
                  </div>
                </div>
              </div>

              {/* Alerts for this chain */}
              {chain.overallStatus === 'at_risk' && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">Timing Alert</p>
                      <p className="text-xs text-yellow-700">
                        Ensure Patient B surgery completes on time to maintain cold ischemia window for Patient C.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">Chain Statistics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold mb-1">{chains.length}</div>
              <div className="text-blue-100">Active Chains</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">
                {chains.filter(c => c.overallStatus === 'on_schedule').length}
              </div>
              <div className="text-blue-100">On Schedule</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">
                {chains.filter(c => c.overallStatus === 'at_risk').length}
              </div>
              <div className="text-blue-100">At Risk</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">
                {chains.reduce((sum, c) => sum + (c.patientB.status === 'completed' ? 1 : 0), 0)}
              </div>
              <div className="text-blue-100">Completed This Month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

