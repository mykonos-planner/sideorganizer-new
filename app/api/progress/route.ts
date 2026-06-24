export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    include: { sideQuest: { include: { steps: true } } },
  })
  return NextResponse.json(progress)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { sideQuestId, stepId } = body

  const userId = session.user.id
  if (!userId) {
    return NextResponse.json({ message: 'User ID not found' }, { status: 400 })
  }

  try {
    let progress = await prisma.userProgress.findFirst({
      where: {
        userId: userId,
        sideQuestId,
      },
    })

    if (!progress) {
      progress = await prisma.userProgress.create({
        data: {
          userId: userId,
          sideQuestId,
          completedStepIds: [],
        },
      })
    }

    const updatedSteps = progress.completedStepIds.includes(stepId)
      ? progress.completedStepIds
      : [...progress.completedStepIds, stepId]

    const sideQuest = await prisma.sideQuest.findUnique({
      where: { id: sideQuestId },
      include: { steps: true },
    })
    
    const totalSteps = sideQuest?.steps?.length || 0
    const allCompleted = totalSteps > 0 && (sideQuest?.steps.every((s) => updatedSteps.includes(s.id)) ?? false)

    await prisma.userProgress.update({
      where: { id: progress.id },
      data: {
        completedStepIds: updatedSteps,
        isCompleted: allCompleted,
        repeatsDone: allCompleted ? progress.repeatsDone + 1 : progress.repeatsDone,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
