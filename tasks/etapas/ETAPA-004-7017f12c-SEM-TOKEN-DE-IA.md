## Etapa 004-7017f12c — #4: o visualizador nunca consome token de IA (regra do projeto)

**Tarefa:** #4-7017f12c-053b-4384-9bab-0cd67585e900 · **Pedido em:** 2026-10-17 12:30 · **Criada por:** Claude Code (Sonnet 5.5) (local · main)
**Pedido:** "este projeto, na visualizacao la na pagina e aqui local,nunca devem consumir token de IA"
**Objetivo:** deixar escrito no `CLAUDE.md` que o visualizador, na página publicada e rodando local,
nunca usa IA (nem chamada de modelo, nem agente, nem chave), e como conferir isso sem navegador.

**Situação do código em 2026-10-17 12:30:** já respeita a regra. Os únicos hosts de rede em
`assets/` e `index.html` são `cdn.jsdelivr.net` (Three.js), `api.github.com` e
`raw.githubusercontent.com`; nenhuma chave, `.env`, biblioteca ou chamada de IA.

### #4.1 — Regra "Sem token de IA" no `CLAUDE.md`

**Próximo passo:** reservar e executar (só Haiku). Primeiro `git pull --rebase origin main`.

- **Nível:** LEVE — só `.md`.
- **Modelo:** só Haiku — nunca outro (regra C22, sem exceção; o pedido veio a uma sessão Sonnet).
- **Descrição:** em `CLAUDE.md`: (1) no fim da seção "1. Propósito", acrescentar o bloco abaixo,
  **sem mudar o texto**; (2) na seção "6. Validação (sem navegador)", acrescentar a linha de
  conferência abaixo, depois da última linha da lista.
- **Critérios de aceitação:** o bloco e a linha estão idênticos ao texto abaixo; nenhuma linha
  nova passa de 100 caracteres; o restante do `CLAUDE.md` não muda.
- **Entrega:** — · **Verificação:** — (rodar o `grep` da linha de conferência e colar o resultado:
  não pode achar nada em `assets/` nem em `index.html`)

**Bloco da seção 1 (copiar sem mudar):**

```markdown
### Sem token de IA

- ⛔ O visualizador **nunca consome token de IA**, nem na página publicada nem rodando aqui no
  computador. Vale para o código do projeto, para a página e para qualquer script dele.
- Proibido: chamar API de modelo de IA (Anthropic, OpenAI, Google, DeepSeek e outras), usar agente,
  biblioteca ou SDK de IA, e guardar chave de IA no código, na página, no `.env` ou no Git.
- Tudo o que a página faz é **código comum**: ler os quadros públicos pelo GitHub (API de commits e
  raw), interpretar as tabelas e desenhar a cena. Resumos, contagens e tempos são calculados por
  regra, nunca por IA.
- Não fala do trabalho das IAs que **constroem** o projeto (as sessões do Claude Code): vale só
  para o que o visualizador faz quando roda.
- Se uma ideia nova parecer pedir IA, **perguntar ao usuário antes**; não incluir por conta própria.
```

**Linha da seção 6 (copiar sem mudar):**

```markdown
- ✅ Conferir que não entrou IA: `grep -rniE "anthropic|openai|gemini|deepseek|api[_-]?key|process\.env" assets index.html`
  não pode achar nada, e os únicos hosts de rede são `cdn.jsdelivr.net`, `api.github.com` e
  `raw.githubusercontent.com`.
```

### Decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-17 12:30 | A regra vale só para este projeto (não é global no `rules-ai`) | Claude Code (Sonnet 5.5) | O pedido diz "este projeto"; o usuário pode pedir a global |
| 2026-10-17 12:30 | "Token de IA" = qualquer uso de modelo de IA (chamada, agente, chave). O token do GitHub segue proibido por outra regra (§2) | Claude Code (Sonnet 5.5) | As duas coisas aparecem como "token" nas conversas |
