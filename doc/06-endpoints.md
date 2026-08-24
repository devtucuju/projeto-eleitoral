# Mapa de Endpoints — Quem acessa o quê

## TL;DR

**Cabo entra por**: `http://localhost:3000/` (redireciona para `/celula/auth`)
**Coordenador entra por**: `http://localhost:3000/admin/login`

Login coordenador: `coord@campanha.com / campanha2026`

## Por que `localhost:3000` caía no TailAdmin antes

A home `/` era servida por `src/app/(admin)/page.tsx` (route group `(admin)`), que herdava o dashboard genérico de e-commerce do TailAdmin. Foi substituída por um redirect para `/celula/auth`.

Agora a porta de entrada do produto é a tela de auth do cabo.

## Mapa completo de URLs

### � Cabo (identifica por telefone)

| URL | Tela | Função |
|-----|------|--------|
| `/` | redirect → `/celula/auth` | Entrada principal |
| `/celula/auth` | Auth | Digita telefone |
| `/celula/cadastro` | Cadastro | Cabo novo se registra (LGPD) |
| `/celula/home` | Home | Missão do dia + streak |
| `/celula/registrar` | Registrar | Pós-conversa: nome + WhatsApp |
| `/celula/time` | Time | Tabs: Ranking | Árvore |
| `/celula/ajustes` | Ajustes | Convidar cabo + Esqueci dados |

### 👔 Coordenador (login email/senha)

| URL | Tela | Função |
|-----|------|--------|
| `/admin/login` | Login | coord@campanha.com |
| `/admin/dashboard` | Dashboard | KPIs + top células + nav |
| `/admin/membros` | Membros | Aprovar/Promover/Rebaixar |
| `/admin/missoes` | Missões | CRUD missões |
| `/admin/partidos` | Partidos | CRUD partidos |
| `/admin/candidatos` | Candidatos | CRUD candidatos |
| `/admin/celulas` | Células | CRUD células |
| `/admin/exportar` | Exportar | Download CSVs |

### �️ Eleitor (acesso via link, sem conta)

| URL | Tela | Função |
|-----|------|--------|
| `/confirmar/[codigo]` | Confirmar | "Sim, conversei" ou "Não conversei" |

## 🔌 APIs JSON

### Cabo (sem cookie)

| Método | Path | Body | Resposta |
|--------|------|------|----------|
| POST | `/api/me` | `{ telefone }` | 200: ok / 202: novo (cadastro) / 400: inválido |
| POST | `/api/cadastro` | `{ telefone, nome, apelido?, municipio, celulaId, aceitouTermos, paiId? }` | 200: criado (pendente) / 409: telefone existe |
| GET | `/api/convite/[codigo]` | — | 200: { nome, celula, cidade } / 404: inválido |
| GET | `/api/celulas?cidade=X` | — | 200: lista de células |
| GET | `/api/arvore?celulaId=X` | — | 200: { raizes, total, raizesCount } |
| POST | `/api/conversas` | `{ nomeEleitor?, telefoneEleitor }` | 200: { codigoConf, conversaId } |
| POST | `/api/esqueci` | `{ telefone }` | 200: anonimizado |

### Confirmação (público)

| Método | Path | Body | Resposta |
|--------|------|------|----------|
| GET | `/api/confirmacao/[codigo]` | — | 200: status |
| POST | `/api/confirmacao/[codigo]` | `{ resposta: "sim" \| "nao" }` | 200: confirmado / 404: código inválido |

### Coordenador (cookie `scampanha_admin` obrigatório)

| Método | Path | Função |
|--------|------|--------|
| POST | `/api/admin/login` | Login email/senha (seta cookie JWT) |
| POST | `/api/admin/logout` | Limpa cookie |
| GET | `/api/admin/membros?status=X&celulaId=X` | Lista filtros |
| PATCH | `/api/admin/membros/[id]` | Aprovar/Promover/Rebaixar/Inativar |
| GET/POST | `/api/admin/partidos` | Listar/Criar |
| PATCH/DELETE | `/api/admin/partidos/[id]` | Editar/Excluir |
| GET/POST | `/api/admin/candidatos` | Listar/Criar |
| PATCH/DELETE | `/api/admin/candidatos/[id]` | Editar/Excluir |
| GET/POST | `/api/admin/celulas` | Listar/Criar |
| PATCH/DELETE | `/api/admin/celulas/[id]` | Editar/Excluir |
| GET | `/api/admin/missoes` | Listar |
| POST | `/api/admin/missoes` | Criar |
| GET | `/api/admin/exportar?tipo=conversas\|membros\|celulas` | Download CSV |

### Cron (header `Authorization: Bearer ${CRON_SECRET}`)

| Método | Path | Quando chamar |
|--------|------|---------------|
| GET | `/api/cron/cleanup` | Diário 3h |
| GET | `/api/cron/streak` | Diário 0h |

## Cenários de teste

### Cabo existente
```
1. Abre http://localhost:3000/
2. Redireciona pra /celula/auth
3. Digita (96) 90000-0001 (Alípio Junior)
4. Clica Continuar → /celula/home
5. Vê missão + streak
6. Nova conversa → /celula/registrar
7. Confirma no WhatsApp → /confirmar/[codigo]
8. Volta pro app → pontos subiram
```

### Cabo novo
```
1. Abre /celula/auth
2. Digita telefone que não existe (ex: 96999998888)
3. Vai pra /celula/cadastro
4. Preenche dados + aceita termos
5. Vai pra /celula/cadastro/sucesso
6. Coordenador aprova em /admin/membros
7. Volta no app, entra normal
```

### Coordenador
```
1. Abre /admin/login
2. Login coord@campanha.com / campanha2026
3. Dashboard mostra KPIs
4. /admin/membros vê 175 cabos
5. Aprova pendentes / promove líderes
6. /admin/missoes cria missão
7. /admin/exportar baixa CSVs
```

### Eleitor (link do WhatsApp)
```
1. Recebe mensagem com link
2. Abre http://localhost:3000/confirmar/XXXXX
3. Vê "Alípio disse que conversou com você em Zerão"
4. Clica "Sim, conversei"
5. Volta pro navegador ou fecha
```

## Cookies e sessões

| Cookie | Onde | Quem | Duração |
|--------|------|------|---------|
| `scampanha_admin` | Admin | Coordenador | 7 dias (JWT) |
| (nenhum) | Cabo | — | Identificação por telefone (sem sessão) |

**Decisão**: Cabo não tem sessão persistente. Cada acesso precisa digitar telefone. Em produção, adicionar OTP ou cookie leve.

## Fluxograma de navegação

```
[localhost:3000]
       ↓ (redirect)
[localhost:3000/celula/auth]
       ↓
   ┌───┴────────────┐
   ↓                ↓
[tel existe]   [tel novo]
   ↓                ↓
[celula/home]  [celula/cadastro]
   ↓                ↓
[registrar]    [cadastro/sucesso]
   ↓                
[confirmar/X]  [aguarda coordenador
   ↓            aprovar em /admin/membros]
[atualiza stats]


[cabo/admin → localhost:3000/admin/login]
   ↓
[admin/dashboard]
   ↓
[membros | missoes | partidos | candidatos | celulas | exportar]
```
