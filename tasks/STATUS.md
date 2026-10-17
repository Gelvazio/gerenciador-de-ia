# STATUS — Gerenciador de IA

**Objetivo:** visualizador 3D (Three.js), quase em tempo real, das tarefas em andamento nos
quadros do `aulasenai` e do `dashboard-ai`: qual tarefa, por quem e há quanto tempo.
**Partes interessadas:** Gelvazio (decide, aprova e usa)
**Links:** [Regras](../CLAUDE.md) · [Etapas](etapas/) · [Concluídas](task_complete.md)

## 🧭 Frentes de trabalho

| Frente | Tarefa (etapa) | Situação | Atualizado em |
|---|---|---|---|
| Claude Code (Opus 5.5) (local · main) | #1.2 e #1 ([001-19603a75](etapas/ETAPA-001-19603a75-VISUALIZADOR-DE-TASKS.md)) concluídas: `CLAUDE.md` do visualizador | ⏹️ Encerrada | 2026-10-17 11:30 |
| Claude Code (Haiku 5.5) (local · main) | #1.1 ([001-19603a75](etapas/ETAPA-001-19603a75-VISUALIZADOR-DE-TASKS.md)) concluída: regras do quadro copiadas | ⏹️ Encerrada | 2026-10-17 11:21 |

## 📌 Tarefas

| Tarefa | Título | Prioridade | Modelo | Depende de | Status | Em uso por | Etapa |
|---|---|---|---|---|---|---|---|

## Escopo do projeto

Página estática que lê o `tasks/STATUS.md` dos repositórios públicos `Gelvazio/aulasenai` e
`Gelvazio/dashboard-ai` e mostra as frentes e reservas numa cena 3D com Three.js.

## 🗂️ Etapas

| Etapa | Assunto | Arquivo |
|---|---|---|
| 001-19603a75 | `CLAUDE.md` do visualizador de tasks em 3D (#1, pedida em 2026-10-17 11:10) | [ETAPA-001-19603a75-VISUALIZADOR-DE-TASKS.md](etapas/ETAPA-001-19603a75-VISUALIZADOR-DE-TASKS.md) |

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

## Pendências (ficou para depois)

| Data | Pendência | Motivo |
|---|---|---|

## Lições aprendidas

| Data | Lição | Regra |
|---|---|---|
