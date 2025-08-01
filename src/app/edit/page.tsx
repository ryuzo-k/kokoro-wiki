'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function EditTalkState() {
  const [mode, setMode] = useState<'WANT' | 'AVOID'>('WANT')
  const [peopleText, setPeopleText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Load existing talk state
  useEffect(() => {
    loadTalkState()
  }, [])

  // Auto-save draft to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('kokoro-wiki-talk-draft')
    if (savedDraft && !isLoading) {
      const draft = JSON.parse(savedDraft)
      setMode(draft.mode)
      setPeopleText(draft.peopleText)
    }
  }, [isLoading])

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        localStorage.setItem('kokoro-wiki-talk-draft', JSON.stringify({
          mode,
          peopleText
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [mode, peopleText, isLoading])

  const loadTalkState = async () => {
    try {
      const username = 'demo-user' // Replace with actual auth
      
      const { data, error } = await supabase
        .from('talk_state')
        .select('*')
        .eq('username', username)
        .single()

      if (data) {
        setMode(data.mode)
        setPeopleText(data.people_text)
      }
    } catch (error) {
      console.error('Error loading talk state:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (isSaving) return

    setIsSaving(true)
    
    try {
      const username = 'demo-user' // Replace with actual auth
      
      const { error } = await supabase
        .from('talk_state')
        .upsert([
          {
            username,
            mode,
            people_text: peopleText,
          }
        ])

      if (error) throw error

      // Clear draft
      localStorage.removeItem('kokoro-wiki-talk-draft')
      router.push(`/${username}`)
    } catch (error) {
      console.error('Error saving talk state:', error)
      alert('Failed to save talk state. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 max-w-2xl mx-auto">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl mb-2">Edit Talk State</h1>
        <p className="text-foreground opacity-70">
          Configure what you want or want to avoid in conversations.
        </p>
      </header>

      <main className="space-y-8">
        <div className="space-y-4">
          <label className="block">
            <span className="text-lg mb-4 block">Mode</span>
            <div className="space-x-4">
              <button
                onClick={() => setMode('WANT')}
                className={`px-4 py-2 border border-foreground ${
                  mode === 'WANT' 
                    ? 'bg-foreground text-background' 
                    : 'bg-background text-foreground hover:bg-foreground hover:text-background'
                } transition-colors`}
              >
                WANT
              </button>
              <button
                onClick={() => setMode('AVOID')}
                className={`px-4 py-2 border border-foreground ${
                  mode === 'AVOID' 
                    ? 'bg-foreground text-background' 
                    : 'bg-background text-foreground hover:bg-foreground hover:text-background'
                } transition-colors`}
              >
                AVOID
              </button>
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-lg mb-4 block">People & Context</span>
            <textarea
              value={peopleText}
              onChange={(e) => setPeopleText(e.target.value)}
              placeholder={mode === 'WANT' 
                ? "Describe the types of people or conversations you want to engage with..."
                : "Describe the types of people or conversations you want to avoid..."
              }
              className="w-full h-48 p-4 border border-foreground bg-background text-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-link"
              disabled={isSaving}
            />
          </label>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-foreground opacity-70">
            Auto-saving to draft
          </div>
          
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-foreground opacity-70 hover:opacity-100"
              disabled={isSaving}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
