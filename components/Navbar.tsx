'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'

interface NavbarProps {
  session: Session | null
}

export default function Navbar({ session }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-blue-500/20 px-6 py-3 flex items-center justify-between">
      <Link href="/" className="font-orbitron text-xl bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
        SideOrganizer
      </Link>
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/dashboard" className="text-blue-300 hover:text-blue-100 transition">
              Dashboard
            </Link>
            <Link href="/profile" className="text-blue-300 hover:text-blue-100 transition">
              Profile
            </Link>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              className="px-4 py-1 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth" className="px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
