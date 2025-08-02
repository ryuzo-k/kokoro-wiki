'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function SetupUsername() {
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Check if user already has a profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (user) {
        try {
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('user_email', user.email)
            .single()
          
          if (userProfile) {
            // User already has a profile, redirect to dashboard
            router.push(`/dashboard/${userProfile.username}`)
          }
        } catch (error) {
          // No existing profile, stay on setup page
        }
      }
    }

    checkExistingProfile()
  }, [user, router])

  // Check username availability
  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim()) {
      setUsernameStatus(null)
      return
    }

    // Basic validation
    if (usernameToCheck.length < 3) {
      setUsernameStatus('invalid')
      return
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(usernameToCheck)) {
      setUsernameStatus('invalid')
      return
    }

    setIsCheckingUsername(true)
    setUsernameStatus('checking')

    try {
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('username')
        .ilike('username', usernameToCheck)
        .single()

      if (existingProfile) {
        setUsernameStatus('taken')
      } else {
        setUsernameStatus('available')
      }
    } catch (error) {
      setUsernameStatus('available')
    } finally {
      setIsCheckingUsername(false)
    }
  }

  // Debounced username check
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [username])

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || usernameStatus !== 'available') return

    setIsCreating(true)
    setErrorMessage('')

    try {
      // Create user profile
      const { error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: user.id,
          user_email: user.email,
          username: username.trim()
        }])

      if (error) throw error

      // Redirect to dashboard
      router.push(`/dashboard/${username.trim()}`)
    } catch (error) {
      console.error('Error creating profile:', error)
      setErrorMessage('Failed to create profile. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  return (
    <div className="min-h-screen p-8 max-w-md mx-auto flex flex-col justify-center">
      <header className="text-center mb-12">
        <h1 className="text-3xl mb-4">Choose Your Username</h1>
        <p className="text-foreground opacity-70">
          This will be your unique identifier on kokoro.wiki
        </p>
        <p className="text-sm text-foreground opacity-50 mt-2">
          Signed in as: {user.email}
        </p>
      </header>

      <main>
        <form onSubmit={handleCreateProfile} className="space-y-6">
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
              disabled={isCreating}
            />
            
            {/* Username Status */}
            {username && (
              <div className="mt-2 text-sm">
                {usernameStatus === 'checking' && (
                  <p className="text-foreground opacity-70">
                    🔍 Checking availability...
                  </p>
                )}
                {usernameStatus === 'available' && (
                  <p className="text-link">
                    ✅ Username available!
                  </p>
                )}
                {usernameStatus === 'taken' && (
                  <p className="text-foreground opacity-80">
                    ❌ Username already taken
                  </p>
                )}
                {usernameStatus === 'invalid' && (
                  <p className="text-foreground opacity-80">
                    ❌ Username must be 3+ characters (letters, numbers, _, -)
                  </p>
                )}
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 border border-foreground bg-background text-foreground opacity-80">
              <p className="text-sm">❌ {errorMessage}</p>
            </div>
          )}

          {username && (
            <div className="text-center text-sm text-foreground opacity-70">
              Your URL: <span className="font-medium">kokoro.wiki/{username}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!username || usernameStatus !== 'available' || isCreating}
            className="w-full p-3 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
      </main>
    </div>
  )
}
