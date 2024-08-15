'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
    // Clear the localStorage
    localStorage.removeItem('sniffa-requests')
  }, [error])

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center h-screen bg-stone-800 text-white">
          <h2 className="text-2xl mb-4">Something went wrong!</h2>
          <p className="mb-4">We&apos;ve cleared the stored data to prevent further issues.</p>
          <button
            className="bg-stone-600 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}