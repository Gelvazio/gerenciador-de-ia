# STATUS — Gerenciador de IA

**Objetivo:** visualizador 3D (Three.js), quase em tempo real, das tarefas em andamento nos
quadros do `aulasenai` e do `dashboard-ai`: qual tarefa, por quem e há quanto tempo.
**Partes interessadas:** Gelvazio (decide, aprova e usa)
**Links:** [Regras](../CLAUDE.md) · [Etapas](etapas/) · [Concluídas](task_complete.md)

## 🧭 Frentes de trabalho

| Frente | Tarefa (etapa) | Situação | Atualizado em |
|---|---|---|---|
| Claude Code (Opus 5.5) (local · main) | #2 aprovada ([002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md)); sem subtarefa livre do Opus (#2.7 e #2.9 aguardam dependências) | ⏹️ Encerrada | 2026-10-17 11:42 |
| Claude Code (Sonnet 5.5) (local · main) | #2.6 ([002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md)): modelo do quadro (a #4.1 é LEVE, só Haiku) | 🔄 Em execução | 2026-10-17 12:32 |
| Claude Code (Haiku 5.5) (local · main) | #4.1 ([004-7017f12c](etapas/ETAPA-004-7017f12c-SEM-TOKEN-DE-IA.md)): regra "Sem token de IA" no `CLAUDE.md` | 🔄 Ativa | 2026-10-17 15:33 |

## 📌 Tarefas

| Tarefa | Título | Prioridade | Modelo | Depende de | Status | Em uso por | Etapa |
|---|---|---|---|---|---|---|---|
| **#2-17afd6cb-ac6a-4e06-89b5-d3279a747688** | **Construir o visualizador 3D de tasks (projeto todo, conforme o `CLAUDE.md`)** | 🟡 Média | — | — | ⬜ Pendente (plano aprovado 2026-10-17 11:42) | — (não reservável) | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.6 | Modelo do quadro (projetos → frentes → reservas) · `MEDIO · effort medium` | 🟡 Média | MEDIO · só Sonnet | #2.4 ✅ | 🔄 Em execução | Claude Code (Sonnet 5.5) (local · main) (desde 2026-10-17 12:32) | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.7 | Cena 3D (Three.js) · `PESADO · effort high` | 🟡 Média | PESADO · só Opus 5.5+ ou Fable | #2.1, #2.2, #2.6 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.8 | Painel 2D · `MEDIO · effort medium` | 🟡 Média | MEDIO · só Sonnet | #2.2, #2.6 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.9 | Integração (`principal.js`) · `PESADO · effort high` | 🟡 Média | PESADO · só Opus 5.5+ ou Fable | #2.5, #2.7, #2.8 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| #2.10 | `README.md` e conferência na tela · `LEVE · effort low` | 🟡 Média | LEVE · só Haiku | #2.9 | ⬜ Pendente | — | [002-17afd6cb](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| **#4-7017f12c-053b-4384-9bab-0cd67585e900** | **O visualizador nunca consome token de IA (regra do projeto)** | 🟡 Média | — | — | ⬜ Pendente | — (não reservável) | [004-7017f12c](etapas/ETAPA-004-7017f12c-SEM-TOKEN-DE-IA.md) |
| #4.1 | Regra "Sem token de IA" no `CLAUDE.md` · `LEVE · effort low` | 🟡 Média | LEVE · só Haiku | — | 🔄 Em execução | Claude Code (Haiku 5.5) (local · main) (desde 2026-10-17 15:33) | [004-7017f12c](etapas/ETAPA-004-7017f12c-SEM-TOKEN-DE-IA.md) |

## Escopo do projeto

Página estática que lê o `tasks/STATUS.md` dos repositórios públicos `Gelvazio/aulasenai` e
`Gelvazio/dashboard-ai` e mostra as frentes e reservas numa cena 3D com Three.js.

## 🗂️ Etapas

| Etapa | Assunto | Arquivo |
|---|---|---|
| 001-19603a75 | `CLAUDE.md` do visualizador de tasks em 3D (#1, pedida em 2026-10-17 11:10) | [ETAPA-001-19603a75-VISUALIZADOR-DE-TASKS.md](etapas/ETAPA-001-19603a75-VISUALIZADOR-DE-TASKS.md) |
| 002-17afd6cb | Construir o visualizador 3D de tasks, projeto todo (#2, pedida em 2026-10-17 11:29) | [ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md](etapas/ETAPA-002-17afd6cb-CONSTRUIR-VISUALIZADOR-3D.md) |
| 003-c61319f5 | Gatilho `;` = pegue a próxima tarefa do seu modelo (#3, pedida em 2026-10-17 11:53) | [ETAPA-003-c61319f5-GATILHO-PONTO-E-VIRGULA.md](etapas/ETAPA-003-c61319f5-GATILHO-PONTO-E-VIRGULA.md) |
| 004-7017f12c | O visualizador nunca consome token de IA (#4, pedida em 2026-10-17 12:30) | [ETAPA-004-7017f12c-SEM-TOKEN-DE-IA.md](etapas/ETAPA-004-7017f12c-SEM-TOKEN-DE-IA.md) |

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
| 2026-10-17 12:30 | O visualizador (na página publicada e rodando local) nunca consome token de IA: sem chamada a modelo, agente ou chave de IA | Gelvazio | "este projeto, na visualizacao la na pagina e aqui local,nunca devem consumir token de IA" |
| 2026-10-17 12:27 | **Correção da decisão de 11:25:** sem token, o `304` da API GASTA 1 requisição (conferido: 53 → 52 → 51). O resto da decisão vale; o intervalo de 60 s não cabe no limite com 2 fontes (ver Pendências) | Claude Code (Sonnet 5.5) | Teste real na #2.5 |

## Pendências (ficou para depois)

| Data | Pendência | Motivo |
|---|---|---|
| 2026-10-17 | **Definir o intervalo de leitura da API.** 2 fontes a cada 60 s = 120 requisições por hora, e o limite sem token é 60 por IP: o limite acaba em cerca de 25 min e a leitura cai para o raw pela branch (até 5 min de atraso). Opções: (1) 150 s por fonte (48 por hora, sobra margem); (2) só raw pela branch, sempre com até 5 min de atraso e sem gastar a cota; (3) usar token, o que o `CLAUDE.md` proíbe na página | Depende do usuário (atraso × limite). O cliente já funciona nos dois casos; a #2.9 aplica o intervalo escolhido |

## Lições aprendidas

| Data | Lição | Regra |
|---|---|---|
