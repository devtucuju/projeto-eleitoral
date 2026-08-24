# Documentação do scampanha

Esta pasta contém o passo a passo completo de cada etapa de construção do sistema. Foi desenhada para ser ingerida por um MCP do NotebookLM e gerar narrativas, slides, roteiros de podcast, etc.

## Como usar com NotebookLM

### Fluxo recomendado

1. **Ingestão**: Adicione todos os arquivos `.md` desta pasta como fontes no NotebookLM.

2. **Geração de narrativa**: Use prompts como:
   - "Crie uma narrativa em 5 atos da evolução do scampanha"
   - "Quais são os 3 maiores insights de produto de cada sprint?"
   - "Como um cabo Alípio usaria o app do começo ao fim?"

3. **Geração de slides**: 
   - "Crie 10 slides pitch (um por página) para apresentar o scampanha"
   - "Transforme a etapa 02 em 5 slides sobre o MVP"

4. **Geração de podcast/roteiro**:
   - "Faça um roteiro de podcast de 15 minutos explicando o produto"
   - "Quais entrevistas simuladas dariam vida à história?"

## Estrutura dos arquivos

| Arquivo | Conteúdo | Para que serve |
|---------|----------|----------------|
| [00-visao-geral.md](00-visao-geral.md) | Contexto, decisões, frame | Visão macro, pitch inicial |
| [01-plano-aprovado.md](01-plano-aprovado.md) | Como o plano foi construído | Entender o "porquê" antes do "como" |
| [02-sprint-1-mvp.md](02-sprint-1-mvp.md) | MVP cabo (5 telas + APIs + seed) | Demonstrar o produto funcionando |
| [03-sprint-2-autocadastro.md](03-sprint-2-autocadastro.md) | Cabo novo + convite + auth | Crescimento viral |
| [04-sprint-3-admin.md](04-sprint-3-admin.md) | Painel admin completo | Visão B2B / coordenação |
| [05-sprint-4-lgpd-pwa.md](05-sprint-4-lgpd-pwa.md) | LGPD + árvore + PWA | Privacidade + retenção |
| [06-etapa-admin-ux.md](06-etapa-admin-ux.md) | Admin responsivo + lista rica (TailAdmin) | Usar o poder do TailAdmin |

## Personas embutidas

Os documentos descrevem personas reais:

- **Alípio Junior** - cabo do Zerão, líder Rurap, status "fechado"
- **Cleia Comunicação** - cabo da Prefeitura, Renascer
- **Cleia filha** - cabo da Renascer, geração mais nova
- **Winnie/Max Ataliba** - casal de cabos, Parque dos Buritis
- **Jô Cunhado** - cabo Embrapa, Zerão
- **Coordenador** - perfil genérico que opera pelo /admin

## Cidades mencionadas

Macapá (capital), Santana, Oiapoque, Calçoene, Laranjal do Jari, Amapá, Ferreira Gomes, Itaubal, Pedra Branca, Porto Grande, Vitória do Jari, Cutiás, França.

## Bairros de Macapá

Zerão, Brasil Novo, Renascer, Infraero I/II, Açaí, Bela Vista, Jardim I, Buritizal, Santa Rita, Centro, Congós, Pacuí, Pacoval, Macapaba, Campina Grande, Maruanum, Pedrinhas, Alvorada, Curiaú, Parque Aeroportuário, Perpétuo Socorro, AP-070.

## Métricas de produto

- 175 apoiadores reais no banco
- 38 células em 13 municípios
- 5 sprints concluídos
- ~3000 linhas de código
- 8 telas mobile
- 8 páginas admin
- ~30 endpoints de API

## Frame conceitual

Para entender o produto, sempre voltar a:
- **Cal AI vs MyFitnessPal**: scampanha = Cal AI (uma coisa bem), ELEGE = MyFitnessPal (tudo mal)
- **Strava + Alarmy**: progresso visível + gesto impossível de falsificar
- **Hold 2**: confirmação no WhatsApp + progresso da célula
- **Remix 5**: cabo, visual de rua, Zap-first, linguagem de time, métrica confirmada

## Como navegar

Se você tem **5 minutos**: leia 00-visao-geral.md
Se você tem **30 minutos**: leia tudo em ordem
Se você quer **slides**: leia 00 + 02 (MVP) + 03 (convite)
Se você quer **pitch técnico**: leia 02 + 04 (admin)
Se você quer **história humana**: leia 03 (Alípio convidando) + 05 (LGPD)
