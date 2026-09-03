"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getStatusLabel, getLevelLabel, getContentTypeIcon, formatDate } from "@/lib/utils";
import { ExternalLink, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { ContentItem, ContentStatus } from "@/types";

interface ContentCardProps {
  item: ContentItem;
  onUpdateStatus?: (id: string, newStatus: ContentStatus) => void;
  onDelete?: (id: string) => void;
}

export default function ContentCard({
  item,
  onUpdateStatus,
  onDelete,
}: ContentCardProps) {
  const isVideo = item.type === "video";

  return (
    <Card hover className="flex flex-col h-full overflow-hidden border-white/[0.08] group">
      {/* Thumbnail or Icon Preview Header */}
      {item.thumbnailUrl ? (
        <div className="relative h-44 w-full overflow-hidden bg-surface-800">
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-black/70 backdrop-blur-md text-white flex items-center gap-1.5 shadow-sm">
              <span>{getContentTypeIcon(item.type)}</span>
              <span className="capitalize">{item.type}</span>
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="level" value={item.level}>
              {item.level}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="h-28 w-full bg-gradient-to-r from-brand-900/40 to-surface-800 flex items-center justify-between px-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getContentTypeIcon(item.type)}</span>
            <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              {item.type}
            </span>
          </div>
          <Badge variant="level" value={item.level}>
            {item.level}
          </Badge>
        </div>
      )}

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2 leading-snug"
            >
              {item.title}
            </a>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
              title="Abrir link original"
            >
              <ExternalLink size={15} />
            </a>
          </div>

          {item.notes && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
              {item.notes}
            </p>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium border"
                  style={{
                    backgroundColor: `${tag.color}15`,
                    borderColor: `${tag.color}40`,
                    color: tag.color,
                  }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Badge variant="status" value={item.status}>
              {getStatusLabel(item.status)}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick status switchers */}
            {onUpdateStatus && (
              <>
                {item.status !== "todo" && (
                  <button
                    onClick={() => onUpdateStatus(item.id, "todo")}
                    title="Mover para A Fazer"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors"
                  >
                    <Clock size={14} />
                  </button>
                )}
                {item.status !== "in_progress" && (
                  <button
                    onClick={() => onUpdateStatus(item.id, "in_progress")}
                    title="Mover para Estudando"
                    className="p-1.5 rounded-lg text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <AlertCircle size={14} />
                  </button>
                )}
                {item.status !== "done" && (
                  <button
                    onClick={() => onUpdateStatus(item.id, "done")}
                    title="Mover para Concluído"
                    className="p-1.5 rounded-lg text-emerald-500/70 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  >
                    <CheckCircle2 size={14} />
                  </button>
                )}
              </>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                title="Excluir conteúdo"
                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
