'use client'

import { useDroppable } from '@dnd-kit/core'
import { Event } from '@prisma/client'
import { format } from 'date-fns'

interface CalendarViewProps {
  events: Event[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  const eventsByDay: { [key: string]: Event[] } = {}
  days.forEach((day) => {
    const key = format(day, 'yyyy-MM-dd')
    eventsByDay[key] = events.filter((e) => {
      const start = new Date(e.startDate)
      return format(start, 'yyyy-MM-dd') === key
    })
  })

  return (
    <div className="grid grid-cols-7 gap-2 h-full">
      {days.map((day) => {
        const key = format(day, 'yyyy-MM-dd')
        const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
        const { setNodeRef, isOver } = useDroppable({
          id: `day-${key}`,
        })

        return (
          <div
            key={key}
            ref={setNodeRef}
            className={`relative p-2 rounded-lg border transition-all ${
              isOver ? 'border-blue-500 bg-blue-500/20' : 'border-gray-700'
            } ${isToday ? 'border-blue-400' : ''}`}
          >
            <div className="text-center text-sm font-medium text-blue-300">
              {format(day, 'EEE')}
              <br />
              <span className={`text-lg ${isToday ? 'text-blue-400' : 'text-white'}`}>
                {format(day, 'd')}
              </span>
            </div>
            <div className="mt-1 space-y-1 max-h-[calc(100%-3rem)] overflow-y-auto">
              {(eventsByDay[key] || []).map((event) => (
                <div
                  key={event.id}
                  className="text-xs bg-blue-900/30 border-l-2 border-blue-400 px-1 py-0.5 rounded truncate"
                  title={event.title}
                >
                  {format(new Date(event.startDate), 'HH:mm')} {event.title}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}