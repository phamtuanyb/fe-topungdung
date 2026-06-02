import { useEffect, useRef, useState } from "react"

export function useDebounce<T>(value: T, delay: number, deps?: unknown[]): T {
  const valueRef = useRef(value)
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    valueRef.current = value
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(valueRef.current)
    }, delay)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps ?? []), delay])

  return debouncedValue
}