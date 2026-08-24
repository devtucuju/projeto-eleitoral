# Etapa 02 — Sprint 1: MVP do cabo

## O que aconteceu nesta etapa

Construção do produto mínimo viável focado no cabo eleitoral. 5 telas mobile + 6 APIs + 173 apoiadores reais do Amapá semeados no banco.

## Contexto

O TailAdmin Pro já estava instalado como template base (Next.js 16 + React 19 + Tailwind CSS 4). Mas o TailAdmin é um dashboard admin genérico - exatamente o ângulo saturado que o plano mandou evitar.

Decisão: criar uma rota paralela (`/celula`) com design system próprio, sem usar SidebarContext/ThemeContext do TailAdmin.

## Decisões técnicas

### Stack
- Node.js 22.11.0 (Prisma 6 não suporta Node 20.11)
- PostgreSQL 16 em Docker (não estava instalado nativamente)
- tsx para rodar seed TypeScript
- jose + bcryptjs para auth (Sprint 2)

### Design System "Célula"

Implementado em `src/app/globals.css` como variáveis CSS e classes próprias:
- `--celula-fundo: #F6F4F0`
- `--celula-acao: #1F6B4A`
- `--celula-streak: #C45C26`
- Classes: `.celula-app`, `.celula-btn-primario`, `.celula-input`, `.celula-tabbar`, `.celula-rank-row`

### Layout dedicado
`src/app/celula/layout.tsx` cria um `<div className="celula-app">` sem usar o TailAdmin. Script inline registra o service worker.

## Modelo de dados

7 entidades Prisma:
1. **Partido** - sigla, número, cor
2. **Candidato** - nome, número, cargo, partido
3. **Celula** - bairro, cidade, candidato
4. **Membro** - nome, telefone, apelido, tipo, status, pontos, streak, codigoConvite, paiId (Sprint 2)
5. **Missao** - título, local, data, metaConversas
6. **Conversa** - membroId, missaoId, nomeEleitor, telefoneEleitor, codigoConf, confirmada
7. **User** - email, password (coordenador, Sprint 2)

## Seed: 173 apoiadores reais

Dados extraídos de planilha Excel "Relação de apoiadores eleições 2026.xlsx" com 175 entradas. Filtrados para remover linhas vazias, resultaram em 173.

**Municípios cobertos**: Macapá (base), Santana, Oiapoque, Calçoene, Laranjal do Jari, Amapá, Ferreira Gomes, Itaubal, Pedra Branca, Porto Grande, Vitória do Jari, Cutiás, França.

**Bairros de Macapá mais populosos**:
- Zerão: 8 cabos (Alípio, Ana Paula, Cesária, Adão, Jô, Diretor Lima, Ramon)
- Brasil Novo: 8 cabos (Adriano, Alex, Cris, Ivanilson, Nildo, Tião, Sidiane, Jeovani)
- Renascer: 7 cabos (Cleia, Disraeli, Diana, Antônio Nunes, Cris filha, Alex irmão, Romildo)
- Infraero I/II: 6 cabos (Ruan, Cleyton, Eloeny, Jade, Josi, Thayná)
- Açaí: 6 cabos (Diego, Francisco, Gabriela, Maycon, Nádia, Neida)
- Bela Vista: 5 cabos (Larissa Amiga, Eduardo, Elielma, Rafaela, Renato)
- Jardim I: 4 cabos (Cabeça, Mariane, Marlucia, Pacheco)

**Referências profissionais** (onde os cabos trabalham):
- Rurap (maior parte)
- P. Meio Mundo
- Prefeitura Mcp
- SEMAM, SEMHOU, SDR
- Escola Katerine, Faculdade Estácio
- UNIFAP, Embrapa, Soja
- IBGE, Politec, Boticário

**Status na planilha**:
- Fechado: maioria (~126)
- Aberto (com ?): ~12
- Liderança "ok": ~45

## As 5 telas construídas

### 1. `/celula/auth` - Entrada
- Logo (pino de rua verde)
- Input telefone (formato BR)
- Botão Continuar (verde #1F6B4A, 56pt)
- Link Criar conta

### 2. `/celula/home` - Missão do dia
- Número grande "0/5 conversas" (34px semibold)
- Streak "🔥 4 dias" (laranja #C45C26)
- Card da missão ativa
- CTA único: "Nova conversa"

### 3. `/celula/registrar` - Pós-feira
- Voltar
- Campo Nome
- Campo WhatsApp (formato)
- Botão "Enviar confirmação no WhatsApp"
- Hint: "Só conta se a pessoa confirmar"
- Ação: gera código único + abre WhatsApp pré-preenchido

### 4. `/celula/time` - Ranking
- Título: nome da célula
- 5 linhas no máximo
- Colunas: nome · pontos · streak
- Destaque verde sutil para "VOCÊ"

### 5. `/celula/ajustes` - Settings
- Conta
- Time
- Notificações
- Sair
- Versão minúscula no rodapé

### Tela extra: `/confirmar/[codigo]` - Confirmação do eleitor
- "Olá!"
- "[Cabo] disse que conversou com você em [bairro]"
- "Você confirma essa conversa?"
- Botão grande: "Sim, conversei"
- Botão secundário: "Não conversei"
- Disclaimer: "Seu nome não será compartilhado"

## APIs construídas

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | /api/me | Validar telefone |
| GET | /api/me | Dados do membro logado |
| POST | /api/conversas | Registrar conversa (+5 pts) |
| GET | /api/conversas | Listar últimas 50 |
| POST | /api/confirmacao/[codigo] | Confirmar (+10 pts, atualiza streak) |
| GET | /api/confirmacao/[codigo] | Status da conversa |
| GET | /api/membros | Ranking |
| GET | /api/membros/[id] | Perfil + histórico |
| GET | /api/missoes | Missões ativas |
| GET | /api/celulas | Lista de células |

## Validação end-to-end

1. Cabo acessa /celula/auth
2. Digita telefone → POST /api/me → vai pra /celula/home
3. Vê 0/5 conversas, 11 dias streak (Alípio Junior do Zerão)
4. Clica "Nova conversa" → /celula/registrar
5. Preenche Maria Teste + (96) 99999-8888
6. Clica "Enviar confirmação no WhatsApp" → POST /api/conversas
7. Recebe código FCDCDFDEBCCD9CDA
8. WhatsApp abre com mensagem pré-preenchida
9. Eleitor clica link → /confirmar/[codigo]
10. Vê "Alípio disse que conversou com você em Zerão"
11. Clica "Sim, conversei" → POST /api/confirmacao → +10 pts
12. Recarrega → "Já confirmado. Valeu!"

## Arquivos criados nesta etapa

```
prisma/schema.prisma
prisma/seed.ts
src/lib/prisma.ts
src/app/celula/layout.tsx
src/app/celula/TabBar.tsx
src/app/celula/auth/page.tsx
src/app/celula/home/page.tsx
src/app/celula/registrar/page.tsx
src/app/celula/time/page.tsx
src/app/celula/ajustes/page.tsx
src/app/confirmar/[codigo]/page.tsx
src/app/confirmar/[codigo]/ConfirmActions.tsx
src/app/api/me/route.ts
src/app/api/conversas/route.ts
src/app/api/confirmacao/[codigo]/route.ts
src/app/api/membros/route.ts
src/app/api/membros/[id]/route.ts
src/app/api/missoes/route.ts
src/app/api/celulas/route.ts
src/app/globals.css (design system)
.env / .env.example
```

## Insights para narrativa

**Para slides**:
- "O MVP não é dashboard. É um gesto: conversa → confirmação → ranking."
- "173 apoiadores reais do Amapá já estão no banco. Não são personagens de demo."
- "O design system chama 'Célula'. É o tamanho do time. Não é tamanho do partido."

**Para storytelling**:
- Antes: cabo com 800 nomes numa planilha, urna deu 120
- Com o scampanha: 8 conversas confirmadas por dia, time sobe no ranking
- O cabo não virou digitador. Virou operador.

**Para NotebookLM podcast**:
Tópicos:
- Por que o design system evita partido/cores políticas?
- O que é o "Opal moment" no contexto político?
- Por que 5 telas bastam e 50 telas exageram?
- Como o streak muda comportamento de cabo?

## Métricas de saída

- 173 membros no banco
- 38 células (bairros + municípios)
- 1 missão ativa (Feira do Zerão)
- 4 endpoints de API públicos + 2 de admin
- 6 páginas mobile
- Bundle size estimado: ~50kb gzip
