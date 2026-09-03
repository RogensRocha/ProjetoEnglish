"use client";

import { useMemo } from "react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { StreakData } from "@/types";

interface StreakCalendarProps {
  streakData: StreakData | null;
  isLoading: boolean;
  onToggleToday: () => void;
}

export default function StreakCalendar({ streakData, isLoading, onToggleToday }: StreakCalendarProps) {
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedDates = new Set(
      (streakData?.logs || []).map((log) => {
        const d = new Date(log.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    // Show last 28 days (4 weeks)
    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      result.push({
        date,
        completed: completedDates.has(date.getTime()),
        isToday: i === 0,
      });
    }

    return result;
  }, [streakData]);

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white">Streak de Estudo</h3>
          <p className="text-sm text-gray-500 mt-0.5">Últimos 28 dias</p>
        </div>
        {streakData && (
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{streakData.currentStreak}</p>
              <p className="text-gray-500 text-xs">Atual</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-400">{streakData.longestStreak}</p>
              <p className="text-gray-500 text-xs">Recorde</p>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, i) => (
              <div key={i} className="text-center text-[10px] text-gray-600 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => (
              <button
                key={i}
                onClick={day.isToday ? onToggleToday : undefined}
                disabled={!day.isToday}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-xs transition-all duration-200 relative",
                  day.completed
                    ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                    : "bg-white/[0.03] text-gray-600 border border-white/[0.04]",
                  day.isToday && !day.completed && "border-brand-500/40 hover:bg-brand-500/20 cursor-pointer ring-1 ring-brand-500/20",
                  day.isToday && day.completed && "border-emerald-500/50 hover:bg-emerald-500/40 cursor-pointer glow-success",
                  !day.isToday && "cursor-default"
                )}
                title={
                  day.isToday
                    ? day.completed
                      ? "Clique para desmarcar"
                      : "Clique para marcar como estudado"
                    : day.date.toLocaleDateString("pt-BR")
                }
              >
                {day.date.getDate()}
                {day.completed && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/30" />
              Estudou
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-white/[0.03] border border-white/[0.04]" />
              Não estudou
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
