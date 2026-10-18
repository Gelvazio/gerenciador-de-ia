## Etapa 006-a6d57b86 — RL-988F933E-NIVEIS-E-MODELOS: ajustar o projeto à regra niveis-e-modelos.md

**Tarefa:** RL-988F933E-NIVEIS-E-MODELOS · **Pedido em:** 2026-10-18 13:41 · **Criada por:** DeepSeek Harness (deepseek-flash) (local · main)
**Pedido:** sincronização de tasks do rules-local: mudado niveis-e-modelos.md, 2026-10-18-f4bfe8d8 -> 2026-10-18-988f933e
**Objetivo:** atualizar a tabela de níveis do `CLAUDE.md` (§8) para a versão `2026-10-18-988f933e` do
`rules-local`: a regra global agora tem as linhas **OpenCode** (C37) e **Qoder** (C38) e permite
`PESADO` ao DeepSeek (C35; no OpenCode, com `deepseek-v4-pro`), e a tabela deste projeto ficou
defasada (só Claude Code, `PESADO` só Opus 5.5+ ou Fable).

### O que mudou na regra e o que muda no projeto

| Situação | Arquivo | Avaliação |
|---|---|---|
| mudado | `niveis-e-modelos.md` | **exige ajuste → esta TASK**: a tabela "Níveis — quem pega o quê" do `CLAUDE.md` (§8) não tem OpenCode nem Qoder e restringe o `PESADO` a Opus 5.5+/Fable |
| mudado | `INDEX.md` | sem ajuste — é o índice das regras da fonte; este projeto não tem índice próprio de regras globais |
| adicionado | `herdr.md` | sem ajuste — o projeto não usa herdr e não tem regra ou script que precise mudar |

### RL-988F933E-NIVEIS-E-MODELOS.1 — Atualizar a tabela de níveis do `CLAUDE.md` (§8)

**Próximo passo:** ler `rules-local/regras/niveis-e-modelos.md` na versão `2026-10-18-988f933e` e
aplicar no `CLAUDE.md` (§8, "Níveis — quem pega o quê") a matriz com as linhas **OpenCode** e
**Qoder** e a frase do `PESADO` com o `deepseek-v4-pro`.

- **Nível:** LEVE — só `.md` (tabela e frase), sem lógica.
- **Modelo:** só Haiku — nunca outro
- **Descrição:** em `CLAUDE.md` (§8): (1) acrescentar à tabela a linha `| **OpenCode** | DeepSeek V4.1
  Flash (\`deepseek-flash\`) | DeepSeek V4.1 Flash com thinking (\`deepseek-flash\`) | **DeepSeek V4
  Pro (\`deepseek-v4-pro\`)** |`; (2) acrescentar a linha `| **Qoder** | ✅ | ✅ | ⛔ |`; (3) ajustar a
  frase do `PESADO` para a da regra global, que inclui o DeepSeek e, no OpenCode, o
  `deepseek-v4-pro` (C35 e C37). Nada mais do projeto muda.
- **Critérios de aceitação:** a tabela de níveis do `CLAUDE.md` fica igual em conteúdo à de
  `rules-local/regras/niveis-e-modelos.md` da versão `2026-10-18-988f933e`; nenhum outro arquivo do
  projeto muda; commit + push na `main`.
- **Entrega:** — · **Verificação:** —
