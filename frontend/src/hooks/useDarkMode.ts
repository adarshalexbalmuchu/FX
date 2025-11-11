import { useEffect, useState } from 'react'

/**
 * Hook for dark mode management
 * Syncs with localStorage and system preference
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme')
    if (stored) {
      return stored === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = () => setIsDark(!isDark)

  return { isDark, setIsDark, toggle }
}
