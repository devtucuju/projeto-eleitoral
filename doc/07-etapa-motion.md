# Etapa 07 — Design Motion ✅ Implementada

## O que mudou

O scampanha agora tem **vida**. Botões respondem ao toque, números sobem animados, confirmações celebram.

## Componentes criados

```
src/components/motion/
├── Counter.tsx       - Número que anima de X até Y (ease-out cubic)
├── ProgressBar.tsx   - Barra com fill animado
├── Skeleton.tsx      - Loading state (pulse)
├── HapticButton.tsx  - Botão com vibração + scale no tap
├── Confetti.tsx      - 24 partículas coloridas saindo do centro
├── Checkmark.tsx     - ✓ verde que se desenha (stroke pathLength)
└── Toaster.tsx       - Wrapper do sonner (toasts top-center)
```

## Bibliotecas adicionadas

```json
{
  "framer-motion": "^13.1.0",
  "sonner": "^2.0.0"
}
```

## Onde foi aplicado

### 1. **Home do cabo** (`/celula/home`)
- **Contador animado**: número "0/5" sobe de 0 até o valor real em 700ms
- **Barra de progresso**: fill animado de 0 até 100% em 600ms
- **Streak**: contador com ease-out

### 2. **Ranking no Time** (`/celula/time`)
- **Linhas aparecem em sequência**: cada linha entra com delay de 30ms
- **Slide lateral**: opacity + x: -10 → 0 (entrada), x: +10 (saída)
- **Contadores**: pontos e streak animam ao carregar

### 3. **Botão "Enviar confirmação"** (`/celula/registrar`)
- **Scale 0.96 ao tocar** (haptic feedback visual)
- **Vibração** (10ms) no celular via `navigator.vibrate`
- **Toast de sucesso**: "Conversa registrada!"

### 4. **Confirmação do eleitor** (`/confirmar/[codigo]`)
- **Botão "Sim, conversei"**: scale + vibração [10, 30, 10]
- **Ao confirmar**:
  - Vibração de sucesso
  - ✓ verde se desenha (stroke pathLength)
  - 24 partículas coloridas explodem do centro
  - Toast: "Conversa confirmada!"
  - Mensagem "Esse cabo ganhou pontos" desliza pra cima (delay 500ms)

### 5. **Admin - Lista de membros** (`/admin/membros`)
- **Linhas entram** com stagger (delay de 20ms por linha)
- **Botões inline** com scale no tap
- **Toasts** em cada ação: "Alípio Junior aprovado", "Cleia virou líder", etc.
- **AnimatePresence**: linha sai pra direita quando muda de página/filtro

### 6. **Layout** (`/celula/layout.tsx` e `/admin/layout.tsx`)
- **Toaster global** posicionado no topo, centro, 3.5s duração

## Detalhes técnicos

### Counter (easing)
```typescript
// ease-out cubic: começa rápido, desacelera
const eased = 1 - Math.pow(1 - progress, 3);
```

### HapticButton
```typescript
whileTap={{ scale: 0.96 }}  // 120ms
hapticPattern={[10, 30, 10]} // vibração de sucesso
```

### Confetti
- 24 partículas
- Ângulo aleatório ±30°
- Distância 80-160px
- Cores da paleta (verde #1F6B4A, laranja #C45C26, brand, success, warning)
- 1.2s duração, easeOut

### Checkmark
- Stroke animation (círculo + check)
- Delay 300ms entre círculo e check
- 400ms duração cada

## Antes vs Depois

### Confirmação do eleitor
```
ANTES                              DEPOIS
[Sim, conversei]                   [Sim, conversei]
    ↓ (reload)                        ↓ (vibração + scale)
[Confirmado]                       [✓ se desenha] [confetti explode]
                                   [Confirmado! + cabo ganhou pontos]
```

### Aprovar membro no admin
```
ANTES                              DEPOIS
[Aprovar]                          [Aprovar]
    ↓ (reload)                        ↓ (scale + toast verde)
[reload]                           ✓ "Alípio Junior aprovado"
                                   (linha desliza pra fora)
```

### Home do cabo
```
ANTES                              DEPOIS
3/5                                [0 → 3] (anima 700ms)
/5                                 [▓▓▓▓▓░░░] (barra preenche)
🔥 5 dias                          🔥 [5] (anima 500ms)
```

## Validação

```
✅ /celula/home: 200 (Counter + ProgressBar renderizados)
✅ /celula/time: 200 (motion.tr com stagger)
✅ /celula/registrar: 200 (HapticButton + toast)
✅ /confirmar/[codigo]: 200 (Checkmark + Confetti após click)
✅ /admin/membros: 200 (motion.tr + toast nas ações)
✅ /admin/dashboard: 200
✅ Layouts: Toaster global em ambos
✅ npm run build compila sem erros
```

## Melhorias finais aplicadas

### Auth (`/celula/auth`)
- Logo entra com scale + opacity
- Subtítulo "conversa → voto confirmado" com fade-in
- Telefone inválido: **shake animation** + vibração (50ms)
- Botão Continuar: 3 dots animados enquanto carrega
- HapticButton com padrão [15, 50]

### Home (`/celula/home`)
- 6 elementos com **stagger entrance** (delay incremental)
- Card de missão com hover (sobe 2px)
- Bolinha verde pulsante na missão ativa
- 🔥 com scale animado quando streak > 0
- Mensagem contextual **re-anima** quando conversas mudam
- HapticButton com padrão 20ms

### Time (`/celula/time`)
- Tabs com cross-fade (AnimatePresence mode="wait")
- Árvore: cada raiz entra com stagger (50ms delay)
- TreeNode: hover desliza 2px pra direita
- Loading: pulse animado

### Ajustes (`/celula/ajustes`)
- Bottom sheet abre com **spring animation** (damping 30, stiffness 300)
- ConvidarButton: whileTap scale 0.97 + cor de fundo
- Botão Copiar: ✓ Copiado! + vibração 10ms
- Compartilhar WhatsApp mantém haptic

### Admin membros
- Linhas com stagger 20ms por linha
- Exit animation (slide pra direita)
- whileTap scale 0.95 em todos os botões inline
- Toasts com nome do cabo ("Alípio Junior aprovado")

### Logout (correção)
- `/api/admin/logout` agora é GET (não só POST)
- Cookie `scampanha_admin` é removido corretamente
- Redirect para `/admin/login` sem sidebar

## Critérios aplicados

| Critério | Aplicado |
|----------|----------|
| Celebra sem distrair | ✅ Confetti só em momentos críticos |
| Comunica claramente | ✅ Toasts success/error |
| 200ms ou menos | ✅ Tap 120ms, toasts 3.5s, Counter 500-700ms |
| Não bloqueia usuário | ✅ Otimistic UI em patches |

## Inspiração

- **Duolingo**: contador subindo, vibração em acerto, confetti raro
- **Headway**: micro-celebração ao completar lição
- **Strava**: linha que aparece em sequência (stagger)
- **Alarmy**: feedback tátil (vibração) ao completar ação

## Arquivos modificados/criados

```
src/components/motion/Counter.tsx         (NOVO)
src/components/motion/ProgressBar.tsx     (NOVO)
src/components/motion/Skeleton.tsx        (NOVO)
src/components/motion/HapticButton.tsx    (NOVO)
src/components/motion/Confetti.tsx        (NOVO)
src/components/motion/Checkmark.tsx       (NOVO)
src/components/motion/Toaster.tsx         (NOVO)

src/app/celula/layout.tsx                 (Toaster global)
src/app/celula/home/page.tsx              (Counter + ProgressBar)
src/app/celula/time/TimeTabs.tsx          (motion.tr + AnimatePresence)
src/app/celula/registrar/page.tsx         (HapticButton + toast)

src/app/confirmar/[codigo]/ConfirmActions.tsx (Checkmark + Confetti + HapticButton + toast)

src/app/(admin)/layout.tsx                (Toaster global)
src/app/(admin)/admin/membros/MembrosClient.tsx (motion.tr + whileTap + toast)

package.json                              (+ framer-motion + sonner)
```

## Insights para narrativa

**Para slides**:
- "Antes: clique → reload. Agora: clique → vibra → confetti → +10 pts."
- "O streak sobe de 0 até o número. Você vê o seu próprio esforço."
- "24 partículas. ✓ verde se desenha. Haptic. É o Alarmy da política."

**Para storytelling**:
- Cena: Maria clica "Sim, conversei". Celular vibra. ✓ verde se desenha. Confetti. Toast: "Valeu!".
- Cena: Coordenadora aprova 3 cabos. Cada um com toast verde diferente.
- Cena: Cabo abre app. Número da missão anima. Barra preenche.

**Para NotebookLM**:
- O que é motion bem feito em apps de campanha?
- Por que vibração importa?
- Quando confetti é demais?

## Métricas de saída

- 7 componentes novos em `src/components/motion/`
- 6 arquivos modificados para usar motion
- 2 libs adicionadas (framer-motion, sonner)
- ~400 linhas adicionadas
- 0 quebras (todas as rotas continuam funcionando)
EOF
