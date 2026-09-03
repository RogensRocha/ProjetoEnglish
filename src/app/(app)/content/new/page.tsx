import Header from "@/components/layout/Header";
import ContentForm from "@/components/content/ContentForm";

export default function NewContentPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        title="Adicionar Conteúdo"
        subtitle="Cole um link de vídeo, artigo ou site para enriquecer seu acervo de estudos"
      />
      <ContentForm />
    </div>
  );
}
