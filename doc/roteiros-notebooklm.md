# Roteiros prontos para NotebookLM

Este arquivo contém prompts estruturados para gerar conteúdo rico via NotebookLM. Cole qualquer bloco no NotebookLM após adicionar os arquivos da pasta `doc/` como fontes.

## 1. Narrativa em 5 atos

```
Com base em todos os documentos da pasta doc/, crie uma narrativa em 5 atos sobre a construção do scampanha:

ATO 1 - O Problema (use 01-plano-aprovado.md)
Como o mercado de sistemas políticos brasileiros estava saturado no ângulo errado. O cabo era tratado como digitador.

ATO 2 - A Decisão (use 00-visao-geral.md e 01-plano-aprovado.md)
Por que escolhemos o ângulo do cabo na rua, não do coordenador. O framework Hold 2 Remix 5.

ATO 3 - O Produto (use 02-sprint-1-mvp.md)
O MVP nasceu: 5 telas, 173 apoiadores reais do Amapá, confirmação via WhatsApp.

ATO 4 - O Crescimento (use 03-sprint-2-autocadastro.md)
Como o cabo Alípio convida o primo. Árvore de indicações. 20 pontos por convite.

ATO 5 - O Cuidado (use 05-sprint-4-lgpd-pwa.md)
LGPD em 3 cliques. Direito ao esquecimento. PWA instalável. O produto respeita o usuário.

Termine cada ato com uma frase de impacto que sintetize o que foi aprendido.
```

## 2. Pitch executivo (10 slides)

```
Crie um pitch executivo de 10 slides (formato apresentação) sobre o scampanha. Use:
- doc/00-visao-geral.md para contexto
- doc/02-sprint-1-mvp.md para o produto
- doc/04-sprint-3-admin.md para B2B

Slide 1 - Capa: scampanha + Célula + tagline
Slide 2 - O problema: 175 nomes numa planilha, ninguém sabe quais são reais
Slide 3 - A solução em uma frase: conversa → confirmação → ranking
Slide 4 - Como funciona: o gesto em 90 segundos
Slide 5 - Por que WhatsApp: é o palco, não o app
Slide 6 - Diferencial vs concorrência: não é mais um CRM
Slide 7 - Métricas: 175 cabos, 38 células, 1 missão validada
Slide 8 - LGPD em 3 cliques
Slide 9 - Modelo de negócio: cabo viraliza, campanha paga
Slide 10 - Próximo passo: deploy + primeiros 100 cabos reais
```

## 3. Roteiro de podcast (15 min)

```
Crie um roteiro de podcast de 15 minutos sobre o scampanha. Formato: entrevista com 2 personas.

PERSONA 1 - Apresentador (curioso, leigo)
PERSONA 2 - Fundador do scampanha (técnico, apaixonado)

Use como base os documentos da pasta doc/. Estruture assim:

[00:00-01:30] Abertura - Apresentador pergunta "o que é o scampanha?"
[01:30-04:00] O mercado saturado - Por que CRM político não funciona
[04:00-07:00] A virada - Hold 2, Remix 5, foco no cabo
[07:00-10:00] Como funciona na prática - O fluxo da conversa
[10:00-12:30] Crescimento viral - Árvore de indicações
[12:30-14:00] LGPD e respeito - Esqueci meus dados em 3 cliques
[14:00-15:00] Encerramento - Onde estamos e pra onde vamos
```

## 4. Storytelling para vídeo (60 segundos)

```
Crie um roteiro de vídeo de 60 segundos para apresentar o scampanha. Use linguagem cinematográfica.

[00-10s] Cena: Cabo na feira. Close no rosto. Falando com eleitor. Acena.
[10-20s] Plano fechado: mão do cabo tirando o celular do bolso. Abre o app.
[20-30s] Tela do app: registra a conversa em 3 toques. Mensagem "enviar confirmação".
[30-40s] Corta pra: eleitor recebe WhatsApp. Clica "Sim, conversei".
[40-50s] Tela do app: notificação "+10 pontos. Sequência: 5 dias".
[50-60s] Tela final: ranking do bairro sobe. Logo Célula + tagline.

Narração: "Cada conversa vira voto confirmado. Cada cabo vira parte do time. scampanha."
```

## 5. Roteiro de demo (5 minutos, screencast)

```
Crie um roteiro de screencast de 5 minutos mostrando o scampanha em uso.

Mostre na tela, narre por cima:

[00:00-00:30] Tela inicial: /celula/auth
- Digite (96) 99999-0001 (Alípio Junior do Zerão)
- Clique Continuar

[00:30-01:00] Tela: /celula/home
- Mostre missão "Feira do Zerão - 5 conversas"
- Mostre streak "🔥 11 dias"
- Clique Nova conversa

[01:00-02:00] Tela: /celula/registrar
- Digite nome "Maria Teste"
- Digite WhatsApp
- Clique Enviar confirmação
- Mostre WhatsApp abrindo com mensagem pré-preenchida

[02:00-03:00] Simule: abra /confirmar/[codigo] em outra janela
- Mostre "Alípio disse que conversou com você em Zerão"
- Clique Sim, conversei
- Volta pro app

[03:00-03:30] Tela: /celula/home atualizada
- Mostre pontos subiram (+15)
- Streak continua (11 dias)

[03:30-04:30] Tela: /celula/time
- Mostre Alípio no ranking (VOCÊ em destaque)
- Clique na aba Árvore
- Mostre a hierarquia

[04:30-05:00] Tela: /celula/ajustes
- Mostre "+ Convidar cabo"
- Abra modal, copie link

Narração: "Em 5 minutos, um cabo registrou conversa, eleitor confirmou, ranking atualizou, e um novo cabo pode ser convidado. Esse é o scampanha."
```

## 6. FAQ para stakeholders

```
Com base em todos os documentos da pasta doc/, gere um FAQ de 15 perguntas para stakeholders (investidor, candidato, coordenador):

1. Por que isso não é mais um CRM?
2. Qual o diferencial vs ELEGE/Mandato?
3. Como o cabo novo entra sem o coordenador?
4. O que acontece se o cabo esquecer que cadastrou?
5. Por que WhatsApp e não outro canal?
6. Como funciona o ranking?
7. O que é a árvore de indicações?
8. Como garantem que o voto é real (não é cadastro falso)?
9. Quanto custa para a campanha usar?
10. Quanto tempo leva pra configurar uma campanha?
11. O que acontece se um cabo pedir demissão?
12. Como é o modelo de negócio?
13. Quando vou ver ROI?
14. Qual o tamanho do mercado?
15. Qual o próximo passo?

Para cada pergunta: 1 parágrafo de até 80 palavras.
```

## 7. Mensagens para WhatsApp/Email

```
Crie 5 mensagens curtas para diferentes públicos, baseadas nos docs:

1. PARA O CANDIDATO:
"Dr. [Nome], sua campanha tem 175 apoiadores cadastrados. 12 estão há 30 dias sem confirmar conversa. O scampanha te mostra quem está realmente trabalhando. Vamos conversar?"

2. PARA O COORDENADOR:
"Tem 3 cabos novos pedindo entrada na célula Zerão. 1 clique pra aprovar. scampanha.app/admin"

3. PARA O CABO:
"Alípio, você tá com sequência de 11 dias. Bateu meta de hoje. Tá em 2º no ranking do Zerão. Bora fechar mais 2?"

4. PARA O ELEITOR:
"Maria, o Alípio disse que conversou com você. Foi mesmo? Se sim, confirma aqui: celula.app/confirmar/XXXXX. Se não, ignora."

5. PARA O PARCEIRO:
"Construímos um app que o cabo de 50 anos realmente usa. Streak tipo Duolingo, ranking tipo Strava, confirmação tipo Alarmy. Em 5 sprints saímos do zero até 175 cabos reais do Amapá. Vamos escalar?"
```

## 8. Posts para LinkedIn / Twitter

```
Crie 6 posts curtos (LinkedIn e Twitter) sobre o scampanha. Cada um com 1 insight + 1 call-to-action.

Post 1: O mercado de campanhas políticas tem 155M de eleitores. Mas todos os apps existentes tratam o cabo como digitador. O que falta é produto na mão de quem puxa voto.

Post 2: O Opal/Alarmy moment do nicho político: confirmação pelo WhatsApp. Voto só conta se o eleitor clicar. Sem isso, você é planilha com tema escuro.

Post 3: Construímos o scampanha em 5 sprints. Do zero até 175 cabos reais do Amapá. Sem mascote. Sem frase motivacional. Sem dashboard cinza.

Post 4: 3 coisas que o design system do app NÃO usa: vermelho partidário, azul partidário, dourado político. Só #1F6B4A verde e #F6F4F0 fundo.

Post 5: Cada cabo que entra por convite dá +20 pontos pra quem convidou. Não é referral program. É como time de bairro funciona.

Post 6: LGPD em 3 cliques: esqueci meus dados → confirma → pronto. Membro vira "[REMOVIDO]", estrutura da campanha preservada. Respeito ao usuário é feature.
```

## 9. Especificação técnica para handoff

```
Com base em 02-sprint-1-mvp.md, 04-sprint-3-admin.md e schema.prisma, crie uma especificação técnica para uma equipe que vai assumir o código.

Seções:
1. Stack (versões exatas)
2. Arquitetura (camadas)
3. Modelo de dados (7 entidades + relações)
4. APIs (todas com método, path, body, response)
5. Páginas mobile (5) e admin (8)
6. Autenticação (cabo vs coordenador)
7. Cron jobs (cleanup, streak)
8. Variáveis de ambiente (.env)
9. Como rodar local
10. Como deployar (sugestão: Vercel + Supabase/Neon)
```

## 10. Análise competitiva

```
Compare o scampanha com 5 concorrentes brasileiros (ELEGE, Mandato.app, EleitorWEB, Cabo Eleitoral, E-Volunteer) usando 00-visao-geral.md e 01-plano-aprovado.md como base.

Para cada concorrente:
- Ângulo que ocupa
- Pontos fracos
- Onde o scampanha é melhor
- Onde o concorrente ainda é melhor

Termine com uma tabela resumo e o posicionamento único do scampanha.
```
