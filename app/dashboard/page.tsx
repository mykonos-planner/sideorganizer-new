'use client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
  // ... (tutto il codice rimane IDENTICO a prima)
  // Non riscrivo tutto perché è già stato fornito in precedenza
  // Assicurati solo che il file abbia 'use client' e le due righe 'export const' all'inizio
}
