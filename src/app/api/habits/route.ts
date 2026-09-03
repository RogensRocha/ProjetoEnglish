import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

// GET — Get habit logs for the current user
export async function GET() {
  try {
    const userId = await getUserId();

    const logs = await prisma.habitLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 60,
    });

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedDates = logs
      .map((log: any) => {
        const d = new Date(log.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
      .sort((a: number, b: number) => b - a);

    const todayTime = today.getTime();
    const oneDayMs = 86400000;
    const todayCompleted = sortedDates.includes(todayTime);

    let currentStreak = 0;
    let checkDate = todayCompleted ? todayTime : todayTime - oneDayMs;

    for (const dateTime of sortedDates) {
      if (dateTime === checkDate) {
        currentStreak++;
        checkDate -= oneDayMs;
      } else if (dateTime < checkDate) {
        break;
      }
    }

    // Longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: number | null = null;

    for (const dateTime of [...sortedDates].sort((a, b) => a - b)) {
      if (prevDate === null || dateTime - prevDate === oneDayMs) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
      prevDate = dateTime;
    }

    return NextResponse.json({
      data: {
        currentStreak,
        longestStreak,
        todayCompleted,
        logs,
      },
    });
  } catch (error) {
    console.error("Habits GET error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST — Toggle today's habit
export async function POST() {
  try {
    const userId = await getUserId();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.habitLog.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (existing) {
      await prisma.habitLog.delete({ where: { id: existing.id } });
      return NextResponse.json({ data: { completed: false } });
    }

    await prisma.habitLog.create({
      data: {
        userId,
        date: today,
        completed: true,
      },
    });

    return NextResponse.json({ data: { completed: true } }, { status: 201 });
  } catch (error) {
    console.error("Habits POST error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
