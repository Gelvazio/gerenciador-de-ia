# STATUS — Gerenciador de IA

**Objetivo:** visualizador 3D (Three.js), quase em tempo real, das tarefas em andamento nos
quadros do `aulasenai` e do `dashboard-ai`: qual tarefa, por quem e há quanto tempo.
**Partes interessadas:** Gelvazio (decide, aprova e usa)
**Links:** [Regras](../CLAUDE.md) · [Etapas](etapas/) · [Concluídas](task_complete.md)

## 🧭 Frentes de trabalho

| Frente | Tarefa (etapa) | Situação | Atualizado em |
|---|---|---|---|
| Claude Code (Opus 5.5) (local · main) | #2 aprovada ([002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md)); sem subtarefa livre do Opus (#2.7 e #2.9 aguardam dependências) | ⏹️ Encerrada | 2026-10-17 11:42 |
| Claude Code (Sonnet 5.5) (local · main) | #2.3 ([002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md)): leitor de tabela Markdown e utilitário de tempo | 🔄 Em execução | 2026-10-17 12:09 |
| Claude Code (Haiku 5.5) (local · main) | #3.1 ([003-c61319f5](etapas/ETAPA-003-c61319f5-GATILHO-PONTO-E-VIRGULA.md)) concluída: regra do gatilho `;` neste projeto | ⏹️ Encerrada | 2026-10-17 11:58 |

## 📌 Tarefas

| Tarefa | Título | Prioridade | Modelo | Depende de | Status | Em uso por | Etapa |
|---|---|---|---|---|---|---|---|
| **#2-17afd6cb-ac6a-4e06-89b5-d3279a747688** | **Construir o visualizador 3D de tasks (projeto todo, conforme o `CLAUDE.md`)** | 🟡 Média | — | — | ⬜ Pendente (plano aprovado 2026-10-17 11:42) | — (não reservável) | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.3 | Leitor de tabela Markdown e utilitário de tempo · `MEDIO · effort medium` | 🟡 Média | MEDIO · só Sonnet | — | 🔄 Em execução | Claude Code (Sonnet 5.5) (local · main) (desde 2026-10-17 12:09) | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.4 | Leitores de reserva e do quadro · `MEDIO · effort medium` | 🟡 Média | MEDIO · só Sonnet | #2.3 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.5 | Cliente do GitHub (API + raw pelo SHA) · `MEDIO · effort medium` | 🟡 Média | MEDIO · só Sonnet | #2.1 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.6 | Modelo do quadro (projetos → frentes → reservas) · `MEDIO · effort medium` | 🟡 Média | MEDIO · só Sonnet | #2.4 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.7 | Cena 3D (Three.js) · `PESADO · effort high` | 🟡 Média | PESADO · só Opus 5.5+ ou Fable | #2.1, #2.2, #2.6 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.8 | Painel 2D · `MEDIO · effort medium` | 🟡 Média | MEDIO · só Sonnet | #2.2, #2.6 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.9 | Integração (`principal.js`) · `PESADO · effort high` | 🟡 Média | PESADO · só Opus 5.5+ ou Fable | #2.5, #2.7, #2.8 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.10 | `README.md` e conferência na tela · `LEVE · effort low` | 🟡 Média | LEVE · só Haiku | #2.9 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| **#3-c61319f5-f7c7-4adc-8883-edf33ebe16f8** | **Gatilho `;` = pegue a próxima tarefa do seu modelo (regra do projeto)** | 🟡 Média | — | — | ⬜ Pendente | — (não reservável) | [003-c61319f5](etapas/ETAPA-003-c61319f5-GATILHO-PONTO-E-VIRGULA.md) |

## Escopo do projeto

Página estática que lê o `tasks/STATUS.md` dos repositórios públicos `Gelvazio/aulasenai` e
`Gelvazio/dashboard-ai` e mostra as frentes e reservas numa cena 3D com Three.js.

## 🗂️ Etapas

| Etapa | Assunto | Arquivo |
|---|---|---|
| 001-19603a75 | `CLAUDE.md` do visualizador de tasks em 3D (#1, pedida em 2026-10-17 11:10) | [ETAPA-001-19603a75-VISUALIZADOR-DE-TASKS.md](etapas/ETAPA-001-19603a75-VISUALIZADOR-DE-TASKS.md) |
| 002-17afd6cb | Construir o visualizador 3D de tasks, projeto todo (#2, pedida em 2026-10-17 11:29) | [ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| 003-c61319f5 | Gatilho `;` = pegue a próxima tarefa do seu modelo (#3, pedida em 2026-10-17 11:53) | [ETAPA-003-c61319f5-GATILHO-PONTO-E-VIRGULA.md](etapas/ETAPA-003-c61319f5-GATILHO-PONTO-E-VIRGULA.md) |

## Riscos

| Data | Risco | Plano B |
|---|---|---|

## Bloqueios gerais

| Data | Bloqueio | O que destrava |
|---|---|---|

## Registro de decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-17 11:18 | Quadro próprio neste repositório (não no `aulasenai` nem no `rules-ai`) | Gelvazio | "QUADRO NOVO PRA ESTE REPO" |
| 2026-10-17 11:18 | O visualizador usa a biblioteca Three.js | Gelvazio | "DEVE USAR A BIBLIOTECA Three.js" |
| 2026-10-17 11:20 | Execução liberada: Haiku pega a #1.1 (LEVE); a #1.2 (PESADO) segue para Opus 5.5+ ou Fable | Gelvazio | "faça a tarefa pendente" |
| 2026-10-17 11:25 | Leitura dos quadros: API do GitHub (último commit, `304` gratuito) + raw pelo SHA, a cada 60 s; publicação por GitHub Pages | Claude Code (Opus 5.5) | Raw por branch fica 5 min em cache; detalhes na etapa 001 |
| 2026-10-17 11:53 | Gatilho `;` (pegar a próxima tarefa do seu modelo) vira regra deste projeto, igual à global C24 do `rules-ai` | Gelvazio | "este ;, é um gatilho pra *Pegue a proxima tarefa disponivel para seu modelo*, anote esta regra em rules-ai, global e aqui no projeto tambem" |
| 2026-10-17 11:42 | Plano da #2 aprovado; execução liberada para todas as subtarefas, cada uma pelo seu modelo | Gelvazio | "execute a tarefa 2" |

## Pendências (ficou para depois)

| Data | Pendência | Motivo |
|---|---|---|

## Lições aprendidas

| Data | Lição | Regra |
|---|---|---|
