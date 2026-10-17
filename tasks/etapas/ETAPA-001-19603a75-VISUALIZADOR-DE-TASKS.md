## Etapa 001-19603a75 — #1: `CLAUDE.md` do visualizador de tasks em 3D (Three.js)

**Tarefa:** #1-19603a75-4695-407e-a0ee-cb9bbd781ca0 · **Pedido em:** 2026-10-17 11:10 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "LEIA, https://github.com/Gelvazio/aulasenai, E https://github.com/Gelvazio/dashboard-ai,
E FAÇA 1 CLAUDE.MD AQUI, PRA QUE ESTE REPO FUNCIONE COMO UM VISUALIZADOR DE TASKAS, QUE FICA QUASE
EM TEMPO REAL" · "DEVE USAR A BIBLIOTECA Three.js" · "DE INICIO, APENAS PUBLIQUE A TAREFA"
**Objetivo:** deixar no `CLAUDE.md` deste repositório as regras para construir e manter um
visualizador 3D (Three.js) que mostra, quase em tempo real, qual tarefa está sendo feita, por quem
(IA + modelo + frente) e há quanto tempo, lendo os quadros do `aulasenai` e do `dashboard-ai`.

**Contexto já levantado (2026-10-17):**
- Os dois repositórios são **públicos** e usam a branch `main`: dá para ler o `tasks/STATUS.md`
  pelo GitHub sem token.
- No `aulasenai`, a reserva fica na coluna "Em uso por" (`<IA (modelo)> (<frente>) (desde <data
  hora>)`) e a frente na tabela "🧭 Frentes"; o `rules-ai` não junta as tarefas dos projetos.
- O "tempo real" depende do commit + push de cada frente (a fonte é o Git).

### #1.1 — Copiar as regras do quadro para `.claude/rules/tasks/`

**Próximo passo:** aguardar o usuário liberar a execução.

- **Nível:** LEVE — só cópia de arquivos `.md`, sem lógica.
- **Modelo:** só Haiku — nunca outro.
- **Descrição:** copiar `quadro.md`, `ciclo-da-task.md`, `frentes-e-reserva.md` e
  `verificacao.md` de `aulasenai/.claude/rules/tasks/` para `.claude/rules/tasks/` deste
  repositório, sem nada específico do `aulasenai`.
- **Critérios de aceitação:** os 4 arquivos presentes; referências a arquivos que não existem aqui
  ajustadas ou retiradas.
- **Entrega:** — · **Verificação:** —

### #1.2 — Escrever o `CLAUDE.md` do visualizador

**Próximo passo:** aguardar a #1.1 e a liberação do usuário.

- **Nível:** PESADO — define a arquitetura do projeto novo.
- **Modelo:** só Opus 5.5+ ou Fable — nunca outro.
- **Descrição:** ler o quadro do `aulasenai` e do `dashboard-ai` (estrutura do `STATUS.md`, frentes,
  "Em uso por", níveis) e escrever o `CLAUDE.md` com: propósito; fontes de dados (URLs raw do
  GitHub, intervalo de leitura); formato esperado das tabelas; cena 3D com Three.js (frente =
  estação, subtarefa reservada com cor do nível, contador de tempo, 👀/⏹️ com cores próprias);
  estrutura de pastas (HTML/CSS/JS separados, SOLID, nomes em português); validação sem navegador;
  regras de git e do quadro deste repositório.
- **Critérios de aceitação:** `CLAUDE.md` na raiz cobrindo todos os itens da descrição; Three.js
  como biblioteca de 3D; sem token na página; aponta para `.claude/rules/tasks/`.
- **Entrega:** — · **Verificação:** —
