export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const sideQuests = await prisma.sideQuest.findMany({
    include: { steps: { orderBy: { order: 'asc' } } },
  })
  return NextResponse.json(sideQuests)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, difficulty, isRepeatable, maxRepeats, steps } = body

  const userId = session.user.id
  if (!userId) {
    return NextResponse.json({ message: 'User ID not found' }, { status: 400 })
  }

  try {
    const sideQuest = await prisma.sideQuest.create({
      data: {
        title,
        description,
        difficulty,
        isRepeatable,
        maxRepeats: isRepeatable ? maxRepeats : null,
        createdById: userId,
        steps: {
          create: steps.map((step: any, index: number) => ({
            title: step.title,
            description: step.description,
            order: index,
          })),
        },
      },
      include: { steps: true },
    })
    return NextResponse.json(sideQuest, { status: 201 })
  } catch (error) {
    console.error('Error creating sidequest:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
