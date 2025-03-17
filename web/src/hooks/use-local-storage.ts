"use client"

import { useEffect, useState } from "react"

export default function useLocalStorage(
  key: string,
  defaultValue: string | null = null
) {
  const [item, setItem] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (!localStorage) {
      return setError(
        new Error(
          "Local storage isn't defined, make sure to use this in client"
        )
      )
    }
    // Else, get the local storage
    setLoading(true)
    // Get the item
    try {
      const item = localStorage.getItem(key)
      // We didn't get the item, but have some default value
      if (!item && defaultValue) setItem(defaultValue)
      // If we didn't get the item
      else if (!item)
        throw new Error(`Item with key: "${key}" could not be found`)
      // Else, set the item
      setItem(item)
    } catch (err) {
      if (err instanceof Error) setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    item,
    isLoading,
    error,
  }
}
