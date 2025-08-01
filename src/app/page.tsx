'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

function HomeContent() {
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, signOut, loading } = useAuth()

  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'username-taken') {
      setErrorMessage('This username is already taken by another user.')
    }
  }, [searchParams])

  // Auto-redirect logged in users
  useEffect(() => {
    const checkUserProfile = async () => {
      if (user && !loading) {
        try {
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('user_email', user.email)
            .single()
          
          if (userProfile) {
            // User has existing profile, redirect to dashboard
            router.push(`/dashboard/${userProfile.username}`)
          } else {
            // User needs to set up username
            router.push('/setup-username')
          }
        } catch (error) {
          // No existing profile, redirect to setup
          router.push('/setup-username')
        }
      }
    }

    checkUserProfile()
  }, [user, loading, router])

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
      // Check if username exists in user_profiles (case insensitive)
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
      // If no profile found, username is available
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
    }, 500) // 500ms delay

    return () => clearTimeout(timeoutId)
  }, [username])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/auth')
      return
    }
    if (username.trim()) {
      router.push(`/dashboard/${username.trim()}`)
    }
  }

  const handleViewProfile = () => {
    if (username.trim()) {
      router.push(`/${username.trim()}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-md mx-auto flex flex-col justify-center">
      <header className="text-center mb-12">
        <h1 className="text-4xl mb-4">kokoro.wiki</h1>
        <p className="text-lg text-foreground opacity-80 mb-8">
          Share your thoughts and connect with people
        </p>
        
        {user && (
          <div className="mb-4 p-3 border border-foreground bg-background text-foreground opacity-80">
            <p className="text-sm">Welcome back, {user.email}!</p>
            <button 
              onClick={signOut}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="space-y-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm mb-2">
              Choose your username
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

          <button
            type="submit"
            disabled={!!username && (usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'checking')}
            className="w-full p-3 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {user ? 'Create Profile' : 'Get Started'}
          </button>
        </form>
        
        {username && (
          <button
            onClick={handleViewProfile}
            className="w-full p-3 border border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Preview Profile
          </button>
        )}

        {username && (
          <div className="text-center text-sm text-foreground opacity-70">
            Your URL: <span className="font-medium">kokoro.wiki/{username}</span>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-xs text-foreground opacity-50 space-y-2">
        <p>Share your thoughts and find people to connect with</p>
        {!user && (
          <p>
            <a href="/auth" className="text-link hover:underline">
              Sign In / Sign Up
            </a>
          </p>
        )}
        <p>
          View our{' '}
          <a href="/privacy" className="text-link hover:underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
