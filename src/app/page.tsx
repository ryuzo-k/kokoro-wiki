import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="mb-16">
        <h1 className="text-2xl mb-4">kokoro-wiki</h1>
        <p className="text-foreground opacity-70">
          A minimalist wiki for thoughts and connections
        </p>
      </header>

      <main className="space-y-8">
        <div className="space-y-4">
          <Link 
            href="/new" 
            className="block p-4 border border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Create new thought
          </Link>
          
          <Link 
            href="/edit" 
            className="block p-4 border border-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Edit talk state
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-lg mb-4">Recent profiles</h2>
          <p className="text-foreground opacity-70">
            Visit /[username] to view public profiles
          </p>
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t border-foreground opacity-50">
        <p className="text-sm">
          Press Esc for command palette
        </p>
      </footer>
    </div>
  )
}
