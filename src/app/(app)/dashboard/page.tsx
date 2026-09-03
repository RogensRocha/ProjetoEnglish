"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import RecentItems from "@/components/dashboard/RecentItems";
import type { DashboardStats, StreakData, ContentItem } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [recentItems, setRecentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, habitsRes, contentRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/habits"),
        fetch("/api/content"),
      ]);

      if (statsRes.ok) {
        const json = await statsRes.json();
        setStats(json.data);
      }

      if (habitsRes.ok) {
        const json = await habitsRes.json();
        setStreakData(json.data);
      }

      if (contentRes.ok) {
        const json = await contentRes.json();
        setRecentItems(json.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleToggleToday = async () => {
    try {
      const res = await fetch("/api/habits", { method: "POST" });
      if (res.ok) {
        // Atualizar hábitos e stats
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Erro ao alternar hábito:", error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Header
        title="Visão Geral"
        subtitle="Monitore seu progresso e ritmo diário de estudos em inglês"
      />

      {/* Estatísticas principais */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Grid: Calendário de Streak + Conteúdos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StreakCalendar
          streakData={streakData}
          isLoading={isLoading}
          onToggleToday={handleToggleToday}
        />
        <RecentItems items={recentItems} isLoading={isLoading} />
      </div>
    </div>
  );
}
