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

**Próximo passo:** ✅ Concluída (2026-10-17 11:21). Nada a fazer.

- **Nível:** LEVE — só cópia de arquivos `.md`, sem lógica.
- **Modelo:** só Haiku — nunca outro.
- **Descrição:** copiar `quadro.md`, `ciclo-da-task.md`, `frentes-e-reserva.md` e
  `verificacao.md` de `aulasenai/.claude/rules/tasks/` para `.claude/rules/tasks/` deste
  repositório, sem nada específico do `aulasenai`.
- **Critérios de aceitação:** os 4 arquivos presentes; referências a arquivos que não existem aqui
  ajustadas ou retiradas.
- **Entrega:** commit de fechamento da #1.1 (`git log --grep="#1.1"`): as 4 cópias em
  `.claude/rules/tasks/`, com as referências a `tasks/RECADOS.md` e ao visualizador gerado
  retiradas (não existem aqui); a linha da `#1.1` foi para o `task_complete.md`.
- **Verificação:** os 4 arquivos existem e têm o mesmo tamanho dos originais antes dos ajustes
  (4785, 2771, 5252 e 2588 bytes); busca por `RECADOS`, `visualizador` e `aulasenai` nas cópias
  não acha nada.

### #1.2 — Escrever o `CLAUDE.md` do visualizador

**Próximo passo:** ✅ Concluída (2026-10-17 11:25). Nada a fazer; a mãe #1 também fecha.

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
- **Entrega:** commit de fechamento da #1.2 (`git log --grep="#1.2"`): `CLAUDE.md` na raiz com
  propósito, fontes e leitura (§2), formato das tabelas e de "Em uso por" (§3), cena Three.js
  (§4), pastas (§5), validação sem navegador (§6), git (§7) e quadro + níveis (§8).
- **Verificação:** os quadros foram lidos pelo GitHub em 2026-10-17 11:23: `200` sem token nas
  duas fontes; o raw tem `Cache-Control: max-age=300` e a API `commits?path=` respondeu `304`
  com `If-None-Match`, sem gastar o limite (55 de 60 restantes). O `three@0.170.0` (módulo,
  `OrbitControls` e `CSS2DRenderer`) responde `200` no jsDelivr. Nenhuma linha fora de tabela
  passa de 100 caracteres.

#### Decisões (#1.2)

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-17 11:25 | Ler o último commit pela API (`ETag`/`304`) e o conteúdo pelo raw com o SHA | Claude Code (Opus 5.5) | O raw por branch fica até 5 min em cache; com o SHA o atraso cai para ~60 s sem token |
| 2026-10-17 11:25 | Colunas lidas pelo nome, não pela posição | Claude Code (Opus 5.5) | O `dashboard-ai` não tem `Modelo`, `Verificado` nem "🧭 Frentes" |
| 2026-10-17 11:25 | ES modules sem bundler, publicação por GitHub Pages | Claude Code (Opus 5.5) | Página estática; `file://` não carrega módulos |
