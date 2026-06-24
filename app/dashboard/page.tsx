'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { MapView } from '@/components/MapView'
import { CalendarView } from '@/components/CalendarView'
import { SideQuestCard } from '@/components/SideQuestCard'
import { ProgressBar } from '@/components/ProgressBar'
import { NewEventModal } from '@/components/NewEventModal'
import { DropEventModal } from '@/components/DropEventModal'
import { SideQuest, UserProgress, Event } from '@prisma/client'

// Tipi estesi per gestire i dati
type SideQuestWithSteps = SideQuest & { steps: { id: string; title: string; order: number }[] }
type UserProgressWithQuest = UserProgress & { sideQuest: SideQuest & { steps?: { id: string; order: number }[] } }

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [sideQuests, setSideQuests] = useState<SideQuestWithSteps[]>([])
  const [userProgress, setUserProgress] = useState<UserProgressWithQuest[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [filterText, setFilterText] = useState('')
  const [filterRepeatable, setFilterRepeatable] = useState<'all' | 'repeatable' | 'nonrepeatable'>('all')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dropModalOpen, setDropModalOpen] = useState(false)
  const [dropData, setDropData] = useState<{ sideQuestId: string; day: Date } | null>(null)
  const [newEventModalOpen, setNewEventModalOpen] = useState(false)

  // Fetch dati
  const fetchData = async () => {
    try {
      const [sqRes, progRes, evRes] = await Promise.all([
        fetch('/api/sidequests'),
        fetch('/api/progress'),
        fetch('/api/events'),
      ])
      if (sqRes.ok) {
        const data = await sqRes.json()
        setSideQuests(data)
      }
      if (progRes.ok) {
        const data = await progRes.json()
        setUserProgress(data)
      }
      if (evRes.ok) {
        const data = await evRes.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  // Filtra le sidequest
  const filteredQuests = sideQuests.filter((q) => {
    const matchTitle = q.title.toLowerCase().includes(filterText.toLowerCase())
    if (filterRepeatable === 'repeatable') return matchTitle && q.isRepeatable
    if (filterRepeatable === 'nonrepeatable') return matchTitle && !q.isRepeatable
    return matchTitle
  })

  // Gestione Drag & Drop
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    if (over.id.toString().startsWith('day-')) {
      const dayStr = over.id.toString().replace('day-', '')
      const day = new Date(dayStr)
      const sideQuestId = active.id.toString()
      setDropData({ sideQuestId, day })
      setDropModalOpen(true)
    }
  }

  const handleDropModalClose = (refetch = false) => {
    setDropModalOpen(false)
    setDropData(null)
    if (refetch) fetchData()
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4">
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
          {/* LEFT COLUMN - SideQuest Library */}
          <div className="md:col-span-3 bg-gray-900/50 rounded-xl p-4 border border-blue-500/20 h-[calc(100vh-6rem)] overflow-y-auto">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Available Quests</h2>
            <input
              type="text"
              placeholder="Search quests..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white mb-3"
            />
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilterRepeatable('all')}
                className={`px-3 py-1 rounded-full text-sm ${filterRepeatable === 'all' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRepeatable('repeatable')}
                className={`px-3 py-1 rounded-full text-sm ${filterRepeatable === 'repeatable' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Repeatable
              </button>
              <button
                onClick={() => setFilterRepeatable('nonrepeatable')}
                className={`px-3 py-1 rounded-full text-sm ${filterRepeatable === 'nonrepeatable' ? 'bg-blue-600' : 'bg-gray-700'}`}
              >
                Non-Repeatable
              </button>
            </div>
            <div className="space-y-2">
              {filteredQuests.map((quest) => (
                <SideQuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          </div>

          {/* CENTER COLUMN - Map + Calendar */}
          <div className="md:col-span-6 flex flex-col gap-4 h-[calc(100vh-6rem)]">
            <div className="flex-1 bg-gray-900/50 rounded-xl overflow-hidden border border-blue-500/20 relative min-h-[200px]">
              <MapView events={events} />
            </div>
            <div className="flex-1 bg-gray-900/50 rounded-xl p-2 border border-blue-500/20 overflow-hidden">
              <CalendarView events={events} />
            </div>
          </div>

          {/* RIGHT COLUMN - Progress + Actions */}
          <div className="md:col-span-3 bg-gray-900/50 rounded-xl p-4 border border-blue-500/20 h-[calc(100vh-6rem)] flex flex-col relative">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">In Progress</h2>
            <div className="flex-1 overflow-y-auto space-y-4">
              {userProgress
                .filter((p) => !p.isCompleted)
                .map((p) => {
                  // CORREZIONE: gestione sicura di steps
                  const totalSteps = (p.sideQuest as any).steps?.length || 1
                  const completed = p.completedStepIds.length
                  const progress = Math.min((completed / totalSteps) * 100, 100)
                  return (
                    <div key={p.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">{p.sideQuest.title}</span>
                        <span className="text-gray-400">{Math.round(progress)}%</span>
                      </div>
                      <ProgressBar value={progress} />
                    </div>
                  )
                })}
              {userProgress.filter((p) => !p.isCompleted).length === 0 && (
                <p className="text-gray-500 text-sm">No active quests</p>
              )}
            </div>

            {/* User Avatar */}
            <div className="mt-4 flex items-center gap-3 border-t border-blue-500/20 pt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold">
                {session?.user?.name?.[0] || 'U'}
              </div>
              <div>
                <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
              </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-3">
              <button
                onClick={() => setNewEventModalOpen(true)}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:shadow-lg transition"
              >
                + New Event
              </button>
              <button
                onClick={() => router.push('/sidequest/new')}
                className="flex-1 py-2 rounded-lg border border-blue-500 text-blue-400 font-semibold hover:bg-blue-500/10 transition"
              >
                + New Quest
              </button>
            </div>
          </div>
        </div>

        {/* DragOverlay */}
        <DragOverlay>
          {activeId ? (
            <div className="p-3 bg-gray-800 border border-blue-500 rounded-lg shadow-lg">
              {sideQuests.find((q) => q.id === activeId)?.title}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      {newEventModalOpen && (
        <NewEventModal
          onClose={() => setNewEventModalOpen(false)}
          onSuccess={() => { setNewEventModalOpen(false); fetchData(); }}
        />
      )}
      {dropModalOpen && dropData && (
        <DropEventModal
          sideQuestId={dropData.sideQuestId}
          day={dropData.day}
          onClose={() => handleDropModalClose(false)}
          onSuccess={() => handleDropModalClose(true)}
        />
      )}
    </div>
  )
}
