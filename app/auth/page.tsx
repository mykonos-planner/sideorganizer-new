'use client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const router = useRouter()

  const handleSubmit = async (data: {
    name?: string
    email: string
    password: string
  }) => {
    if (mode === 'login') {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (result?.error) {
        alert('Invalid credentials')
      } else {
        router.push('/dashboard')
      }
    } else {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        })
        router.push('/dashboard')
      } else {
        const error = await res.json()
        alert(error.message || 'Signup failed')
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-xl border border-blue-500/30 bg-black/50 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
        <h2 className="text-3xl font-orbitron text-center bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <div className="flex justify-center gap-4 mt-6 mb-8">
          <button
            onClick={() => setMode('login')}
            className={`px-6 py-2 rounded-full transition ${
              mode === 'login'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent border border-blue-400/40 text-blue-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`px-6 py-2 rounded-full transition ${
              mode === 'signup'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent border border-blue-400/40 text-blue-400'
            }`}
          >
            Sign Up
          </button>
        </div>
        <AuthForm mode={mode} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
