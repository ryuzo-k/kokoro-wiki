import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase'
import { ThoughtEntry, TalkState } from '@/lib/supabase'

interface Props {
  params: { username: string }
}

// ISR with 60 second revalidation
export const revalidate = 60

export default async function UserProfile({ params }: Props) {
  const { username } = params
  const supabase = createServerClient()

  // Fetch thought entries
  const { data: thoughts, error: thoughtsError } = await supabase
    .from('thought_entries')
    .select('*')
    .eq('username', username)
    .order('created_at', { ascending: false })

  // Fetch talk state
  const { data: talkState, error: talkStateError } = await supabase
    .from('talk_state')
    .select('*')
    .eq('username', username)
    .single()

  if (thoughtsError && thoughtsError.code !== 'PGRST116') {
    console.error('Error fetching thoughts:', thoughtsError)
  }

  if (talkStateError && talkStateError.code !== 'PGRST116') {
    console.error('Error fetching talk state:', talkStateError)
  }

  // If no data exists for this user, show not found
  if ((!thoughts || thoughts.length === 0) && !talkState) {
    notFound()
  }

  // Group thoughts by date
  const groupedThoughts = thoughts?.reduce((groups: Record<string, ThoughtEntry[]>, thought) => {
    const date = new Date(thought.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(thought)
    return groups
  }, {}) || {}

  // Extract display name from email (before @)
  const displayName = username.includes('@') 
    ? username.split('@')[0] 
    : username

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-16">
        <h1 className="text-3xl mb-2">{displayName}</h1>
        <p className="text-foreground opacity-70">@{username}</p>
      </header>

      <main className="space-y-16">
        {/* Timeline */}
        {Object.keys(groupedThoughts).length > 0 && (
          <section>
            <h2 className="text-xl mb-8">Timeline</h2>
            <div className="space-y-12">
              {Object.entries(groupedThoughts).map(([date, dateThoughts]) => (
                <div key={date} className="space-y-6">
                  <h3 className="text-lg font-medium text-foreground opacity-80 border-b border-foreground pb-2">
                    {date}
                  </h3>
                  <div className="space-y-8 pl-4">
                    {dateThoughts.map((thought) => (
                      <article key={thought.id} className="space-y-4">
                        <div className="text-sm text-foreground opacity-60">
                          {new Date(thought.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="prose prose-mono max-w-none">
                          <ThoughtContent content={thought.content} />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Talk State */}
        {talkState && (
          <section>
            <h2 className="text-xl mb-8">Current Talk State</h2>
            <div className="border border-foreground p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-foreground opacity-70">Mode:</span>
                <span className={`px-3 py-1 text-sm border border-foreground ${
                  talkState.mode === 'WANT' 
                    ? 'bg-foreground text-background' 
                    : 'bg-background text-foreground'
                }`}>
                  {talkState.mode}
                </span>
              </div>
              
              {talkState.people_text && (
                <div className="space-y-2">
                  <span className="text-sm text-foreground opacity-70">Context:</span>
                  <div className="whitespace-pre-wrap text-foreground">
                    {talkState.people_text}
                  </div>
                </div>
              )}
              
              <div className="text-xs text-foreground opacity-50 pt-2 border-t border-foreground">
                Last updated: {new Date(talkState.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {Object.keys(groupedThoughts).length === 0 && !talkState && (
          <div className="text-center py-16">
            <p className="text-foreground opacity-70">
              No thoughts or talk state found for this user.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

// Simple markdown-like rendering for thought content
function ThoughtContent({ content }: { content: string }) {
  const lines = content.split('\n')
  
  return (
    <div className="space-y-4">
      {lines.map((line, index) => {
        // Handle headings
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-2xl font-medium">
              {line.slice(2)}
            </h1>
          )
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-medium">
              {line.slice(3)}
            </h2>
          )
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-medium">
              {line.slice(4)}
            </h3>
          )
        }
        
        // Handle empty lines
        if (line.trim() === '') {
          return <div key={index} className="h-4" />
        }
        
        // Regular paragraphs
        return (
          <p key={index} className="leading-relaxed">
            {line}
          </p>
        )
      })}
    </div>
  )
}
