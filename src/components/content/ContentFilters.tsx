"use client";

import { Search, Filter, X } from "lucide-react";
import type { ContentFilters as FiltersType, Tag } from "@/types";

interface ContentFiltersProps {
  filters: FiltersType;
  onChange: (newFilters: FiltersType) => void;
  tags: Tag[];
}

export default function ContentFilters({
  filters,
  onChange,
  tags,
}: ContentFiltersProps) {
  const statusOptions = [
    { value: "", label: "Todos os status" },
    { value: "todo", label: "Para estudar" },
    { value: "in_progress", label: "Estudando" },
    { value: "done", label: "Concluído" },
  ];

  const levelOptions = [
    { value: "", label: "Todos os níveis" },
    { value: "A1", label: "A1 (Iniciante)" },
    { value: "A2", label: "A2 (Elementar)" },
    { value: "B1", label: "B1 (Intermediário)" },
    { value: "B2", label: "B2 (Intermediário+)" },
    { value: "C1", label: "C1 (Avançado)" },
    { value: "C2", label: "C2 (Proficiente)" },
  ];

  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.level || (filters.tagIds && filters.tagIds.length > 0)
  );

  const clearFilters = () => {
    onChange({
      search: "",
      status: "",
      level: "",
      tagIds: [],
    });
  };

  const handleToggleTag = (tagId: string) => {
    const currentTags = filters.tagIds || [];
    const isSelected = currentTags.includes(tagId);
    const updated = isSelected
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId];
    onChange({ ...filters, tagIds: updated });
  };

  return (
    <div className="glass p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="sm:col-span-6 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por título, anotações ou link..."
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
          />
        </div>

        {/* Status select */}
        <div className="sm:col-span-3">
          <select
            value={filters.status || ""}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value as FiltersType["status"] })
            }
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface-800 text-gray-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Level select */}
        <div className="sm:col-span-3">
          <select
            value={filters.level || ""}
            onChange={(e) =>
              onChange({ ...filters, level: e.target.value as FiltersType["level"] })
            }
            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 cursor-pointer"
          >
            {levelOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface-800 text-gray-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.04]">
          <span className="text-xs text-gray-500 font-medium mr-1 flex items-center gap-1">
            <Filter size={12} /> Tags:
          </span>
          {tags.map((tag) => {
            const isSelected = (filters.tagIds || []).includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleToggleTag(tag.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-brand-500 text-white shadow-glow-brand"
                    : "bg-white/[0.04] text-gray-400 hover:text-gray-200 hover:bg-white/[0.08]"
                }`}
              >
                #{tag.name}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <X size={13} />
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
