"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  LogOut,
  Flame,
  GraduationCap,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Conteúdo", icon: BookOpen },
  { href: "/content/new", label: "Adicionar", icon: PlusCircle },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 flex flex-col",
        "bg-surface-800/80 backdrop-blur-xl border-r border-white/[0.06]",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-brand shadow-glow-brand">
          <GraduationCap size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">LearnIt</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">English</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-500/20 text-brand-300 border border-brand-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <Icon size={18} />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Streak mini */}
      <div className="mx-3 mb-3 p-4 rounded-xl bg-gradient-card border border-white/[0.06]">
        <div className="flex items-center gap-2 text-sm">
          <Flame size={18} className="text-orange-400" />
          <span className="text-gray-300">Streak Ativo</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Continue estudando!</p>
      </div>

      {/* Footer Info */}
      <div className="px-6 pb-4">
        <p className="text-[11px] text-gray-600 text-center">LearnIt English v1.0</p>
      </div>
    </aside>
  );
}
