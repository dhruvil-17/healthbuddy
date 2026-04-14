'use client'

import { Heart, Activity } from 'lucide-react'



export default function Loader({ title, subtitle }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-violet-50">
      <div className="relative text-center">
        {/* Background spinning circles
        <div className="absolute inset-0 flex items-center justify-center" style={{ height: '320px' }}>
          <div className="w-64 h-64 border-4 border-primary-200 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
          <div className="absolute w-48 h-48 border-4 border-violet-200 rounded-full animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
          <div className="absolute w-32 h-32 border-4 border-blue-200 rounded-full animate-spin" style={{ animationDuration: '6s' }} />
        </div> */}

        {/* Main heart loader */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-violet-500 blur-3xl opacity-20 animate-pulse rounded-full" style={{ width: '120px', height: '120px', marginLeft: '-20px' }} />
          <div className="relative bg-white rounded-full p-6 shadow-2xl">
            <Heart className="h-16 w-16 text-primary-600 animate-pulse" />
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {title && (
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{title}</h2>
        )}
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
