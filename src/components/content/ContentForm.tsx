"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Link2, Sparkles, Plus, Check } from "lucide-react";
import type { ContentType, ContentStatus, EnglishLevel, Tag } from "@/types";

interface ContentFormProps {
  initialData?: {
    id?: string;
    url: string;
    title: string;
    type: ContentType;
    thumbnailUrl?: string | null;
    notes?: string | null;
    status: ContentStatus;
    level: EnglishLevel;
    tagIds?: string[];
  };
  isEditing?: boolean;
}

export default function ContentForm({ initialData, isEditing = false }: ContentFormProps) {
  const router = useRouter();

  const [url, setUrl] = useState(initialData?.url || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState<ContentType>(initialData?.type || "article");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || "todo");
  const [level, setLevel] = useState<EnglishLevel>(initialData?.level || "B1");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tagIds || []);

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [isFetchingOg, setIsFetchingOg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load available tags
  useEffect(() => {
    async function loadTags() {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const json = await res.json();
          setAvailableTags(json.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar tags:", err);
      }
    }
    loadTags();
  }, []);

  // Fetch OpenGraph automatically from URL
  const handleAutoFill = async () => {
    if (!url) {
      setError("Insira uma URL primeiro");
      return;
    }

    setIsFetchingOg(true);
    setError("");

    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const json = await res.json();
        const og = json.data;

        if (og.title && !title) setTitle(og.title);
        if (og.image && !thumbnailUrl) setThumbnailUrl(og.image);

        // Infer type from URL
        if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo")) {
          setType("video");
        } else if (url.includes("medium.com") || url.includes("article") || url.includes("bbc.com/news")) {
          setType("article");
        }
      }
    } catch (err) {
      console.error("Falha ao buscar metadados:", err);
    } finally {
      setIsFetchingOg(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim(), color: randomColor }),
      });

      if (res.ok) {
        const json = await res.json();
        const createdTag = json.data;
        setAvailableTags((prev) => [...prev, createdTag]);
        setSelectedTagIds((prev) => [...prev, createdTag.id]);
        setNewTagName("");
      }
    } catch (err) {
      console.error("Erro ao criar tag:", err);
    }
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) {
      setError("URL e Título são campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload = {
      url,
      title,
      type,
      thumbnailUrl: thumbnailUrl || null,
      notes: notes || null,
      status,
      level,
      tagIds: selectedTagIds,
    };

    try {
      const targetUrl = isEditing && initialData?.id ? `/api/content/${initialData.id}` : "/api/content";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(targetUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/content");
        router.refresh();
      } else {
        const json = await res.json();
        setError(json.error || "Erro ao salvar conteúdo");
      }
    } catch (err) {
      setError("Erro de rede ao salvar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-8 glass">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* URL + Auto Fill */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            URL do Conteúdo <span className="text-brand-400">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou artigo"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleAutoFill}
              isLoading={isFetchingOg}
              title="Obter título e capa automaticamente do link"
            >
              <Sparkles size={16} className="text-brand-400" />
              Auto-preencher
            </Button>
          </div>
        </div>

        {/* Title */}
        <Input
          label="Título *"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Como usar Phrasal Verbs no dia a dia"
        />

        {/* Type, Level, Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Tipo"
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            options={[
              { value: "video", label: "🎬 Vídeo" },
              { value: "article", label: "📄 Artigo" },
              { value: "site", label: "🌐 Site/Guia" },
            ]}
          />

          <Select
            label="Nível CEFR"
            value={level}
            onChange={(e) => setLevel(e.target.value as EnglishLevel)}
            options={[
              { value: "A1", label: "A1 (Iniciante)" },
              { value: "A2", label: "A2 (Básico)" },
              { value: "B1", label: "B1 (Intermediário)" },
              { value: "B2", label: "B2 (Intermediário+)" },
              { value: "C1", label: "C1 (Avançado)" },
              { value: "C2", label: "C2 (Fluente)" },
            ]}
          />

          <Select
            label="Status Inicial"
            value={status}
            onChange={(e) => setStatus(e.target.value as ContentStatus)}
            options={[
              { value: "todo", label: "📌 Para estudar" },
              { value: "in_progress", label: "⏳ Estudando" },
              { value: "done", label: "✅ Concluído" },
            ]}
          />
        </div>

        {/* Thumbnail URL */}
        <Input
          label="URL da Imagem de Capa (Opcional)"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://...imagem.jpg"
        />

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-300">
            Anotações / Dicas de Estudo
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Praticar técnica de shadowing aos 3 minutos de vídeo..."
            className="w-full rounded-xl bg-white/[0.05] border border-white/[0.1] px-4 py-2.5 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
          />
        </div>

        {/* Tags Selection & Creation */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-brand-500 border-brand-400 text-white shadow-glow-brand"
                      : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {isSelected && <Check size={12} />}
                  #{tag.name}
                </button>
              );
            })}
          </div>

          {/* Quick new tag input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Criar nova tag..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateTag();
                }
              }}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/[0.04] border border-white/[0.08] text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-brand-500/50 w-48"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCreateTag}
            >
              <Plus size={14} /> Adicionar Tag
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
            {isEditing ? "Salvar Alterações" : "Adicionar à Biblioteca"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
