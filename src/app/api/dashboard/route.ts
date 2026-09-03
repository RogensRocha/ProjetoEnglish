import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/user";

// GET — Dashboard statistics
export async function GET() {
  try {
    const userId = await getUserId();

    const [totalItems, completedItems, inProgressItems, habitData] = await Promise.all([
      prisma.contentItem.count({ where: { userId } }),
      prisma.contentItem.count({ where: { userId, status: "done" } }),
      prisma.contentItem.count({ where: { userId, status: "in_progress" } }),
      prisma.habitLog.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 30,
      }),
    ]);

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneDayMs = 86400000;

    const sortedDates = habitData
      .map((log: any) => {
        const d = new Date(log.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
      .sort((a: number, b: number) => b - a);

    const todayTime = today.getTime();
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

    return NextResponse.json({
      data: {
        totalItems,
        completedItems,
        inProgressItems,
        currentStreak,
        todayCompleted,
      },
    });
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
