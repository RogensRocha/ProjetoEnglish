import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    todo: "Para estudar",
    in_progress: "Estudando",
    done: "Concluído",
  };
  return labels[status] || status;
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    A1: "A1 — Iniciante",
    A2: "A2 — Elementar",
    B1: "B1 — Intermediário",
    B2: "B2 — Intermediário+",
    C1: "C1 — Avançado",
    C2: "C2 — Proficiente",
  };
  return labels[level] || level;
}

export function getContentTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    video: "🎬",
    article: "📄",
    site: "🌐",
  };
  return icons[type] || "📌";
}
