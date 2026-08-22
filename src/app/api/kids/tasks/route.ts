import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const member = await prisma.familyMember.findFirst({
    where: { userId: session.user.id },
  })
  if (!member) return NextResponse.json({ error: "No family" }, { status: 404 })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tasks = await prisma.task.findMany({
    where: {
      familyId: member.familyId,
      status: "ACTIVE",
      assignees: { some: { id: member.id } },
      // 每日任务每天出现; 一次性任务完成过 (非拒绝) 后不再显示
      OR: [
        { type: { not: "ONETIME" } },
        {
          type: "ONETIME",
          completions: {
            none: { memberId: member.id, status: { not: "REJECTED" } },
          },
        },
      ],
    },
    include: {
      completions: {
        where: { date: { gte: today }, memberId: member.id },
        select: { id: true, status: true, pointsEarned: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  })

  return NextResponse.json({ tasks })
}
