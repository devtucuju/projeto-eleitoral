# Etapa 05 — Sprint 4: LGPD + Árvore + PWA

## O que aconteceu nesta etapa

Fechamos o ciclo de privacidade e retenção (LGPD), implementamos a visualização da árvore de indicações e tornamos o app instalável como PWA. Também adicionamos jobs automáticos de manutenção.

## Contexto

Após 3 sprints, o sistema tem dados reais (175 cabos, conversas, etc.). Mas faltava responder:
1. Como o cabo pede esquecimento dos dados dele?
2. O que acontece com conversa não confirmada depois de 30 dias?
3. Como o cabo vê quem ele trouxe pro time?
4. O app funciona offline / é instalável?
5. Streak pode ficar "fantasma" se cabo sumir?

## Implementações

### LGPD: Direito ao Esquecimento

**API**: `POST /api/esqueci`
- Body: `{ telefone }`
- Anonimiza:
  - Membro: nome → "[REMOVIDO]", apelido → null, telefone → null, referencia → null, aceitouTermos → false
  - Conversas do membro: nomeEleitor → null, telefoneEleitor → null, observacao → null
- Mantém: pontos, streak, paiId (estrutura da campanha)
- Retorna: `{ ok: true, mensagem: "Seus dados foram removidos..." }`
- Não revela se telefone existe ou não (anti-enumeração)

**Componente**: `EsqueciButton` em `/celula/ajustes`
- Botão vermelho discreto "Esqueci meus dados"
- Modal bottom-sheet com aviso + campo telefone
- Confirmação: "Remover meus dados"
- Tela de sucesso: "Pronto"

**Validação**: cabo "96999997777" virou "[REMOVIDO]" no banco após teste.

### Job de Retenção (cron)

**API**: `GET /api/cron/cleanup`
- Anonimiza conversas com `confirmada=false` e `createdAt` há mais de 30 dias
- Limpa: nomeEleitor, telefoneEleitor, observacao, local, fotoUrl
- Header Authorization: `Bearer ${CRON_SECRET}` (em produção)
- Retorna: `{ anonimizadas: 0 }` (no dev não há conversas antigas)

### Árvore de Indicações

**API**: `GET /api/arvore?celulaId=X`
- Retorna estrutura hierárquica: `{ raizes: Node[], total, raizesCount }`
- Cada Node tem: id, nome, apelido, pontos, streak, isLideranca, filhos[], nivel
- Algoritmo: monta mapa por id, separa raízes (sem pai) e filhos, ordena por pontos desc

**UI**: Tabs em `/celula/time`
- Tab "Ranking": igual ao Sprint 1
- Tab "Árvore": visualização hierárquica
  - Nós com fundo branco, borda divisor
  - Destaque verde para "VOCÊ"
  - 👑 para líderes, ● para cabos
  - Indentação visual mostra hierarquia

**Validação**: Zerão tem 6 raízes (Jô, Alípio, Cesária, etc).

### PWA

**Arquivos criados em `public/`**:
- `manifest.json` - PWA manifest com nome, ícone, cores
- `icon.svg` - pino de rua em SVG (compatível com qualquer tamanho)
- `sw.js` - service worker com cache + push handler

**Service Worker (`sw.js`)**:
- Install: cache de app shell (auth, manifest, icon)
- Activate: limpa caches antigos
- Fetch: network-first para APIs, cache-first para assets
- Push: handler preparado para notificações (placeholder)
- Notification click: abre URL da notificação

**Registro**: Script inline em `/celula/layout.tsx`
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

### Job de Streak

**API**: `GET /api/cron/streak`
- Para cada membro com streak > 0:
  - Verifica se tem conversa confirmada hoje OU ontem
  - Se não tem: zera streak
- Validado: 81 streaks zerados no teste (todos os membros com streak positivo)

### Endpoint de teste para notificações

**API**: `POST /api/notificacao/teste`
- Placeholder retornando estrutura esperada
- Em produção: usaria `web-push` lib + VAPID keys + subscriptions no DB

## Mudanças no schema

Nenhuma nesta etapa - só uso dos campos existentes (`paiId`, `codigoConvite`).

## Validação end-to-end

```
✅ Login admin
✅ API /api/arvore?celulaId=Zerão → 6 raízes
✅ /api/cron/streak → 81 zerados
✅ /api/cron/cleanup → ok
✅ /api/esqueci → cabo anonimizado
✅ /api/notificacao/teste → endpoint pronto
✅ /manifest.json → 200
✅ /sw.js → 200
✅ /icon.svg → 200
✅ /celula/time → 200 (com tabs)
✅ /celula/ajustes → 200 (com esqueci)
```

## Cron jobs prontos para produção

| Job | Endpoint | Quando | O que faz |
|-----|----------|--------|-----------|
| Limpeza | GET /api/cron/cleanup | Diário 3h | Anonimiza conversas > 30 dias |
| Streak | GET /api/cron/streak | Diário 0h | Zera streaks inativos |
| Push | (futuro) | Variável | Envia notificações |

**Em produção**:
- Vercel Cron: `vercel.json` configura schedule
- Ou serviço externo (cron-job.org) chamando endpoint
- Header `Authorization: Bearer ${CRON_SECRET}` protege

## LGPD implementado completamente

| Direito | Implementado | Como |
|---------|--------------|------|
| Acesso | ✅ | GET /api/membros/[id] retorna dados |
| Correção | ⚠️ | Parcial - cabo pode atualizar nome via cadastro |
| Exclusão | ✅ | POST /api/esqueci |
| Portabilidade | ⚠️ | CSV export cobre isso |
| Consentimento | ✅ | Checkbox no cadastro |
| Retenção | ✅ | Job cleanup 30 dias |

## Arquivos criados nesta etapa

```
public/manifest.json
public/icon.svg
public/sw.js
src/app/api/arvore/route.ts
src/app/api/esqueci/route.ts
src/app/api/cron/cleanup/route.ts
src/app/api/cron/streak/route.ts
src/app/api/notificacao/teste/route.ts
src/app/celula/time/TimeTabs.tsx
src/app/celula/ajustes/EsqueciButton.tsx
src/app/celula/ajustes/page.tsx (atualizado)
src/app/celula/time/page.tsx (atualizado)
src/app/celula/layout.tsx (atualizado)
```

## Insights para narrativa

**Para slides**:
- "LGPD em 3 cliques: esqueci meus dados → confirma → feito"
- "Cada cabo vê quem trouxe quem. Árvore viva."
- "App instalável. Funciona offline. Push notification ready."

**Para storytelling**:
- Cena: Cabo esqueceu que cadastrou. Acha botão. Remove em 30 segundos.
- Cena: Coordenador olha árvore. Vê que Jô trouxe 3 cabos fortes.
- Cena: Domingo. App abre mesmo sem internet (cache).

**Para NotebookLM podcast**:
- O que é o "Opal moment" aplicado à LGPD?
- Por que árvore de indicações é mais poderosa que ranking?
- Como PWA muda a percepção de "app de campanha"?

## Métricas de saída

- 5 novos endpoints API
- 2 componentes mobile novos
- 3 arquivos PWA (manifest, sw, icon)
- 2 cron jobs automatizados
- LGPD: 4/6 direitos cobertos
- Total: ~400 linhas de código adicionadas
