'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function AuthContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [targetUsername, setTargetUsername] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const username = searchParams.get('username')
    const authMode = searchParams.get('mode')
    
    if (username) {
      setTargetUsername(username)
    }
    
    if (authMode === 'signin' || authMode === 'signup') {
      setMode(authMode)
    }
  }, [searchParams])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // JavaScript validation
    if (!email) {
      setError('Please enter your email')
      return
    }
    if (!password) {
      setError('Please enter your password')
      return
    }
    
    setLoading(true)
    setError(null)
    setMessage(null)
    
    try {
      if (mode === 'signup') {
        // First check if email already exists in user_profiles
        const { data: existingUser } = await supabase
          .from('user_profiles')
          .select('user_email')
          .eq('user_email', email)
          .single()
        
        if (existingUser) {
          setError('This email is already registered. Please sign in instead.')
          return
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              preferred_username: targetUsername
            }
          }
        })
        
        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already been registered')) {
            setError('This email is already registered. Please sign in instead.')
          } else {
            setError(error.message)
          }
        } else {
          // Check if user was actually created or already exists
          if (data.user && !data.user.email_confirmed_at) {
            setMessage('Check your email for the confirmation link!')
          } else {
            setError('This email is already registered. Please sign in instead.')
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) {
          setError(error.message)
        } else {
          // Check if user already has a profile
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('user_id', data.user.id)
            .single()
          
          if (profile) {
            // User has profile, go to dashboard
            router.push(`/dashboard/${profile.username}`)
          } else {
            // New user, go to setup
            router.push(`/setup-username?username=${targetUsername}`)
          }
        }
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl mb-8 text-center">
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </h1>
        
        {targetUsername && (
          <div className="mb-6 p-4 border border-foreground">
            <p className="text-sm">Username: <strong>@{targetUsername}</strong></p>
          </div>
        )}
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-foreground bg-background text-foreground"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-foreground bg-background text-foreground"
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-foreground text-background hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
          </button>
        </form>
        
        {!searchParams.get('mode') && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup')
                setError(null)
                setMessage(null)
              }}
              className="text-sm underline hover:no-underline"
            >
              {mode === 'signup' ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-900 text-red-100 rounded">
            {error}
          </div>
        )}
        
        {message && (
          <div className="p-3 bg-green-900 text-green-100 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}
