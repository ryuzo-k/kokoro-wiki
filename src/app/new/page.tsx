'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewThought() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Auto-save draft to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('kokoro-wiki-draft')
    if (savedDraft) {
      setContent(savedDraft)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (content.trim()) {
        localStorage.setItem('kokoro-wiki-draft', content)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [content])

  // Handle Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [content])

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // Get current user (mock for now - replace with actual auth)
      const username = 'demo-user'
      
      const { error } = await supabase
        .from('thought_entries')
        .insert([
          {
            username,
            content: content.trim(),
          }
        ])

      if (error) throw error

      // Clear draft and redirect
      localStorage.removeItem('kokoro-wiki-draft')
      router.push(`/${username}`)
    } catch (error) {
      console.error('Error creating thought:', error)
      alert('Failed to create thought. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl mb-2">New Thought</h1>
        <p className="text-foreground opacity-70">
          Write your thoughts in Markdown. Press Cmd+Enter to publish.
        </p>
      </header>

      <main className="space-y-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="# Your thought here...

Start with a heading or just write freely. Markdown is supported."
          className="w-full h-96 p-4 border border-foreground bg-background text-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-link"
          disabled={isSubmitting}
        />

        <div className="flex justify-between items-center">
          <div className="text-sm text-foreground opacity-70">
            {content.length} characters • Auto-saving to draft
          </div>
          
          <div className="space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-foreground opacity-70 hover:opacity-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-2 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Publishing...' : 'Publish (Cmd+Enter)'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
