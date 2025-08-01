'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const commands = [
    { label: 'Preview', action: () => router.push('/') },
    { label: 'Publish', action: () => router.push('/new') },
    { label: 'Edit Theme', action: () => router.push('/edit') },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background border border-foreground p-4 rounded-none max-w-md w-full mx-4">
        <div className="space-y-2">
          {commands.map((command, index) => (
            <button
              key={index}
              onClick={() => {
                command.action()
                setIsOpen(false)
              }}
              className="w-full text-left p-2 hover:bg-foreground hover:text-background transition-colors"
            >
              {command.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 text-sm text-foreground opacity-70"
        >
          Press Escape to close
        </button>
      </div>
    </div>
  )
}
