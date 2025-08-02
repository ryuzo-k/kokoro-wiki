'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface Props {
  params: { username: string }
}

export default function Dashboard({ params }: { params: { username: string } }) {
  const { username } = params
  const normalizedUsername = username.toLowerCase()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  
  // Current entries
  const [currentThought, setCurrentThought] = useState('')
  const [currentPeople, setCurrentPeople] = useState('')
  
  // Loading states
  const [isLoadingThought, setIsLoadingThought] = useState(false)
  const [isLoadingPeople, setIsLoadingPeople] = useState(false)
  
  // Success message states
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  
  // Show success message for 3 seconds
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }
  
  // Show error message for 5 seconds
  const showErrorMessage = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(''), 5000)
  }
  
  // Check if current user owns this username
  const checkUsernameOwnership = async () => {
    if (!user) return
    
    try {
      // Check if this username is already registered (case insensitive)
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .ilike('username', username)
        .single()
      
      if (existingProfile) {
        // Username exists - check if it belongs to current user
        if (existingProfile.user_email !== user.email) {
          // Username belongs to someone else
          router.push('/?error=username-taken')
          return
        }
      } else {
        // Username doesn't exist - check if user already has a profile
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_email', user.email)
          .single()
        
        if (userProfile) {
          // User already has a different username
          router.push(`/dashboard/${userProfile.username}?info=redirected`)
          return
        } else {
          // Create new profile for this user
          await supabase
            .from('user_profiles')
            .insert([{
              user_id: user.id,
              user_email: user.email,
              username: username
            }])
        }
      }
    } catch (error) {
      console.error('Error checking username ownership:', error)
    }
  }
  
  // Load current entries and check username ownership on mount
  // Redirect uppercase usernames to lowercase
  useEffect(() => {
    if (username !== normalizedUsername) {
      router.replace(`/dashboard/${normalizedUsername}`)
      return
    }
  }, [username, normalizedUsername, router])

  useEffect(() => {
    if (!user && !loading) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    checkUsernameOwnership()
    loadCurrentEntries()
  }, [username])

  const loadCurrentEntries = async () => {
    try {
      // Load latest thought
      const { data: thoughtData } = await supabase
        .from('thoughts')
        .select('content')
        .eq('username', username)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (thoughtData) {
        setCurrentThought(thoughtData.content)
      }

      // Load latest people entry
      const { data: peopleData } = await supabase
        .from('people_want_to_talk')
        .select('content')
        .eq('username', username)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (peopleData) {
        setCurrentPeople(peopleData.content)
      }
    } catch (error) {
      console.error('Error loading current entries:', error)
    }
  }

  const handleSaveThought = async () => {
    // JavaScript validation
    if (!user) {
      showErrorMessage('User not authenticated')
      return
    }
    
    if (!currentThought.trim()) {
      showErrorMessage('Please enter your thoughts')
      return
    }
    
    if (isLoadingThought) return
    
    setIsLoadingThought(true)
    try {
      const { error } = await supabase
        .from('thoughts')
        .insert([{
          username: normalizedUsername,
          content: currentThought.trim(),
          user_id: user.id
        }])

      if (error) throw error
      
      // Clear the input (don't reload to prevent showing old content)
      setCurrentThought('')
      showSuccessMessage('Thoughts saved successfully!')
    } catch (error) {
      console.error('Error saving thought:', error)
      showErrorMessage('Failed to save thought. Please try again.')
    } finally {
      setIsLoadingThought(false)
    }
  }

  const handleSavePeople = async () => {
    // JavaScript validation
    if (!user) {
      showErrorMessage('User not authenticated')
      return
    }
    
    if (!currentPeople.trim()) {
      showErrorMessage('Please enter people you want to talk to')
      return
    }
    
    if (isLoadingPeople) return
    
    setIsLoadingPeople(true)
    try {
      const { error } = await supabase
        .from('people_want_to_talk')
        .insert([{
          username: normalizedUsername,
          content: currentPeople.trim(),
          user_id: user.id
        }])

      if (error) throw error
      
      // Clear the input (don't reload to prevent showing old content)
      setCurrentPeople('')
      showSuccessMessage('People saved successfully!')
    } catch (error) {
      console.error('Error saving people:', error)
      showErrorMessage('Failed to save people. Please try again.')
    } finally {
      setIsLoadingPeople(false)
    }
  }

  // Authentication guard
  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen p-8 max-w-md mx-auto flex flex-col justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-2xl mb-4">Authentication Required</h1>
          <p className="text-foreground opacity-70">
            You need to sign in to edit your profile.
          </p>
          <div className="space-y-3">
            <a
              href="/auth"
              className="block w-full p-3 bg-foreground text-background text-center hover:opacity-90"
            >
              Sign In / Sign Up
            </a>
            <a
              href="/"
              className="block w-full p-3 border border-foreground text-center hover:bg-foreground hover:text-background transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl">@{username} Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/${username}`)}
              className="text-link hover:underline"
            >
              View Profile
            </button>
            <button
              onClick={() => {
                signOut()
                router.push('/')
              }}
              className="text-foreground opacity-70 hover:opacity-100"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="text-foreground opacity-70">
          Your URL: <span className="font-medium">kokoro.wiki/{username}</span>
        </p>

        
        {/* Success Message */}
        {successMessage && (
          <div className="mt-4 p-3 bg-foreground text-background">
            <p className="text-sm">✅ {successMessage}</p>
          </div>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-3 border border-foreground bg-background text-foreground opacity-80">
            <p className="text-sm">❌ {errorMessage}</p>
            <button 
              onClick={() => setErrorMessage('')}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </header>

      <main className="space-y-12">
        {/* Thoughts Section */}
        <section className="space-y-6">
          <h2 className="text-xl border-b border-foreground pb-2">Current Thoughts</h2>
          
          <div className="space-y-4">
            <textarea
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              placeholder="Share your current thoughts, ideas, or reflections..."
              className="w-full h-32 p-4 border border-foreground bg-background text-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-link"
              disabled={isLoadingThought}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground opacity-70">
                {currentThought.length} characters
              </span>
              <button
                onClick={handleSaveThought}
                disabled={!currentThought.trim() || isLoadingThought}
                className="px-6 py-2 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingThought ? 'Saving...' : 'Update Thoughts'}
              </button>
            </div>
          </div>
        </section>

        {/* People Section */}
        <section className="space-y-6">
          <h2 className="text-xl border-b border-foreground pb-2">People I Want to Talk To</h2>
          
          <div className="space-y-4">
            <textarea
              value={currentPeople}
              onChange={(e) => setCurrentPeople(e.target.value)}
              placeholder="Describe the types of people you'd like to connect with or topics you're interested in discussing..."
              className="w-full h-32 p-4 border border-foreground bg-background text-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-link"
              disabled={isLoadingPeople}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground opacity-70">
                {currentPeople.length} characters
              </span>
              <button
                onClick={handleSavePeople}
                disabled={!currentPeople.trim() || isLoadingPeople}
                className="px-6 py-2 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingPeople ? 'Saving...' : 'Update People'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 pt-8 border-t border-foreground opacity-50 text-center">
        <p className="text-sm">
          Updates will be saved as history
        </p>
      </footer>
    </div>
  )
}
