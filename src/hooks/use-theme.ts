
'use client'
import { useState, useEffect } from "react"

export function useTheme() {
  const [theme, setTheme] = useState("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark"
    setTheme(storedTheme)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)
      localStorage.setItem("theme", theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
  }

  // Prevent UI flashing by returning a inert theme state until mounted
  if (!mounted) {
    return { theme: "dark", toggleTheme: () => {}, mounted: false }
  }

  return { theme, toggleTheme, mounted: true }
}
