'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      // Simple "login" - just redirect to dashboard
      router.push(`/dashboard/${username.trim()}`)
    }
  }

  const handleViewProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      router.push(`/${username.trim()}`)
    }
  }

  return (
    <div className="min-h-screen p-8 max-w-md mx-auto flex flex-col justify-center">
      <header className="text-center mb-16">
        <h1 className="text-3xl mb-4">kokoro.wiki</h1>
        <p className="text-foreground opacity-70">
          Share your thoughts and who you want to connect with
        </p>
      </header>

      <main className="space-y-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your-username"
              className="w-full p-3 border border-foreground bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-link"
              required
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full p-3 bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Go to Dashboard (Edit)
            </button>
            
            <button
              type="button"
              onClick={handleViewProfile}
              className="w-full p-3 border border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              View Profile
            </button>
          </div>
        </form>

        {username && (
          <div className="text-center text-sm text-foreground opacity-70">
            Your URL: <span className="font-medium">kokoro.wiki/{username}</span>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-xs text-foreground opacity-50 space-y-2">
        <p>Share your thoughts and find people to connect with</p>
        <p className="text-xs opacity-70">
          ⚠️ All content is publicly viewable. Only share what you're comfortable making public.
        </p>
        <p>
          <a href="/privacy" className="text-link hover:underline">Privacy Policy</a>
        </p>
      </footer>
    </div>
  )
}
