'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

function SetupUsernameContent() {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  // Pre-fill username from URL parameter
  useEffect(() => {
    const targetUsername = searchParams.get('username')
    if (targetUsername) {
      setUsername(targetUsername)
    }
  }, [searchParams])

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
    
    // JavaScript validation
    if (!user) {
      setErrorMessage('User not authenticated')
      return
    }
    
    if (!displayName.trim()) {
      setErrorMessage('Please enter your name')
      return
    }
    
    if (!username.trim()) {
      setErrorMessage('Please enter a username')
      return
    }
    
    if (usernameStatus !== 'available') {
      setErrorMessage('Please wait for username availability check')
      return
    }

    setIsCreating(true)
    setErrorMessage('')

    try {
      // Create user profile with normalized username
      const normalizedUsername = username.trim().toLowerCase()
      const { error } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: user.id,
          user_email: user.email,
          username: normalizedUsername,
          display_name: displayName.trim()
        }])

      if (error) throw error

      // Redirect to dashboard
      router.push(`/dashboard/${normalizedUsername}`)
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
            <label htmlFor="displayName" className="block text-sm mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              className="w-full p-3 border border-foreground bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-link"
              disabled={isCreating}
            />
          </div>

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
            disabled={!username || !displayName.trim() || usernameStatus !== 'available' || isCreating}
            className="w-full p-3 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default function SetupUsername() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 flex items-center justify-center">Loading...</div>}>
      <SetupUsernameContent />
    </Suspense>
  )
}
