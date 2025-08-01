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
          あなたの思想と繋がりたい人を共有しよう
        </p>
      </header>

      <main className="space-y-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm mb-2">
              ユーザーネーム
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
              ダッシュボードへ（編集）
            </button>
            
            <button
              type="button"
              onClick={handleViewProfile}
              className="w-full p-3 border border-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              プロフィールを見る
            </button>
          </div>
        </form>

        {username && (
          <div className="text-center text-sm text-foreground opacity-70">
            あなたのURL: <span className="font-medium">kokoro.wiki/{username}</span>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-xs text-foreground opacity-50">
        <p>思想を書き、話したい人を見つけよう</p>
      </footer>
    </div>
  )
}
