'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Step {
  id: string
  title: string
  description: string
}

export default function NewSideQuestPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('MEDIUM')
  const [isRepeatable, setIsRepeatable] = useState(false)
  const [maxRepeats, setMaxRepeats] = useState<number | ''>('')
  const [steps, setSteps] = useState<Step[]>([])
  const [stepTitle, setStepTitle] = useState('')
  const [stepDesc, setStepDesc] = useState('')
  const [loading, setLoading] = useState(false)

  const addStep = () => {
    if (!stepTitle.trim()) return
    setSteps([
      ...steps,
      { id: Date.now().toString(), title: stepTitle.trim(), description: stepDesc.trim() },
    ])
    setStepTitle('')
    setStepDesc('')
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      title,
      description,
      difficulty,
      isRepeatable,
      maxRepeats: isRepeatable ? Number(maxRepeats) : null,
      steps: steps.map(({ title, description }) => ({ title, description })),
    }

    try {
      const res = await fetch('/api/sidequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        alert('Failed to create sidequest')
      }
    } catch (error) {
      console.error(error)
      alert('Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 fade-in">
      <h1 className="text-3xl font-orbitron bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-6">
        Create New SideQuest
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-blue-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-300">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
            <option value="IMPOSSIBLE">Impossible</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="repeatable"
            checked={isRepeatable}
            onChange={(e) => setIsRepeatable(e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
          />
          <label htmlFor="repeatable" className="text-sm font-medium text-blue-300">
            Repeatable
          </label>
          {isRepeatable && (
            <div className="ml-4">
              <label className="text-sm text-gray-400 mr-2">Max Repeats:</label>
              <input
                type="number"
                value={maxRepeats}
                onChange={(e) => setMaxRepeats(e.target.value ? Number(e.target.value) : '')}
                className="w-20 px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
                min={1}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">Steps</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={stepTitle}
              onChange={(e) => setStepTitle(e.target.value)}
              placeholder="Step title"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
            />
            <input
              type="text"
              value={stepDesc}
              onChange={(e) => setStepDesc(e.target.value)}
              placeholder="Description (optional)"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
            />
            <button
              type="button"
              onClick={addStep}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
          {steps.length > 0 && (
            <ul className="mt-3 space-y-2">
              {steps.map((step, idx) => (
                <li key={step.id} className="flex justify-between items-center bg-gray-800 p-2 rounded-lg border border-gray-700">
                  <div>
                    <span className="text-white font-medium">{idx+1}. {step.title}</span>
                    {step.description && <span className="text-gray-400 text-sm ml-2">— {step.description}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create SideQuest'}
          </button>
        </div>
      </form>
    </div>
  )
}