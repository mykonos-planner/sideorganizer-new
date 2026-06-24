export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const steps = await prisma.sideQuestStep.findMany({
    where: { sideQuestId: params.id },
    orderBy: { order: 'asc' },
    select: { id: true, title: true, description: true },
  })
  return NextResponse.json(steps)
}
