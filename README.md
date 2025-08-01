# kokoro-wiki README

A minimalist wiki for thoughts and connections, built with Next.js 14 and Supabase.

## Features

- **IBM Plex Mono** typography with monochrome palette (#111 text, #FAFAFA bg, #00BFFF links)
- **No animations** - generous vertical whitespace (line-height 1.8)
- **Three main pages:**
  - `/new` - Large Markdown textarea with Cmd+Enter publishing
  - `/edit` - Toggle WANT/AVOID mode + textarea for talk state
  - `/[username]` - Public profile with timeline and current talk state
- **Auto-save drafts** to localStorage every 1 second
- **Command palette** - Press Esc to access Preview, Publish, Edit Theme
- **OG image API** - Renders first line as heading if it starts with "# "
- **ISR** - Profile pages revalidate every 60 seconds

## Setup

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/ryuzo-k/kokoro-wiki.git
   cd kokoro-wiki
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key

3. **Create database tables:**
   ```sql
   -- thought_entries table
   CREATE TABLE thought_entries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- talk_state table
   CREATE TABLE talk_state (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT UNIQUE NOT NULL,
     mode TEXT CHECK (mode IN ('WANT', 'AVOID')) NOT NULL,
     people_text TEXT,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS (optional)
   ALTER TABLE thought_entries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE talk_state ENABLE ROW LEVEL SECURITY;
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

- **Create thoughts:** Go to `/new`, write in Markdown, press Cmd+Enter to publish
- **Edit talk state:** Go to `/edit`, toggle WANT/AVOID, describe your preferences
- **View profiles:** Visit `/[username]` to see public timeline and current talk state
- **Command palette:** Press Esc anywhere to access quick actions

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Supabase** for database
- **IBM Plex Mono** font

## GitHub

https://github.com/ryuzo-k/kokoro-wiki.git
