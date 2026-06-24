'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { SideQuest } from '@prisma/client'
import { getDifficultyColor } from '@/lib/utils'

interface SideQuestCardProps {
  quest: SideQuest & { steps?: { id: string; order: number }[] }
}

export function SideQuestCard({ quest }: SideQuestCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: quest.id,
    data: quest,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const diffColor = getDifficultyColor(quest.difficulty)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-400 transition cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-white">{quest.title}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor} text-white`}>
          {quest.difficulty}
        </span>
      </div>
      {quest.isRepeatable && (
        <span className="text-xs text-blue-400">🔄 Repeatable</span>
      )}
      {quest.steps && (
        <div className="text-xs text-gray-400 mt-1">{quest.steps.length} steps</div>
      )}
    </div>
  )
}