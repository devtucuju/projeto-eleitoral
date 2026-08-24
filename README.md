# Projeto Eleitoral - Scampanha

Sistema de apoio ao cabo eleitoral para campanhas políticas no Amapá.

## Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Container**: Docker + Docker Compose

## Quick Start

### Development

```bash
# Instalar dependências
npm install

# Setup banco de dados
cp .env.example .env
docker compose up -d
npm run db:generate
npm run db:push
npm run db:seed

# Iniciar development
npm run dev
```

### Produção

Consulte [DEPLOY.md](DEPLOY.md) para instruções completas de deploy.

## Estrutura

```
src/
├── app/              # Next.js App Router
│   ├── api/          # API Routes
│   ├── (admin)/      # Páginas admin
│   └── celula/       # Páginas do cabo
├── components/       # Componentes React
├── context/         # React Context
├── hooks/           # Custom Hooks
└── lib/             # Utilitários

prisma/
├── schema.prisma    # Schema do banco
└── seed.ts          # Dados iniciais

.github/
└── workflows/       # CI/CD pipelines
```

## Scripts

```bash
npm run dev          # Development
npm run build        # Build produção
npm run lint         # ESLint
npm run db:generate  # Gerar Prisma Client
npm run db:push      # Push schema para banco
npm run db:seed      # Popular banco com dados iniciais
npm run db:studio    # Abrir Prisma Studio
```

## Documentação

- [DEPLOY.md](DEPLOY.md) - Guia de deploy
- [doc/](doc/) - Documentação das sprints e evolução do projeto

## Modelo de Dados

```
Partido → Candidato → Celula → Membro (cabo)
                              └→ Missao → Conversa
```
