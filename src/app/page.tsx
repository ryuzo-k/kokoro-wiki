'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import SupportButton from '@/components/SupportButton'

function HomeContent() {
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid' | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [allowAutoRedirect, setAllowAutoRedirect] = useState(true)
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
      if (user && !loading && allowAutoRedirect) {
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
  }, [user, loading, router, allowAutoRedirect])

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
      // If username exists, go to signin mode; otherwise signup mode
      const mode = usernameStatus === 'taken' ? 'signin' : 'signup'
      router.push(`/auth?username=${encodeURIComponent(username)}&mode=${mode}`)
      return
    }
    if (username.trim()) {
      router.push(`/dashboard/${username.trim()}`)
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
          Share your thoughts and build relationships that feel right to you.
        </p>
        
        {user && (
          <div className="mb-4 p-3 border border-foreground bg-background text-foreground opacity-80">
            <p className="text-sm">Welcome back, {user.email}!</p>
            <button
              onClick={() => {
                setAllowAutoRedirect(false)
                signOut()
              }}
              className="text-foreground opacity-70 hover:opacity-100 text-sm"
            >
              Logout
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
            disabled={!!username && (usernameStatus === 'invalid' || usernameStatus === 'checking')}
            className="w-full p-3 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {user ? 'Create Profile' : 
             usernameStatus === 'taken' ? 'Sign In' : 
             usernameStatus === 'available' ? 'Sign Up' : 
             'Get Started'}
          </button>
        </form>
        
        {username && (
          <div className="text-center text-sm text-foreground opacity-70">
            Your URL: <span className="font-medium">kokoro.wiki/{username}</span>
          </div>
        )}
        
        {/* Introduction Message */}
        <div className="mt-12 pt-8 border-t border-foreground opacity-30">
          <div className="prose prose-sm max-w-none text-foreground opacity-80 space-y-4">
            <p>Hi, I’m Ryuzo.<br/>
            I’m 17 years old. I dropped out of high school and came to San Francisco.<br/>
            I’ve done some research on the human mind, and I started thinking -<br/>
            maybe we can build better relationships by sharing our thoughts more openly.</p>

            <p>So I built Kokoro Wiki.</p>

            <p>You can create your own page and post your honest thoughts.<br/>
            “Kokoro” means “heart” or “mind” in Japanese.<br/>
            Let’s try to be a bit more open. Kokoro Wiki is here to help with that.</p>

            <p>It’s really simple to use:<br/>
            Go to kokoro.wiki and search for a username.<br/>
            Short names are clean and beautiful.<br/>
            Then, register and log in.</p>

            <p>You’ll see your personal dashboard.<br/>
            Write your first thought.<br/>
            Tell us how you’re doing.<br/>
            And write about who you want to talk to right now.<br/>
            Maybe you just want to be alone, or maybe you’re feeling a little lonely.</p>

            <p>Then check your public page.<br/>
            Your words are shown just as you wrote them.</p>

            <p>I’m always thinking about how we can have more honest relationships.<br/>
            There’s a lot of miscommunication in the world.<br/>
            That’s why it’s important to create relationships that feel right to you.</p>

            <p>So go ahead and share your thoughts.<br/>
            Add the link to your social media bio.<br/>
            Instead of just showing your past,<br/>
            show what you’re thinking and feeling right now.</p>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-xs text-foreground opacity-50 space-y-4">
        <div className="space-y-3">
          <div className="text-sm opacity-80">
            <p><strong>This project is completely free and non-profit.</strong></p>
            <p>If Kokoro Wiki helps you connect with others, consider supporting Ryuzo's work.</p>
          </div>
          <div className="flex justify-center">
            <SupportButton variant="secondary" size="sm" />
          </div>
        </div>
        <div className="space-y-2">
          <p>Share your thoughts and build relationships that feel right to you.</p>
          {!user && (
            <p>
              <a href="/auth" className="text-link hover:underline">
                Sign In / Sign Up
              </a>
            </p>
          )}
          <p>
            View our{' '}
            <a href="https://kokororesearch.org/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
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
