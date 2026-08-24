# Etapa 03 — Sprint 2: Autocadastro + Convite + Auth

## O que aconteceu nesta etapa

Resolvemos a pergunta "como cabos novos entram no app" e "como cabos existentes convidam outros". Implementamos autocadastro com aprovação, árvore de indicações via código de convite, e login do coordenador.

## Contexto

No Sprint 1, o cabo Alípio (do seed) entrava direto no app. Mas e o cabo João que acabou de baixar o app e não está na lista? E como o Alípio convida o primo dele?

Respostas:
1. Cabo novo entra com telefone que não existe → vai pra /celula/cadastro
2. Coordenador aprova no painel (status: pendente → fechado)
3. Cabo existente gera link de convite → novo cabo entra → cabo antigo ganha +20 pts

## Mudanças no schema Prisma

Adicionados ao `Membro`:
- `paiId String?` - quem convidou (relação Indicacao)
- `codigoConvite String? @unique` - código de 8 caracteres para link
- `aceitouTermos Boolean` - LGPD

Novo status com 3 valores:
- `pendente` (cabo novo aguardando aprovação)
- `fechado` (liberado pra usar)
- `inativo` (desligado pelo coordenador)

## Telas construídas

### `/celula/cadastro` - Form de cadastro
- Telefone (pré-preenchido, desabilitado)
- Nome completo
- Apelido (opcional)
- Dropdown Município (12 opções)
- Dropdown Célula (filtrado pelo município)
- Checkbox LGPD obrigatória
- Botão Cadastrar
- Banner "Convidado por [nome]" se houver código

### `/celula/cadastro/sucesso` - Aguardando aprovação
- Emoji ✅
- "Cadastro enviado!"
- "O coordenador da sua célula vai liberar seu acesso"
- Botão "Voltar pro início"

### `/celula/auth` - Atualizada
- Detecta cabo novo → redireciona para /celula/cadastro com telefone
- Detecta ?convite=CODIGO → passa código adiante

### `/celula/home` - Atualizada
- Se membro.status === "pendente":
  - Banner laranja "⏳ Aguardando aprovação do coordenador"
  - Botão "Nova conversa" desabilitado
  - Mensagem "Você será avisado quando liberado"

### `/celula/ajustes` - Botão Convidar
- Botão verde "+ Convidar cabo"
- Modal bottom-sheet com:
  - Mensagem "Cada cabo que entrar pelo seu link te dá +20 pontos"
  - Link visível (monospace)
  - Botão "Compartilhar no WhatsApp" (abre wa.me com texto pré-preenchido)
  - Botão "Copiar link"
  - Botão "Fechar"

## APIs construídas

| Método | Endpoint | Função |
|--------|----------|--------|
| POST | /api/cadastro | Criar cabo novo (status=pendente) + bonificar pai |
| GET | /api/convite/[codigo] | Dados de quem convidou |
| GET | /api/celulas?cidade=X | Células filtradas por município |
| POST | /api/admin/login | Login email/senha (JWT) |
| POST | /api/admin/logout | Limpar cookie |
| GET | /api/admin/membros | Listar (filtros: status, celulaId) |
| PATCH | /api/admin/membros/[id] | Aprovar/Rebaixar/Promover |
| GET | /api/admin/missoes | Listar |
| POST | /api/admin/missoes | Criar |

## Auth de coordenador

Implementado em `src/lib/admin-auth.ts`:
- JWT assinado com HS256 (jose)
- Secret em NEXTAUTH_SECRET (.env)
- Cookie httpOnly "scampanha_admin" com 7 dias
- Helper `requireAdmin()` retorna 401 ou o payload

Middleware de proteção: cada página admin chama `getAdminFromCookie()` e redireciona pra `/admin/login` se não houver cookie.

## Fluxo end-to-end validado

```
1. Cabo novo entra com telefone "96999997777"
   → /api/me retorna 202
   → tela /celula/cadastro
   → POST /api/cadastro cria membro "pendente"
   → tela "Cadastro enviado, aguardando aprovação"

2. Coordenador loga em /admin/login
   → /admin/dashboard mostra KPIs
   → /admin/membros lista o novo cabo como "pendente"
   → clica "Aprovar" → PATCH /api/admin/membros/[id]
   → status vira "fechado"

3. Cabo entra em /celula/home
   → se "pendente": banner laranja + botão desabilitado
   → se "fechado": fluxo normal do Sprint 1

4. Cabo Alípio convida primo via WhatsApp
   → link: celula.app/celula/auth?convite=00000002
   → primo entra pelo link
   → /celula/cadastro detecta convite
   → POST /api/cadastro com paiId=Alípio
   → Alípio ganha +20 pts (303 → 323 pts)
```

## Seed atualizado

- Adicionado campo `codigoConvite: telefone.slice(-8)` (8 últimos dígitos)
- Adicionado `aceitouTermos: true` (já aceitaram na planilha)
- Criado usuário coordenador: `coord@campanha.com / campanha2026` (bcrypt hash)

## Mudanças técnicas importantes

### Bug encontrado: Prisma Client desatualizado
Adicionar `codigoConvite` ao schema deu erro de migration porque linhas existentes não tinham valor. Solução: tornar campo opcional, popular via Node script, depois `prisma generate` regenerou o client.

### Suspense boundary em auth
Next.js 16 exige `<Suspense>` ao redor de componentes que usam `useSearchParams`. Adicionado em `/celula/auth` e `/celula/cadastro`.

## Arquivos criados nesta etapa

```
src/lib/admin-auth.ts
src/app/api/cadastro/route.ts
src/app/api/convite/[codigo]/route.ts
src/app/api/celulas/route.ts (atualizado)
src/app/api/me/route.ts (atualizado)
src/app/api/admin/login/route.ts
src/app/api/admin/logout/route.ts
src/app/api/admin/membros/route.ts
src/app/api/admin/membros/[id]/route.ts
src/app/api/admin/missoes/route.ts
src/app/celula/cadastro/page.tsx
src/app/celula/cadastro/sucesso/page.tsx
src/app/celula/auth/page.tsx (atualizado)
src/app/celula/home/page.tsx (atualizado)
src/app/celula/ajustes/page.tsx (atualizado)
src/app/celula/ajustes/ConvidarButton.tsx
prisma/seed.ts (atualizado)
```

## Insights para narrativa

**Para slides**:
- "O cabo não espera pelo coordenador. Ele se cadastra e espera aprovação."
- "Cada convite é +20 pontos. A árvore cresce organicamente."
- "O coordenador não precisa mais visitar bairro. Faz pelo celular."

**Para storytelling**:
- Cena: Alípio na feira. Encontra primo. "Entra no time."
- Cena: Coordenador no celular. Aprova 3 pendentes em 30 segundos.
- Cena: Ranking do bairro muda. Alípio sobe 3 posições.

**Para NotebookLM podcast**:
- O que significa "viralizar" num app de campanha?
- Como LGPD funciona em 3 cliques?
- Por que convite vale pontos?

## Métricas de saída

- 175 membros no banco (173 seed + 2 testes)
- 1 usuário admin funcional
- 5 telas mobile + 9 APIs
- ~600 linhas de código adicionadas
- 0 deploys (tudo validado localmente)
