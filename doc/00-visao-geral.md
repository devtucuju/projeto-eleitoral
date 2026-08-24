# Documentação do scampanha — Visão Geral

## O que é o scampanha

**scampanha** é um sistema de campanha política construído com Next.js 16 + Prisma + PostgreSQL. O nome "Célula" é o produto final entregue aos cabos eleitorais.

Não é um CRM. É o **Finch da rua**: um companheiro para o cabo eleitoral que transforma conversa em voto confirmado via WhatsApp, com progresso do time do bairro.

## Contexto de mercado

O mercado brasileiro de sistemas políticos está saturado no ângulo errado: dashboards para coordenadores (ELEGE, Mandato.app, EleitorWEB). A brecha real é o produto na mão do cabo na rua.

## Frame de referência

- **Duolingo**: streak diário, não quebre a sequência
- **Strava**: progresso visível, ranking, pertencimento
- **Alarmy**: gesto impossível de falsificar (a confirmação WhatsApp)
- **Reach (AOC/Biden)**: cruzar agenda do voluntário com arquivo eleitoral
- **Headway**: 90 segundos de conteúdo, não treinamento

## Decisões de produto

### Hold 2 (o que se repete em apps virais de nicho)
1. **Confirmação difícil de burlar** — voto só conta se eleitor confirmar no WhatsApp (o Opal/Alarmy)
2. **Progresso visual da célula** — streak do cabo + ranking do bairro + árvore

### Remix 5 (o que diferencia)
1. **Público**: cabo e liderança de proporcional, não coordenador
2. **Visual**: time de bairro, não SaaS
3. **Experiência**: WhatsApp-first, momento crítico
4. **Linguagem**: "missão", "sequência", "voto confirmado", "time da Vila"
5. **Métrica**: conversas confirmadas, não cadastros

## Estrutura de etapas

| # | Etapa | O que é |
|---|-------|---------|
| 01 | Plano aprovado | Contexto, modelo mental, design system |
| 02 | Sprint 1 — MVP cabo | 5 telas mobile + APIs + seed |
| 03 | Sprint 2 — Autocadastro | Cabo novo entra sozinho + convite entre cabos |
| 04 | Sprint 3 — Painel admin | Coordenador opera a campanha |
| 05 | Sprint 4 — LGPD + árvore | Retenção, direito ao esquecimento, PWA |

## Stack final

- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- PostgreSQL 16 (Docker)
- Prisma 6 (ORM)
- jose + bcryptjs (auth)
- Service Worker (PWA)

## Login admin

- Email: `coord@campanha.com`
- Senha: `campanha2026`

## Estrutura de pastas

```
scampanha/
├── prisma/           # Schema, seed
├── public/           # PWA assets (manifest, sw, icon)
├── src/
│   ├── app/
│   │   ├── (admin)/admin/  # Painel coordenador
│   │   ├── celula/         # App do cabo (PWA)
│   │   ├── confirmar/      # Link do eleitor
│   │   └── api/            # Backend routes
│   └── lib/                # prisma, admin-auth
└── doc/                    # Esta documentação
```

## Como rodar

```bash
# Subir banco
docker compose up -d

# Instalar deps
npm install

# Aplicar schema
npx prisma db push

# Popular banco
npm run db:seed

# Rodar
npm run dev
```
