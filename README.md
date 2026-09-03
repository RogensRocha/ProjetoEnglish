# LearnIt English 🎓

Uma plataforma moderna e intuitiva para acompanhar seus estudos de inglês, organizar links de vídeos, artigos e sites, e manter seu streak diário de hábitos.

---

## ✨ Funcionalidades

- **Dashboard Geral**: Indicadores de total de conteúdos, itens em estudo, concluídos e dias consecutivos de estudo (streak).
- **Streak de Hábitos Interativo**: Calendário visual de 28 dias para acompanhar e marcar o estudo do dia.
- **Biblioteca de Conteúdos**: 
  - Filtros dinâmicos por texto, status (*Para estudar*, *Estudando*, *Concluído*), nível CEFR (*A1 a C2*) e tags.
  - Cartões com pré-visualização, miniaturas, tags coloridas e alteração rápida de status.
- **Auto-preenchimento Inteligente**: Ao cadastrar uma URL (ex: YouTube, artigos da BBC ou Medium), o sistema extrai automaticamente o título e a imagem de capa via OpenGraph metadata.
- **Gerenciamento de Tags**: Crie e organize suas próprias etiquetas (Grammar, Listening, Vocabulary, etc.).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend / Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack) & [React](https://react.dev/)
- **Estilização**: [TailwindCSS](https://tailwindcss.com/) com design system personalizado (Dark Mode & Glassmorphism)
- **Banco de Dados & ORM**: [Prisma ORM](https://www.prisma.io/) com SQLite (pronto para desenvolvimento local) ou PostgreSQL
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Extração de Metadados**: [Cheerio](https://cheerio.js.org/)

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/RogensRocha/ProjetoEnglish.git
cd ProjetoEnglish
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Copie o `.env.example` para `.env`:
```bash
cp .env.example .env
```

### 4. Sincronizar o banco de dados
```bash
npm run db:push
```

*(Opcional: Para gerar dados iniciais de demonstração, use `npm run db:seed`)*

### 5. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para acessar a aplicação.

---

## 🔒 Segurança

Arquivos de banco de dados locais (`dev.db`), logs e arquivos de ambiente (`.env`, `.env.local`) são estritamente ignorados pelo `.gitignore` e nunca são versionados no repositório.
