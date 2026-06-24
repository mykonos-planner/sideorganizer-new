export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const completed = await prisma.userProgress.findMany({
    where: {
      userId: session.user.id,
      isCompleted: true,
    },
    include: {
      sideQuest: true,
    },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(completed)
}
