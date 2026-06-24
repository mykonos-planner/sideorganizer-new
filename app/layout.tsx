import './globals.css'
import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { auth } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })

export const metadata: Metadata = {
  title: 'SideOrganizer',
  description: 'Organize your life, conquer your missions.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.variable} ${orbitron.variable} font-sans bg-black text-white min-h-screen`}>
        <Navbar session={session} />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
