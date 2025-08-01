export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl mb-4">Privacy Policy</h1>
        <p className="text-foreground opacity-70">
          How we handle your data on kokoro.wiki
        </p>
      </header>

      <main className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl mb-4 border-b border-foreground pb-2">Data Collection</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg mb-2">What We Collect</h3>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                <li><strong>Username</strong>: Used to identify your profile</li>
                <li><strong>Thoughts</strong>: Content you share in the "Current Thoughts" section</li>
                <li><strong>People Preferences</strong>: Content you share in the "People I Want to Talk To" section</li>
                <li><strong>Timestamps</strong>: When you create or update content</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg mb-2">What We Don't Collect</h3>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                <li>No email addresses (unless you choose to use one as your username)</li>
                <li>No IP addresses stored</li>
                <li>No tracking cookies</li>
                <li>No analytics or third-party trackers</li>
                <li>No personal information beyond what you explicitly share</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl mb-4 border-b border-foreground pb-2">Data Visibility</h2>
          
          <div className="p-4 border border-foreground bg-background">
            <h3 className="text-lg mb-2 text-foreground">⚠️ Important: Public Platform</h3>
            <p className="opacity-80">
              <strong>All content you share is publicly viewable</strong> by anyone who visits your profile at kokoro.wiki/[username]. 
              This includes your current thoughts, people preferences, and all historical entries.
            </p>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <h3 className="text-lg mb-2">Public Information</h3>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                <li>Your username and profile URL</li>
                <li>Your current thoughts and people preferences</li>
                <li>Your historical thoughts and people preferences</li>
                <li>All timestamps</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg mb-2">Private Information</h3>
              <p className="opacity-80">
                None - this is a public platform by design. Consider this carefully before sharing sensitive information.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl mb-4 border-b border-foreground pb-2">Data Storage & Security</h2>
          
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>All data is stored securely in Supabase (PostgreSQL database)</li>
            <li>Data is encrypted in transit and at rest</li>
            <li>Row Level Security (RLS) policies protect your data</li>
            <li>Prepared statements prevent SQL injection</li>
            <li>HTTPS encryption for all connections</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl mb-4 border-b border-foreground pb-2">Your Rights</h2>
          
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>You can update your thoughts and people preferences at any time</li>
            <li>Historical entries are preserved for continuity</li>
            <li>You can request data deletion by contacting us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl mb-4 border-b border-foreground pb-2">Future Plans</h2>
          
          <p className="opacity-80">
            We plan to add proper user authentication in the future, which will provide better data protection 
            and ownership verification. The current system is simplified for ease of use.
          </p>
        </section>

        <section>
          <h2 className="text-xl mb-4 border-b border-foreground pb-2">Contact</h2>
          
          <div className="opacity-80 space-y-2">
            <p>
              For privacy concerns or data deletion requests, please contact:
            </p>
            <p>
              <strong>Ryuzo Kijima</strong><br/>
              Email: <a href="mailto:ryuzo@kokororesearch.org" className="text-link hover:underline">ryuzo@kokororesearch.org</a><br/>
              Organization: <a href="https://kokororesearch.org" className="text-link hover:underline" target="_blank" rel="noopener noreferrer">Kokoro Research</a>
            </p>
            <p>
              Or create an issue on GitHub:{' '}
              <a 
                href="https://github.com/ryuzo-k/kokoro-wiki" 
                className="text-link hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/ryuzo-k/kokoro-wiki
              </a>
            </p>
          </div>
        </section>
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
