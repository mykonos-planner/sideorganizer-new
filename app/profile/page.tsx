'use client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getDifficultyColor, formatDate } from '@/lib/utils'

interface CompletedQuest {
  id: string
  sideQuest: {
    title: string
    difficulty: string
  }
  updatedAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [completed, setCompleted] = useState<CompletedQuest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth')
    } else if (status === 'authenticated') {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          setCompleted(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [status, router])

  if (loading) {
    return <div className="flex items-center justify-center h-[80vh] text-blue-400">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 fade-in">
      <div className="bg-gray-900/50 rounded-xl p-6 border border-blue-500/20 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
            {session?.user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{session?.user?.name || 'User'}</h1>
            <p className="text-gray-400">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-orbitron bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-4">
        Completed Quests History
      </h2>
      {completed.length === 0 ? (
        <p className="text-gray-500">No completed quests yet. Keep going!</p>
      ) : (
        <div className="space-y-3">
          {completed.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700"
            >
              <div>
                <span className="text-white font-medium">{item.sideQuest.title}</span>
                <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(item.sideQuest.difficulty)} text-white`}>
                  {item.sideQuest.difficulty}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                Completed {formatDate(new Date(item.updatedAt))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
