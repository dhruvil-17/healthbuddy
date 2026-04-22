"use client";
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-6 bg-red-100 rounded-full">
                <AlertTriangle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900">Something went wrong</h1>
            
            <p className="text-gray-600 leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page or go back to the home page.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh Page
              </button>
              <a
                href="/"
                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all"
              >
                <Home className="h-5 w-5" />
                Go Home
              </a>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-gray-900 text-gray-100 p-4 rounded-xl text-sm">
                <summary className="cursor-pointer font-bold mb-2">Error Details (Development)</summary>
                <pre className="overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
