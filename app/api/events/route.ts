export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const events = await prisma.event.findMany({
    where: { userId: session.user.id },
    include: { sideQuestStep: true },
  })
  return NextResponse.json(events)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, location, lat, lng, startDate, endDate, isRecurring, recurrenceRule, sideQuestStepId } = body

  const userId = session.user.id
  if (!userId) {
    return NextResponse.json({ message: 'User ID not found' }, { status: 400 })
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        lat: lat || null,
        lng: lng || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isRecurring: isRecurring || false,
        recurrenceRule: recurrenceRule || null,
        userId: userId,
        sideQuestStepId: sideQuestStepId || null,
      },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
