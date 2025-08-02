'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  params: { username: string }
}

export default function EditUsername({ params }: Props) {
  const { username: currentUsername } = params
  const [newUsername, setNewUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // JavaScript validation
    if (!newUsername.trim()) {
      setError('Please enter a new username')
      return
    }

    if (newUsername.trim().length < 3) {
      setError('Username must be at least 3 characters long')
      return
    }

    if (newUsername.trim().length > 20) {
      setError('Username cannot be longer than 20 characters')
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername.trim())) {
      setError('Username can only contain letters, numbers, underscores, and hyphens')
      return
    }

    if (newUsername.trim() === currentUsername) {
      setError('New username must be different from current username')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Check if new username already exists
      const { data: existingThoughts } = await supabase
        .from('thoughts')
        .select('id')
        .eq('username', newUsername.trim())
        .limit(1)

      const { data: existingPeople } = await supabase
        .from('people_want_to_talk')
        .select('id')
        .eq('username', newUsername.trim())
        .limit(1)

      if (existingThoughts?.length || existingPeople?.length) {
        setError('Username already exists. Please choose a different one.')
        return
      }

      // Update thoughts table
      const { error: thoughtsError } = await supabase
        .from('thoughts')
        .update({ username: newUsername.trim() })
        .eq('username', currentUsername)

      if (thoughtsError) throw thoughtsError

      // Update people_want_to_talk table
      const { error: peopleError } = await supabase
        .from('people_want_to_talk')
        .update({ username: newUsername.trim() })
        .eq('username', currentUsername)

      if (peopleError) throw peopleError

      // Redirect to new profile
      router.push(`/${newUsername.trim()}`)
    } catch (error) {
      console.error('Error updating username:', error)
      setError('Failed to update username. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 max-w-md mx-auto flex flex-col justify-center">
      <header className="text-center mb-12">
        <h1 className="text-2xl mb-4">Change Username</h1>
        <p className="text-foreground opacity-70">
          Current: <span className="font-medium">kokoro.wiki/{currentUsername}</span>
        </p>
      </header>

      <main>
        <form onSubmit={handleUpdateUsername} className="space-y-6">
          <div>
            <label htmlFor="newUsername" className="block text-sm mb-2">
              New Username
            </label>
            <input
              type="text"
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="your-new-username"
              className="w-full p-3 border border-foreground bg-background text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-link"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 border border-foreground bg-background text-foreground opacity-80">
              <p className="text-sm">❌ {error}</p>
            </div>
          )}

          {newUsername && (
            <div className="text-center text-sm text-foreground opacity-70">
              New URL: <span className="font-medium">kokoro.wiki/{newUsername}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={!newUsername.trim() || isLoading}
              className="w-full p-3 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Username'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push(`/${currentUsername}`)}
              className="w-full p-3 border border-foreground hover:bg-foreground hover:text-background transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>

      <footer className="mt-16 text-center text-xs text-foreground opacity-50">
        <p>⚠️ This will update all your existing content to the new username</p>
      </footer>
    </div>
  )
}
