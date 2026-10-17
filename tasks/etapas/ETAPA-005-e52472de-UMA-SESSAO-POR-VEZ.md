## Etapa 005-e52472de — Uma sessão de IA por vez nesta pasta

**Tarefa:** #5-e52472de-808b-4618-a602-10d57c7c3d3c · **Pedido em:** 2026-10-17 13:43 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "gerenciador-de-ia também 1 sessão por vez" (tarefa global `PASTA-UNICA-GLOBAL` do `rules-ai`, etapa 011)
**Objetivo:** só uma sessão de IA por vez em `C:\fontes\gerenciador-de-ia`, com a trava local `tasks/.sessao-ativa`.

### #5.1 — Regra no `CLAUDE.md` e `.gitignore`

**Próximo passo:** acrescentar a seção abaixo no fim do `CLAUDE.md` e criar o `.gitignore`.

- **Nível:** LEVE — só `.md` e `.gitignore`.
- **Modelo:** só Haiku — nunca outro
- **Effort:** low
- **Descrição:** (1) no fim do `CLAUDE.md` (depois da seção `## 9. Idioma`), uma linha em branco
  e a seção abaixo, sem mudar; (2) criar `.gitignore` com a linha `tasks/.sessao-ativa`.
- **Critério de pronto:** os 2 arquivos com o texto exato; nada mais alterado.

```markdown
## 10. Uma sessão por vez

- ⛔ Em `C:\fontes\gerenciador-de-ia` trabalha **uma sessão de IA por vez**, de qualquer IA ou
  modelo (decisão do usuário, 2026-10-17; C29 do `rules-ai`). Agente de equipe (subagente do
  líder) não conta: trabalha sob a trava do líder.
- **Ao começar** (antes de criar, reservar ou editar qualquer coisa): ler `tasks/.sessao-ativa`.
  - Existe, é de **outra** sessão e foi atualizado há **menos de 60 min** → **não trabalhar**:
    avisar o usuário quem está na pasta (o texto do arquivo) e parar.
  - Não existe, ou passou de 60 min sem atualização → gravar nele
    `<IA (modelo)> (<frente>) desde <data hora>` e seguir; se assumiu uma trava velha, dizer ao
    usuário de quem era.
- **Durante:** regravar o arquivo (mesmo texto + ` · atualizado <data hora>`) a cada subtarefa
  reservada ou entregue.
- **Ao terminar** (junto do **TAREFA FINALIZADA E SINCRONIZADA!** ou ao parar de trabalhar):
  apagar `tasks/.sessao-ativa`.
- O arquivo fica fora do Git (`.gitignore`): a trava é local, desta pasta.```

## Decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-17 13:43 | Uma sessão de IA por vez nesta pasta (opção A da `PASTA-UNICA-GLOBAL.1` do `rules-ai`) | Gelvazio | "gerenciador-de-ia também 1 sessão por vez" |