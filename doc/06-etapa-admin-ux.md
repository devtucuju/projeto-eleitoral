# Etapa 06 — Admin UX + Responsividade

## O que mudou

Você apontou 2 problemas reais:

1. **Layout quebrava em mobile**: sidebar de 240px + conteúdo causava overflow
2. **Listão sem ferramentas**: 175 membros sem busca/filtro/paginação

Resolvido nesta etapa.

## Decisões de UX

### Responsividade

**Mobile (< 768px)**:
- Sidebar vira drawer (botão hamburger ≡)
- Topbar fixa com logo + badge de pendentes
- KPIs em grid 2 colunas (era 4)
- Quick links na home mobile

**Tablet (768-1024px)**:
- Sidebar fixa mas estreita
- KPIs em 4 colunas

**Desktop (> 1024px)**:
- Sidebar 240px fixa
- KPIs em 7 colunas
- Tabela larga com mais info

### Lista de membros rica

**Antes**: 1 listão de 175 itens, sem nada.

**Agora**:
- 🔍 **Busca** por nome/apelido/bairro/telefone (input com lupa)
- �️ **Filtros**: status (pendente/fechado/inativo), célula (dropdown com 39 opções)
- 📊 **Ordenação clicável** nos headers: nome, pontos, streak
- 📑 **Paginação** de 15 por página (12 páginas)
- ☑️ **Bulk actions**: checkbox por linha + "Aprovar selecionados"
- 👤 **Avatar com iniciais** colorido por hash do nome
- 🏷️ **Badges**: Pendente (warning), Fechado (success), Inativo (light), Líder (primary)
- ⚡ **Pulse animation** no card "Pendentes" quando > 0

### KPIs do dashboard

**Antes**: 7 cards quadrados brancos sem contexto.

**Agora**:
- Ícones emoji para cada KPI
- Cores semânticas (success/warning/brand/info)
- Ring laranja pulsando quando há pendentes
- Card de alerta grande "X cabos aguardando aprovação"
- Top 5 células com **barra de progresso** mostrando posição relativa
- "Atividade recente" com últimas 5 conversas
- Quick links mobile (sm:hidden)

## Componentes TailAdmin aproveitados

| Componente | Onde |
|------------|------|
| `Badge` | Status dos membros, tipo de missão |
| `Card` | KPIs, top células, atividade |
| `Table/TableHeader/TableBody/TableRow/TableCell` | Lista de membros |
| `Button` | Ações inline |
| (custom) | Avatar com iniciais |
| (custom) | Search input com lupa |
| (custom) | Bulk action bar |

## Componentes criados

```
src/app/(admin)/AdminSidebar.tsx  - Sidebar responsivo (drawer mobile + fixed desktop)
src/app/(admin)/admin/membros/MembrosClient.tsx - Lista rica com filtros
src/app/(admin)/admin/dashboard/page.tsx - Dashboard reformulado
src/app/(admin)/layout.tsx - Layout responsivo
```

## Antes vs Depois

### Lista de membros

```
ANTES                                          DEPOIS
[175 membros num listão]                       [🔍 busca] [status ▾] [célula ▾]
                                               
Nome · Celula · Pontos                         ┌─────────────────────────────────┐
Alípio · Zerão · 511 pts �                     │ ☐ 👤 Alípio Junior  ⏳ Pendente │
Cleia · Renascer · 423 pts ✓                   │    📞 96... · 511 pts · 🔥 5  │
... 173 linhas ...                             ├─────────────────────────────────┤
                                               │ ☐ 👤 Cleia          ✓ Fechado  │
                                               │    📞 96... · 423 pts · 🔥 12 │
                                               └─────────────────────────────────┘
                                               Mostrando 1-15 de 175  [← 1 2 ... →]
```

### Dashboard

```
ANTES                                          DEPOIS
[M] [P] [L] [I] [C] [C] [T]                    ⏳ 3 cabos aguardando aprovação →
                                               
Top células:                                   [M] [P] [L] [I] [C] [C] [T] (coloridos)
1º Zerão 580                                   
2º Jô 580                                      Top 5 células com barras:
3º ...                                          1º Zerão    ████████████ 580
                                                2º Jô       ████████████ 580
                                                ...
                                               Atividade recente:
                                               • Maria Teste · Alípio · 18 ago
                                               • João Silva · Cleia · 17 ago
```

## Validação

```
✅ /admin/membros: 200 (com busca, filtros, paginação)
✅ /admin/dashboard: 200 (KPIs coloridos, top células, atividade)
✅ Sidebar responsivo: drawer em mobile, fixo em desktop
✅ Bulk actions funcionam
✅ Filtros em tempo real (sem reload)
✅ Paginação 15 por página
```

## Próxima etapa (07)

A Etapa 07 será **Design Motion**:
- Microinterações (botão Aprovar → ✓ animado)
- Skeleton loaders
- Toasts (sonner)
- Counter animado (pontos subindo)
- Haptic feedback
- Page transitions

## Insights para narrativa

**Para slides**:
- "Antes era 175 nomes num listão. Agora tem busca, filtro, paginação."
- "A sidebar virou drawer no celular. Coordenador aprova no ônibus."
- "KPIs pulsam quando tem pendente. Não deixa ninguém esquecer."

**Para storytelling**:
- Cena: Coordenadora abre o app no celular. Vê "3 pendentes" pulsando. Clica. Aprova 3 em 30 segundos.
- Cena: Busca "Alípio". Vê histórico dele. Promove a líder.

**Para NotebookLM**:
- Como aplicar TailAdmin sem virar dashboard cinza?
- Por que sidebar responsivo importa?
- Quando usar Tabela vs Lista?

## Métricas de saída

- 2 arquivos reescritos (membros, dashboard)
- 1 componente novo (AdminSidebar responsivo)
- 0 quebras (todos os 8 endpoints admin continuam funcionando)
- TailAdmin usado: Table, Badge, Card, Button
- Custom: Avatar, Search input, Bulk action bar
