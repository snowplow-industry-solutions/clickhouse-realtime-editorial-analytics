import { useEffect, useRef } from 'react'

export function useImpressionTracking(callback: () => void, threshold = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const hasTracked = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element || hasTracked.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          callback()
          hasTracked.current = true
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [callback, threshold])

  return ref
}