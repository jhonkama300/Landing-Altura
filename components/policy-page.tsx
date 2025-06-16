import type React from "react"

interface PolicyPageProps {
  title: string
  lastUpdated?: string
  children: React.ReactNode
}

export function PolicyPage({ title, lastUpdated, children }: PolicyPageProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>

          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Última actualización: {lastUpdated}</p>
          )}

          <div className="prose dark:prose-invert prose-lg max-w-none">{children}</div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <a href="/" className="inline-flex items-center text-accent hover:text-accent-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Volver a la página principal
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
