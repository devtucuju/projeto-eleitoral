# Etapa 01 — Plano aprovado

## O que aconteceu nesta etapa

Construção do plano de produto baseado em framework de apps virais aplicado ao nicho de campanha política. Resultado: um plano de 1207 linhas que cobre 5 sprints.

## Contexto

Antes de qualquer código, foi feita uma análise profunda do mercado brasileiro de sistemas políticos. Identificamos que existe saturação no ângulo errado (CRM para coordenação) e uma brecha clara (produto para o cabo na rua).

A análise cruzou três fontes:
- Mercado brasileiro (WhatsApp, cabos, lideranças)
- Casos atípicos globais (Obama 2012, Reach, Trump 2016, Alarmy/Finch/Opal)
- Comportamento real de cabos eleitorais no Amapá

## Perguntas que nortearam o plano

1. O que faz um app político viralizar?
2. Qual é o ângulo não ocupado pelos líderes?
3. Quem é o herói do produto (cabo ou coordenador)?
4. Como impedir a mentira operacional (cadastro fantasma)?
5. O que fazer em 90 segundos depois da conversa na calçada?

## Respostas

1. Progresso + pertencimento + compartilhamento (Strava + Duolingo)
2. Produto na mão do cabo, não do coordenador
3. O cabo, sempre
4. Confirmação difícil de falsificar via WhatsApp
5. Registro de conversa + envio de confirmação em 3-7 minutos

## Design system definido

**Nome na UI**: Célula
**Símbolo**: pino de rua, 1 cor, sem bandeira/urna

**Cores (função, não decoração)**:
- Fundo: #F6F4F0 (neutro, não-partidário)
- Ação: #1F6B4A (verde - ação principal, confirmado)
- Streak: #C45C26 (laranja - sequência)
- Divisor: #E7E4DE
- Texto: #1C1C1A
- Texto secundário: #6B6A66

**Tipografia**: SF Pro / Inter, 3 tamanhos apenas (34/17/13px)

**Componentes**: botão 56pt/14r, input 52pt/12r, tab bar 49pt

**As 5 telas obrigatórias**:
1. Auth (telefone + continuar)
2. Home (missão: 3/5 conversas + streak)
3. Registrar (nome + WhatsApp + confirmar)
4. Time (ranking da célula)
5. Ajustes (conta, time, notificações, sair)

**Anti-padrões travados**:
- Dashboard SaaS, KPI, mapa
- Frases motivacionais ("vamos juntos", "sua luta")
- Cara de TailAdmin/CRM
- Foto de político
- Glassmorphism, neon, 3D

## Conceito

**Frase-bússola**: "Um app de rua para cabo eleitoral que transforma conversa em voto confirmado no WhatsApp e mostra o progresso do time do bairro."

**Analogia**: Cal AI vs MyFitnessPal
- ELEGE = MyFitnessPal (tem tudo, cabo não abre)
- scampanha = Cal AI (uma coisa, extremamente bem)

## Quem opera o quê

| Entidade | Quem cria | Quando |
|----------|-----------|--------|
| Partido | Coordenador geral | Antes da campanha |
| Candidato | Coordenador geral | Convenção / registro TSE |
| Célula | Coordenador regional | Após definir regiões |
| Membro (cabo) | Coordenador convida OU cabo se autocadastra | Dia-a-dia |
| Status "fechado" | Automático (ao confirmar conversa) | Quando eleitor confirma |
| Missão | Coordenador de célula | Diário/semanal |

## Quem acessa o quê

| Recurso | Cabo | Coordenador | Eleitor |
|---------|------|-------------|---------|
| `/celula/*` | ✅ | ❌ | ❌ |
| `/admin/*` | ❌ | ✅ | ❌ |
| `/confirmar/[codigo]` | ❌ | ❌ | ✅ |

## Sprints definidos

1. Sprint 1: MVP cabo (5 telas + APIs + seed)
2. Sprint 2: Autocadastro + convite + auth
3. Sprint 3: Painel admin completo
4. Sprint 4: LGPD + árvore + notificações
5. Sprint 5: Coordenação avançada (futuro)

## Insights para narrativa

**Para slides/storytelling**:
- "Antes: 175 nomes numa planilha, ninguém sabia quais eram reais"
- "Depois: cada conversa confirmada por quem recebeu o voto"
- "O cabo não é dígito, é operador de campo"
- "O mercado tem 155 milhões de eleitores, o app deveria estar no bolso deles"

**Para vídeo**:
- Cena 1: Cabo na feira falando com eleitor
- Cena 2: 90 segundos depois, abrindo o app
- Cena 3: Registrando conversa, gerando confirmação
- Cena 4: Eleitor recebe WhatsApp e confirma
- Cena 5: Cabo sobe no ranking do time

**Para NotebookLM gerar podcast**:
Tópicos quentes:
- Por que CRMs políticos falham
- O poder do streak (Duolingo da política)
- A economia da confirmação (voto real vs voto prometido)
- A árvore de indicações como rede de confiança

## Arquivos criados nesta etapa

- `/home/devtucuju/.claude/plans/vamos-desenvolver-um-sistema-quiet-otter.md` (1207 linhas)
