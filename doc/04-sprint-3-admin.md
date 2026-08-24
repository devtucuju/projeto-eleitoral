# Etapa 04 — Sprint 3: Painel Admin

## O que aconteceu nesta etapa

Construção completa do painel administrativo que faltava: CRUDs de partidos, candidatos, células e exportação CSV. O coordenador agora opera toda a estrutura da campanha pelo navegador.

## Contexto

No Sprint 2 criamos o login admin e aprovar membros. Mas o coordenador ainda precisava de:
- Cadastrar partidos (pré-campanha)
- Cadastrar candidatos (registro no TSE)
- Criar células (após definir regiões geográficas)
- Exportar dados (para análise ou BU)

Tudo isso foi implementado com UIs consistentes usando o mesmo padrão visual.

## Estrutura do painel admin

### Rotas criadas (rotas autenticadas)

| Rota | Função |
|------|--------|
| /admin/login | Login (já existia) |
| /admin/dashboard | KPIs + top células (já existia) |
| /admin/membros | Lista, aprovar, promover (já existia) |
| /admin/missoes | CRUD missões (já existia) |
| /admin/partidos | **NOVO** CRUD partidos |
| /admin/candidatos | **NOVO** CRUD candidatos |
| /admin/celulas | **NOVO** CRUD células agrupadas por município |
| /admin/exportar | **NOVO** 3 botões de download CSV |

### APIs criadas

| Método | Endpoint | Função |
|--------|----------|--------|
| GET | /api/admin/partidos | Listar com contador de candidatos |
| POST | /api/admin/partidos | Criar |
| PATCH | /api/admin/partidos/[id] | Editar/ativar/desativar |
| DELETE | /api/admin/partidos/[id] | Excluir (bloqueia se tem candidatos) |
| GET | /api/admin/candidatos | Listar com partido + contadores |
| POST | /api/admin/candidatos | Criar |
| PATCH | /api/admin/candidatos/[id] | Editar |
| DELETE | /api/admin/candidatos/[id] | Excluir |
| GET | /api/admin/celulas | Listar agrupado por candidato |
| POST | /api/admin/celulas | Criar |
| PATCH | /api/admin/celulas/[id] | Editar |
| DELETE | /api/admin/celulas/[id] | Excluir |
| GET | /api/admin/exportar?tipo=X | CSV (conversas/membros/celulas) |

## Padrão de UI dos CRUDs

Todos os 3 CRUDs (PartidosManager, CandidatosManager, CelulasManager) seguem o mesmo padrão:

1. **Cabeçalho** com título + contador + link "← Dashboard"
2. **Botão "+ Novo XXX"** verde primário
3. **Lista** com fundo branco, bordas divisor, hover sutil
4. **Ações inline**: Ativar/Desativar, Editar, Excluir
5. **Modal centralizado** para criar/editar com formulário

### Detalhes por entidade

#### Partidos
- Campos: Nome, Sigla (uppercase), Número, Cor (color picker)
- Exibe: sigla + nome + número + qtd candidatos
- Cor exibida como quadradinho colorido

#### Candidatos
- Campos: Nome, Apelido, Cargo (dropdown), Número, Partido (dropdown)
- Cargos: Dep. Estadual, Dep. Federal, Vereador, Prefeito, etc.
- Exibe: nome + apelido + cargo + partido + qtd células + qtd missões

#### Células
- Campos: Nome (bairro), Cidade, Candidato (dropdown)
- Agrupadas por cidade no display (Macapá aparece primeiro)
- Exibe: nome + candidato + qtd membros + qtd missões

## Exportação CSV

Endpoint único `/api/admin/exportar?tipo=X`:
- `tipo=conversas` → lista todas com data, cabo, eleitor, status
- `tipo=membros` → lista completa com pontos, streak, status
- `tipo=celulas` → resumo por célula com totais

**Características**:
- Separador: ponto-e-vírgula (;)
- BOM UTF-8 no início (Excel abre corretamente)
- Content-Disposition: attachment com nome do arquivo
- Filename: `tipo-YYYY-MM-DD.csv`

### Validação dos CSVs

```
membros-2026-08-18.csv: 175 linhas
  ├─ Header: Nome;Apelido;Telefone;Celula;...
  ├─ Carlos Kaczan;;96900000035;AP-070;Macapá;...

conversas-2026-08-18.csv: 1 linha (1 conversa de teste)
celulas-2026-08-18.csv: 39 linhas (uma por célula)
```

## Validação end-to-end

```
✅ Login admin: coord@campanha.com / campanha2026
✅ /admin/dashboard: 200 (KPIs + 7 links de navegação)
✅ /admin/membros: 200 (175 membros)
✅ /admin/missoes: 200 (1 missão)
✅ /admin/partidos: 200 (criar PT #12345 funcionou)
✅ /admin/candidatos: 200
✅ /admin/celulas: 200 (39 células agrupadas por município)
✅ /admin/exportar: 200 (3 tipos de CSV)

✅ POST /api/admin/partidos: criou Partido Teste
✅ GET /api/admin/partidos: lista 2 partidos
✅ CSV membros: 175 linhas, separador ;, BOM UTF-8
✅ CSV conversas: header pronto
✅ CSV células: 39 linhas com totais de pontos
```

## Matriz de permissões final

| Quem faz | O quê |
|----------|-------|
| Coordenador | Cadastra partido |
| Coordenador | Cadastra candidato (vinculado a partido) |
| Coordenador | Cadastra célula (vinculada a candidato) |
| Coordenador | Cria missão (vinculada a célula) |
| Coordenador | Aprova cabo novo |
| Coordenador | Promove cabo → líder |
| Coordenador | Inativa cabo |
| Coordenador | Exporta CSV |
| Cabo | Se cadastra, convida, registra conversa |
| Eleitor | Confirma conversa (sem conta) |

## Bug encontrado e resolvido

PATH do shell quebrou durante os testes (curl não encontrado). Solução: usar `/usr/bin/curl` explicitamente. Não é bug do código, foi ambiente.

## Arquivos criados nesta etapa

```
src/app/api/admin/partidos/route.ts
src/app/api/admin/partidos/[id]/route.ts
src/app/api/admin/candidatos/route.ts
src/app/api/admin/candidatos/[id]/route.ts
src/app/api/admin/celulas/route.ts
src/app/api/admin/celulas/[id]/route.ts
src/app/api/admin/exportar/route.ts
src/app/(admin)/admin/partidos/page.tsx
src/app/(admin)/admin/partidos/PartidosManager.tsx
src/app/(admin)/admin/candidatos/page.tsx
src/app/(admin)/admin/candidatos/CandidatosManager.tsx
src/app/(admin)/admin/celulas/page.tsx
src/app/(admin)/admin/celulas/CelulasManager.tsx
src/app/(admin)/admin/exportar/page.tsx
src/app/(admin)/admin/dashboard/page.tsx (atualizado)
```

## Insights para narrativa

**Para slides**:
- "Coordenador opera a campanha inteira pelo navegador"
- "8 telas. 175 cabos. 39 células. 1 missão. Tudo num painel."
- "Exportação em CSV para cruzar com BU (Boletim de Urna)"

**Para storytelling**:
- Cena: Coordenador de campanha no escritório. 3 cliques cadastra 5 células novas.
- Cena: Fim de semana. Exporta CSV. Comparar com BU na segunda.

**Para NotebookLM podcast**:
- Por que um partido tem cor mas a UI não usa?
- O que diferencia um CRUD bom de um SaaS genérico?
- CSV com BOM: por que importa?

## Métricas de saída

- 8 páginas admin
- 13 endpoints de API
- 2 partidos cadastrados (PDA + PT)
- 175 membros gerenciáveis
- 3 tipos de CSV exportáveis
- ~800 linhas de código adicionadas
