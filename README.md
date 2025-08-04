# Kokoro Wiki

*Share your thoughts and build relationships that feel right to you.*

---

Hi, I'm Ryuzo.
I'm 17 years old and came from Japan to San Francisco.
I've been doing a bit of research on the human mind.
Through that, I started to think—maybe we can build better relationships by openly sharing our thoughts.
There's a lot of miscommunication in the world.
So, I created a service called Kokoro Wiki.

Create your own personal page now, and try sharing your honest thoughts.
"Kokoro" means heart or mind in Japanese.
Let's all become just a little more open.
Kokoro.wiki is here to help with that.

## How It Works

It's very easy to use:
First, go to [kokoro.wiki](https://kokoro.wiki) and search for your username.
Short names are simple, beautiful, and recommended.
Then, register and log in.

You'll see your own personal dashboard.
Write your first "thought" there.
Try sharing how you're doing right now.
Also, write about what kind of people you want to talk to.
Maybe you want to be alone.
Or maybe, you're feeling a bit lonely.

Then take a look at the link to your own page.
It reflects your words just as they are.

I always think about how we can build relationships where people can speak more honestly.
There is a lot of miscommunication—misunderstandings and disconnects—in this world.
That's exactly why we should build relationships that feel comfortable for us.

Let's publish our thoughts.
Put this link in your SNS bio.
Instead of a portfolio that only shows your past achievements,
let's share your current thoughts and feelings.

---

I dropped out of high school to understand the human mind and to make humanity a little better. In the age of AI, this kind of effort is more necessary than ever.

For now, I only want to talk with people I feel close to. This is my time to build.

**Contact**: ryuzo@kokororesearch.org

## Technical Features

- **Next.js 14** with App Router and TypeScript
- **Supabase** for authentication, database, and Row Level Security (RLS)
- **Tailwind CSS** for styling with custom monochrome design
- **IBM Plex Mono** typography with generous whitespace (line-height 1.8)
- **Minimalist UI** - No animations, clean design focused on content
- **Real-time authentication** with email confirmation
- **Profile pages:**
  - `/` - Home page with username search and signup
  - `/auth` - Authentication page for login/signup
  - `/dashboard/[username]` - Personal dashboard for editing thoughts
  - `/[username]` - Public profile displaying current thoughts and history
- **History functionality** - Each update saves previous content as timestamped history
- **Row Level Security** - Users can only edit their own content
- **Responsive design** - Works on desktop and mobile

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

## Privacy & Security

⚠️ **Important**: This is a **public platform** by design. All content shared is publicly viewable.

- **Public Data**: Username, thoughts, people preferences, and all history
- **No Tracking**: No analytics, cookies, or IP logging
- **Secure Storage**: Supabase with RLS policies and encryption
- **Data Control**: Users can update content; deletion available on request
- **Future Auth**: Planning to add proper authentication for better protection

See [PRIVACY.md](PRIVACY.md) for full privacy policy.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Supabase** for database
- **IBM Plex Mono** font

## GitHub

https://github.com/ryuzo-k/kokoro-wiki.git
