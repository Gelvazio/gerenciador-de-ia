## Etapa 003-c61319f5 — #3: mensagem `;` = pegue a próxima tarefa do seu modelo (regra do projeto)

**Tarefa:** #3-c61319f5-f7c7-4adc-8883-edf33ebe16f8 · **Pedido em:** 2026-10-17 11:53 · **Criada por:** Claude Code (Sonnet 5.5) (local · main)
**Pedido:** "este ;, é um gatilho pra *Pegue a proxima tarefa disponivel para seu modelo*, anote esta
regra em rules-ai, global e aqui no projeto tambem,e rode o sincronizador de regras globais"
**Objetivo:** gravar neste projeto a regra do gatilho `;`, igual à global (tarefa `GATILHO-GLOBAL`
do `rules-ai`, etapa 006, conflito C24), para que valha também aqui se a regra global não chegar.

### #3.1 — Regra do gatilho `;` neste projeto

**Próximo passo:** reservar e executar (só Haiku). Primeiro `git pull --rebase origin main`.

- **Nível:** LEVE — só `.md`.
- **Modelo:** só Haiku — nunca outro (regra C22, sem exceção; o pedido veio a uma sessão Sonnet).
- **Descrição:** (1) acrescentar ao fim de `.claude/rules/tasks/frentes-e-reserva.md` a seção
  "Gatilho `;`" **idêntica** ao "Texto da regra" da etapa 006 do `rules-ai`
  (`C:\fontes\rules-ai\tasks\etapas\ETAPA-006-GATILHO-GLOBAL.md`); (2) em `CLAUDE.md`, na seção
  "8. Quadro de tarefas deste repositório", depois da linha da mensagem `.`, acrescentar:
  `- Mensagem só com `;` → pegar a próxima subtarefa livre do **seu** modelo e executar (regra em
  [`frentes-e-reserva.md`](.claude/rules/tasks/frentes-e-reserva.md), global C24 do `rules-ai`).`
- **Critérios de aceitação:** a seção está idêntica à do `rules-ai`; `CLAUDE.md` aponta para ela;
  nenhuma linha passa de 100 caracteres fora de tabelas.
- **Entrega:** — · **Verificação:** —

### Decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-17 11:53 | Regra do projeto = a mesma da global (C24), sem variação | Gelvazio | "anote esta regra em rules-ai, global e aqui no projeto tambem" |
