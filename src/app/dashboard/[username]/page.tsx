'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  params: { username: string }
}

export default function Dashboard({ params }: Props) {
  const { username } = params
  const router = useRouter()
  
  // Current entries
  const [currentThought, setCurrentThought] = useState('')
  const [currentPeople, setCurrentPeople] = useState('')
  
  // Loading states
  const [isLoadingThought, setIsLoadingThought] = useState(false)
  const [isLoadingPeople, setIsLoadingPeople] = useState(false)
  
  // Load current entries on mount
  useEffect(() => {
    loadCurrentEntries()
  }, [username])

  const loadCurrentEntries = async () => {
    try {
      // Load latest thought
      const { data: thoughtData } = await supabase
        .from('thoughts')
        .select('content')
        .eq('username', username)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (thoughtData) {
        setCurrentThought(thoughtData.content)
      }

      // Load latest people entry
      const { data: peopleData } = await supabase
        .from('people_want_to_talk')
        .select('content')
        .eq('username', username)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (peopleData) {
        setCurrentPeople(peopleData.content)
      }
    } catch (error) {
      console.error('Error loading current entries:', error)
    }
  }

  const handleSaveThought = async () => {
    if (!currentThought.trim() || isLoadingThought) return
    
    setIsLoadingThought(true)
    try {
      const { error } = await supabase
        .from('thoughts')
        .insert([{
          username,
          content: currentThought.trim()
        }])

      if (error) throw error
      
      // Clear the input after successful save
      setCurrentThought('')
      alert('思想を保存しました！')
    } catch (error) {
      console.error('Error saving thought:', error)
      alert('保存に失敗しました')
    } finally {
      setIsLoadingThought(false)
    }
  }

  const handleSavePeople = async () => {
    if (!currentPeople.trim() || isLoadingPeople) return
    
    setIsLoadingPeople(true)
    try {
      const { error } = await supabase
        .from('people_want_to_talk')
        .insert([{
          username,
          content: currentPeople.trim()
        }])

      if (error) throw error
      
      // Clear the input after successful save
      setCurrentPeople('')
      alert('話したい人を保存しました！')
    } catch (error) {
      console.error('Error saving people:', error)
      alert('保存に失敗しました')
    } finally {
      setIsLoadingPeople(false)
    }
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <header className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl">@{username} のダッシュボード</h1>
          <button
            onClick={() => router.push(`/${username}`)}
            className="text-link hover:underline"
          >
            プロフィールを見る
          </button>
        </div>
        <p className="text-foreground opacity-70">
          あなたのURL: <span className="font-medium">kokoro.wiki/{username}</span>
        </p>
      </header>

      <main className="space-y-12">
        {/* 思想セクション */}
        <section className="space-y-6">
          <h2 className="text-xl border-b border-foreground pb-2">現在の思想</h2>
          
          <div className="space-y-4">
            <textarea
              value={currentThought}
              onChange={(e) => setCurrentThought(e.target.value)}
              placeholder="今の思想、考え、アイデアを書いてください..."
              className="w-full h-32 p-4 border border-foreground bg-background text-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-link"
              disabled={isLoadingThought}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground opacity-70">
                {currentThought.length} 文字
              </span>
              <button
                onClick={handleSaveThought}
                disabled={!currentThought.trim() || isLoadingThought}
                className="px-6 py-2 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingThought ? '保存中...' : '思想を更新'}
              </button>
            </div>
          </div>
        </section>

        {/* 話したい人セクション */}
        <section className="space-y-6">
          <h2 className="text-xl border-b border-foreground pb-2">話したい人</h2>
          
          <div className="space-y-4">
            <textarea
              value={currentPeople}
              onChange={(e) => setCurrentPeople(e.target.value)}
              placeholder="どんな人と話したいか、どんな話題に興味があるかを書いてください..."
              className="w-full h-32 p-4 border border-foreground bg-background text-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-link"
              disabled={isLoadingPeople}
            />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground opacity-70">
                {currentPeople.length} 文字
              </span>
              <button
                onClick={handleSavePeople}
                disabled={!currentPeople.trim() || isLoadingPeople}
                className="px-6 py-2 bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingPeople ? '保存中...' : '話したい人を更新'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 pt-8 border-t border-foreground opacity-50 text-center">
        <p className="text-sm">
          更新すると履歴として蓄積されます
        </p>
      </footer>
    </div>
  )
}
