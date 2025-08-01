# kokoro-wiki README

Linktree風の個人プロフィールサイト。思想と話したい人を共有し、履歴として蓄積していくアプリ。

## Features

- **IBM Plex Mono** typography with monochrome palette (#111 text, #FAFAFA bg, #00BFFF links)
- **No animations** - generous vertical whitespace (line-height 1.8)
- **Linktree-style profile pages:**
  - `/` - ログイン画面（ユーザーネーム入力）
  - `/dashboard/[username]` - 編集画面（思想・話したい人を更新）
  - `/[username]` - 公開プロフィール（現在の内容＋過去の履歴）
- **履歴機能** - 更新するたびに過去のものが蓄積される
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

1. **ログイン:** トップページでユーザーネームを入力
2. **編集:** ダッシュボードで「現在の思想」と「話したい人」を更新
3. **公開:** あなたのURL `kokoro.wiki/[username]` で公開プロフィールを確認
4. **履歴:** 更新するたびに過去の内容が履歴として蓄積される

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript**
- **Tailwind CSS**
- **Supabase** for database
- **IBM Plex Mono** font

## GitHub

https://github.com/ryuzo-k/kokoro-wiki.git
