# kokoro-wiki README

A Linktree-style personal profile site where you share your thoughts and who you want to connect with, building a history over time.

## Features

- **IBM Plex Mono** typography with monochrome palette (#111 text, #FAFAFA bg, #00BFFF links)
- **No animations** - generous vertical whitespace (line-height 1.8)
- **Linktree-style profile pages:**
  - `/` - Login page (username input)
  - `/dashboard/[username]` - Edit page (update thoughts & people you want to talk to)
  - `/[username]` - Public profile (current content + past history)
- **History functionality** - Each update saves previous content as history
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
   -- thoughts table
   CREATE TABLE thoughts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- people_want_to_talk table
   CREATE TABLE people_want_to_talk (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS (optional)
   ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE people_want_to_talk ENABLE ROW LEVEL SECURITY;
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

1. **Login:** Enter your username on the homepage
2. **Edit:** Update "Current Thoughts" and "People I Want to Talk To" on the dashboard
3. **Share:** View your public profile at `kokoro.wiki/[username]`
4. **History:** Each update saves previous content as history

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Supabase** for database
- **IBM Plex Mono** font

## GitHub

https://github.com/ryuzo-k/kokoro-wiki.git
