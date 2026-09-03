"use client";

import Card from "@/components/ui/Card";
import { BookOpen, CheckCircle2, Clock, Flame } from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      label: "Total de Conteúdos",
      value: stats?.totalItems || 0,
      icon: BookOpen,
      color: "text-brand-400",
      bgColor: "bg-brand-500/20",
    },
    {
      label: "Concluídos",
      value: stats?.completedItems || 0,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
    },
    {
      label: "Em Progresso",
      value: stats?.inProgressItems || 0,
      icon: Clock,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
    },
    {
      label: "Streak Atual",
      value: stats?.currentStreak || 0,
      icon: Flame,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      suffix: stats?.currentStreak === 1 ? " dia" : " dias",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className={`p-5 animate-in stagger-${i + 1}`}>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-white/[0.06] rounded w-24" />
                <div className="h-8 bg-white/[0.06] rounded w-16" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">{card.label}</span>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon size={16} className={card.color} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">
                  {card.value}
                  {card.suffix && (
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {card.suffix}
                    </span>
                  )}
                </p>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
