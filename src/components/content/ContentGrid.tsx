"use client";

import ContentCard from "./ContentCard";
import type { ContentItem, ContentStatus } from "@/types";
import Link from "next/link";
import { PlusCircle, SearchX } from "lucide-react";
import Button from "@/components/ui/Button";

interface ContentGridProps {
  items: ContentItem[];
  isLoading: boolean;
  onUpdateStatus?: (id: string, status: ContentStatus) => void;
  onDelete?: (id: string) => void;
}

export default function ContentGrid({
  items,
  isLoading,
  onUpdateStatus,
  onDelete,
}: ContentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden animate-pulse h-80"
          >
            <div className="h-40 bg-white/[0.05]" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-white/[0.05] rounded w-3/4" />
              <div className="h-4 bg-white/[0.05] rounded w-1/2" />
              <div className="h-6 bg-white/[0.05] rounded w-1/3 pt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="glass p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
          <SearchX size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Nenhum conteúdo encontrado</h3>
          <p className="text-sm text-gray-400">
            Tente ajustar os filtros ou adicione novos materiais de estudo.
          </p>
        </div>
        <Link href="/content/new">
          <Button variant="primary" size="md">
            <PlusCircle size={16} />
            Adicionar Conteúdo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          item={item}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
