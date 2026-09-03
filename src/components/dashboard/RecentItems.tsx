"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getStatusLabel, getContentTypeIcon } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { ContentItem } from "@/types";

interface RecentItemsProps {
  items: ContentItem[];
  isLoading: boolean;
}

export default function RecentItems({ items, isLoading }: RecentItemsProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white">Atividade Recente</h3>
          <p className="text-sm text-gray-500 mt-0.5">Últimos conteúdos adicionados</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-white/[0.06]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/[0.06] rounded w-3/4" />
                <div className="h-3 bg-white/[0.06] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum conteúdo ainda</p>
          <p className="text-sm text-gray-600 mt-1">Adicione seu primeiro conteúdo para começar!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 5).map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.05] text-lg shrink-0">
                {getContentTypeIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="status" value={item.status}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  <Badge variant="level" value={item.level}>
                    {item.level}
                  </Badge>
                </div>
              </div>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
            </a>
          ))}
        </div>
      )}
    </Card>
  );
}
