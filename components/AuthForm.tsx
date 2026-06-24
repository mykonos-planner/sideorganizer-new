'use client'

import { useState } from 'react'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (data: { name?: string; email: string; password: string }) => void
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name: mode === 'signup' ? name : undefined, email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mode === 'signup' && (
        <div>
          <label className="block text-sm font-medium text-blue-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
            required
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-blue-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
          required
          minLength={6}
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition"
      >
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </button>
    </form>
  )
}