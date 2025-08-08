"use client"

interface ErrorProps {
  message?: string
  reset?: () => void
}

export default function Error({ message, reset }: ErrorProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">
        Oops! Something went wrong.
      </h1>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
      {reset && (
        <button
          onClick={reset}
          className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
