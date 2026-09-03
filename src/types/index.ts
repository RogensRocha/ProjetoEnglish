// ─── Content types ────────────────────────────────────────────────────────────

export type ContentType = "video" | "article" | "site";
export type ContentStatus = "todo" | "in_progress" | "done";
export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface ContentItem {
  id: string;
  userId: string;
  url: string;
  title: string;
  type: ContentType;
  thumbnailUrl: string | null;
  notes: string | null;
  status: ContentStatus;
  level: EnglishLevel;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

// ─── Habit types ──────────────────────────────────────────────────────────────

export interface HabitLog {
  id: string;
  userId: string;
  date: string;
  completed: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  todayCompleted: boolean;
  logs: HabitLog[];
}

// ─── Dashboard types ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  currentStreak: number;
  todayCompleted: boolean;
}

// ─── OG metadata ─────────────────────────────────────────────────────────────

export interface OGMetadata {
  title: string;
  description?: string;
  image?: string;
  type?: string;
  url: string;
}

// ─── API response types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface ContentFilters {
  search?: string;
  status?: ContentStatus | "";
  level?: EnglishLevel | "";
  tagIds?: string[];
}
