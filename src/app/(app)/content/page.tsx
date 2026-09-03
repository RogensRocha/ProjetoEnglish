"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import ContentFilters from "@/components/content/ContentFilters";
import ContentGrid from "@/components/content/ContentGrid";
import Button from "@/components/ui/Button";
import { PlusCircle } from "lucide-react";
import type { ContentItem, ContentFilters as FiltersType, Tag, ContentStatus } from "@/types";

export default function ContentListPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FiltersType>({
    search: "",
    status: "",
    level: "",
    tagIds: [],
  });

  // Load tags once
  useEffect(() => {
    async function loadTags() {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const json = await res.json();
          setTags(json.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar tags:", err);
      }
    }
    loadTags();
  }, []);

  // Fetch content based on filters
  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.level) params.set("level", filters.level);
      if (filters.tagIds && filters.tagIds.length > 0) {
        params.set("tagIds", filters.tagIds.join(","));
      }

      const res = await fetch(`/api/content?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setItems(json.data || []);
      }
    } catch (err) {
      console.error("Erro ao buscar conteúdos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContent();
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [fetchContent]);

  // Update status quickly from card
  const handleUpdateStatus = async (id: string, newStatus: ContentStatus) => {
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este conteúdo?")) return;

    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Erro ao remover item:", err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Header
          title="Biblioteca de Conteúdos"
          subtitle="Seus vídeos, artigos e materiais de estudo organizados em um só lugar"
        />
        <div className="shrink-0">
          <Link href="/content/new">
            <Button variant="primary" size="md">
              <PlusCircle size={18} />
              Novo Conteúdo
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter toolbar */}
      <ContentFilters
        filters={filters}
        onChange={setFilters}
        tags={tags}
      />

      {/* Items Grid */}
      <ContentGrid
        items={items}
        isLoading={isLoading}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}
