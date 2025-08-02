'use client'

import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { formatToLocalTime, formatDateForGrouping } from '@/lib/dateUtils'
import { supabase } from '@/lib/supabase'

interface Props {
  params: { username: string }
}

interface ThoughtEntry {
  id: string
  username: string
  content: string
  created_at: string
}

interface PeopleEntry {
  id: string
  username: string
  content: string
  created_at: string
}

export default function UserProfile({ params }: { params: { username: string } }) {
  const { username } = params
  const router = useRouter()
  const normalizedUsername = username.toLowerCase()
  const [loading, setLoading] = useState(true)
  const [currentThought, setCurrentThought] = useState<ThoughtEntry | null>(null)
  const [thoughtHistory, setThoughtHistory] = useState<ThoughtEntry[]>([])
  const [currentPeople, setCurrentPeople] = useState<PeopleEntry | null>(null)
  const [peopleHistory, setPeopleHistory] = useState<PeopleEntry[]>([])

  // Redirect uppercase usernames to lowercase
  useEffect(() => {
    if (username !== normalizedUsername) {
      router.replace(`/${normalizedUsername}`)
      return
    }
  }, [username, normalizedUsername, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch thoughts using normalized username
        const { data: thoughts, error: thoughtsError } = await supabase
          .from('thoughts')
          .select('*')
          .eq('username', normalizedUsername)
          .order('created_at', { ascending: false })

        // Fetch people using normalized username
        const { data: people, error: peopleError } = await supabase
          .from('people_want_to_talk')
          .select('*')
          .eq('username', normalizedUsername)
          .order('created_at', { ascending: false })

        if (thoughtsError && thoughtsError.code !== 'PGRST116') {
          console.error('Error fetching thoughts:', thoughtsError)
        }

        if (peopleError && peopleError.code !== 'PGRST116') {
          console.error('Error fetching people:', peopleError)
        }

        // If no data exists for this user, show not found
        if ((!thoughts || thoughts.length === 0) && (!people || people.length === 0)) {
          notFound()
        }

        // Get current (latest) entries
        const currentThought = thoughts?.[0]
        const currentPeopleEntry = people?.[0]

        // Get history (excluding current)
        const thoughtHistoryData = thoughts?.slice(1) || []
        const peopleHistoryData = people?.slice(1) || []

        // Update state
        setCurrentThought(currentThought)
        setCurrentPeople(currentPeopleEntry)
        setThoughtHistory(thoughtHistoryData)
        setPeopleHistory(peopleHistoryData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [username])

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-3xl mb-2">@{username}</h1>
        <p className="text-foreground opacity-70 mb-4">
          kokoro.wiki/{username}
        </p>
        <a 
          href={`/edit-username/${username}`}
          className="inline-block px-4 py-2 text-sm border border-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          Edit Username
        </a>
      </header>

      <main className="space-y-16">
        {/* Current Thoughts */}
        {currentThought && (
          <section className="space-y-6">
            <h2 className="text-xl border-b border-foreground pb-2">Current Thoughts</h2>
            <div className="p-6 border border-foreground">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {currentThought.content}
              </div>
              <div className="mt-4 text-xs text-foreground opacity-50">
                {formatToLocalTime(currentThought.created_at)}
              </div>
            </div>
            
            {/* Thought History */}
            {thoughtHistory.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg text-foreground opacity-80">Past Thoughts</h3>
                <div className="space-y-4 pl-4">
                  {thoughtHistory.map((thought) => (
                    <div key={thought.id} className="p-4 border border-foreground opacity-70">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {thought.content}
                      </div>
                      <div className="mt-2 text-xs text-foreground opacity-50">
                        {formatToLocalTime(thought.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* People I Want to Talk To */}
        {currentPeople && (
          <section className="space-y-6">
            <h2 className="text-xl border-b border-foreground pb-2">People I Want to Talk To</h2>
            <div className="p-6 border border-foreground">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {currentPeople.content}
              </div>
              <div className="mt-4 text-xs text-foreground opacity-50">
                {formatToLocalTime(currentPeople.created_at)}
              </div>
            </div>
            
            {/* People History */}
            {peopleHistory.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg text-foreground opacity-80">Past People I Wanted to Talk To</h3>
                <div className="space-y-4 pl-4">
                  {peopleHistory.map((person) => (
                    <div key={person.id} className="p-4 border border-foreground opacity-70">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {person.content}
                      </div>
                      <div className="mt-2 text-xs text-foreground opacity-50">
                        {formatToLocalTime(person.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Empty state */}
        {!currentThought && !currentPeople && (
          <div className="text-center py-16">
            <p className="text-foreground opacity-70">
              Nothing has been posted yet
            </p>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center">
        <a 
          href="/" 
          className="text-link hover:underline"
        >
          Back to kokoro.wiki
        </a>
      </footer>
    </div>
  )
}
