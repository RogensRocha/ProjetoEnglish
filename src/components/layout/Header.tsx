"use client";

import { useSession } from "next-auth/react";
import { Search, Bell } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Estudante";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06] bg-surface-800/40 backdrop-blur-md">
      <div>
        {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-56 pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-500/40 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.06] transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/[0.08]">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-[11px] text-gray-500">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
