'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface DropEventModalProps {
  sideQuestId: string
  day: Date
  onClose: () => void
  onSuccess: () => void
}

export function DropEventModal({ sideQuestId, day, onClose, onSuccess }: DropEventModalProps) {
  const { data: session } = useSession()
  const [steps, setSteps] = useState<{ id: string; title: string }[]>([])
  const [selectedStepId, setSelectedStepId] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/sidequests/${sideQuestId}/steps`)
      .then((res) => res.json())
      .then((data) => {
        setSteps(data)
        if (data.length > 0) setSelectedStepId(data[0].id)
      })
      .catch(console.error)
  }, [sideQuestId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) {
      alert('You must be logged in')
      return
    }
    setLoading(true)

    const startDateTime = new Date(day)
    const [sh, sm] = (startTime || '09:00').split(':').map(Number)
    startDateTime.setHours(sh || 9, sm || 0, 0, 0)

    const endDateTime = new Date(day)
    const [eh, em] = (endTime || '10:00').split(':').map(Number)
    endDateTime.setHours(eh || 10, em || 0, 0, 0)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Quest: ${steps.find(s => s.id === selectedStepId)?.title || 'Step'}`,
          description: `Scheduled from sidequest ${sideQuestId}`,
          location,
          lat: 0,
          lng: 0,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          sideQuestStepId: selectedStepId,
        }),
      })

      if (response.ok) {
        await fetch('/api/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sideQuestId,
            stepId: selectedStepId,
          }),
        })
        onSuccess()
      } else {
        alert('Failed to schedule event')
      }
    } catch (error) {
      console.error(error)
      alert('Error scheduling event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-blue-500/30 shadow-xl">
        <h2 className="text-2xl font-orbitron bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-4">
          Schedule Quest Step
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-300">Select Step</label>
            <select
              value={selectedStepId}
              onChange={(e) => setSelectedStepId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
            >
              {steps.map((step) => (
                <option key={step.id} value={step.id}>{step.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-blue-300">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-300">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-300">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
              placeholder="Address"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
