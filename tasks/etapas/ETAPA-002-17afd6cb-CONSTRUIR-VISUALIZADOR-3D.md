## Etapa 002-17afd6cb — #2: Construir o visualizador 3D de tasks (projeto todo)

**Tarefa:** #2-17afd6cb-ac6a-4e06-89b5-d3279a747688 · **Pedido em:** 2026-10-17 11:29 · **Criada por:** Claude Code (Opus 5.5) (local · main)
**Pedido:** "crie 1 task,seguindo o que o claude.md descreve,pra criar o projeto todo"
**Objetivo:** construir a página estática descrita no `CLAUDE.md` (§1 a §6): ler os quadros do
`aulasenai` e do `dashboard-ai` pelo GitHub e mostrar, numa cena Three.js, qual tarefa está sendo
feita, por quem e há quanto tempo.

### Escopo

- **Entra:** todos os arquivos da estrutura do `CLAUDE.md` §5 (`index.html`, `assets/css/`,
  `assets/js/` com `config/`, `dados/`, `modelo/`, `cena/`, `tela/`, `utilitarios/`); leitura
  da API + raw pelo SHA (§2); leitura das tabelas e de "Em uso por" (§3); cena (§4); `README.md`
  com como abrir e publicar.
- **Não entra:** escrever nos quadros de outros repositórios; login, banco ou token; testes
  automatizados; bundler ou `package.json`; fontes além das duas do `CLAUDE.md` (entram depois,
  por uma linha em `config/fontes.js`); ativar o GitHub Pages (é ação do usuário, item 👀 da #2.10).
- **Critério de pronto:** todos os arquivos do §5 existem; `node --check` passa em todo `.js`; os
  leitores rodados com `node` contra os dois `STATUS.md` reais listam frentes, reservas e contagens
  coerentes com o quadro; limites de código do `CLAUDE.md` §5 respeitados; nada de token no código.

### Premissas

- Os dois repositórios continuam **públicos** e com o quadro em `tasks/STATUS.md` na `main`.
- Three.js `0.170.0` continua no jsDelivr (conferido em 2026-10-17: `200`).
- O formato dos quadros é o do `CLAUDE.md` §3; formato novo vira tarefa nova.

### Riscos

| Risco | Plano B |
|---|---|
| Limite de 60 requisições/h da API sem token (vários navegadores no mesmo IP) | `304` não gasta; com `X-RateLimit-Remaining` < 10, dobrar o intervalo; se zerar, cair para o raw por branch (atraso de até 5 min) até `X-RateLimit-Reset` |
| `aulasenai/tasks/STATUS.md` grande (~340 KB) e com dezenas de frentes | baixar só quando o SHA muda; mostrar só frentes ativas, 👀 e encerradas nas últimas 24 h |
| Formato de "Em uso por" fora dos 3 conhecidos | cair para "frente = texto inteiro" e contar no painel como "reserva sem formato" |
| Cena e cores só conferíveis na tela (a IA não abre navegador) | usuário confere na #2.10 (👀); ajustes viram tarefa nova |

### Decisões

| Data | Decisão | Quem | Por quê |
|---|---|---|---|
| 2026-10-17 11:29 | Prioridade 🟡 Média (a mesma da #1) | Claude Code (Opus 5.5) | O pedido não definiu; o usuário pode mudar |

### #2.1 — Configuração: fontes e cores

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** LEVE — só constantes, sem lógica.
- **Modelo:** só Haiku — nunca outro.
- **Descrição:** `assets/js/config/fontes.js` (dono, repositório, branch, caminho, nome exibido
  das 2 fontes; `INTERVALO_LEITURA_MS = 60000`) e `assets/js/config/cores.js` (cores dos níveis,
  👀 âmbar, ⏹️ cinza, contorno de reserva parada, medidas da cena), conforme `CLAUDE.md` §2 e §4.
- **Critérios de aceitação:** os 2 arquivos exportam só constantes nomeadas, com JSDoc;
  `node --check` passa.
- **Entrega:** — · **Verificação:** —

### #2.2 — Página: HTML, import map e CSS

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** MEDIO — estrutura de página em 3 arquivos.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `index.html` (semântico; import map com `three@0.170.0` e `three/addons/` do
  jsDelivr; contêiner da cena e do painel; `principal.js` como módulo), `assets/css/base.css`
  (tokens em `:root`, layout em tela cheia) e `assets/css/painel.css` (painel 2D e rótulos).
- **Critérios de aceitação:** sem `style=""` e sem JS inline; versão exata do Three.js; cores e
  medidas só em tokens.
- **Entrega:** — · **Verificação:** —

### #2.3 — Leitor de tabela Markdown e utilitário de tempo

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** MEDIO — lógica em 2 arquivos.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/dados/leitor-tabela.js` (acha a seção pelo título `##`, lê a tabela
  pelo **nome da coluna**, aceita coluna ausente) e `assets/js/utilitarios/tempo.js` (lê
  `AAAA-MM-DD HH:MM` com fuso fixo `-03:00`; formata "há quanto tempo": `2 h 14 min`).
- **Critérios de aceitação:** sem DOM e sem Three.js; rodando com `node` contra os 2 quadros reais,
  a tabela "📌 Tarefas" sai com o número de linhas certo.
- **Entrega:** — · **Verificação:** —

### #2.4 — Leitores de reserva e do quadro

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** MEDIO — lógica em 2 arquivos.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/dados/leitor-reserva.js` ("Em uso por" → `{ ia, modelo, frente,
  desde }` nos 3 formatos do `CLAUDE.md` §3; `—`, `— (não reservável)` e `🔒 Trava`) e
  `assets/js/dados/leitor-quadro.js` (tarefas com status pelo 1º emoji, nível por `Modelo` ou
  pelo título, mãe × subtarefa; frentes da tabela "🧭 Frentes" quando existir).
- **Critérios de aceitação:** os 3 exemplos do `CLAUDE.md` §3 dão IA, modelo e frente certos;
  rodando com `node` contra os 2 quadros, as reservas 🔄 batem com o quadro.
- **Entrega:** — · **Verificação:** —

### #2.5 — Cliente do GitHub

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** MEDIO — lógica de rede em 1 arquivo.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/dados/cliente-github.js`: último commit do `STATUS.md` pela API com
  `If-None-Match`; conteúdo pelo raw com o SHA só quando mudou; leitura de `X-RateLimit-*` (dobra
  o intervalo com < 10; cai para o raw por branch se zerar); devolve `{ sha, data, texto }` ou
  erro tratado. `fetch` injetado (SOLID: D). Sem token.
- **Critérios de aceitação:** URLs e intervalos em constantes; `node --check` passa; uma leitura
  real com `node` traz o SHA e o texto das 2 fontes.
- **Entrega:** — · **Verificação:** —

### #2.6 — Modelo do quadro

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** MEDIO — regra em 1 arquivo.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/modelo/quadro.js`: junta as fontes em projetos → frentes → reservas;
  monta frentes a partir das reservas quando a fonte não tem "🧭 Frentes"; filtra ⏹️ com mais de
  24 h; marca reserva parada (> 24 h); conta por status para o painel.
- **Critérios de aceitação:** sem DOM e sem Three.js; rodando com `node` contra os 2 quadros, o
  resumo impresso bate com as tabelas.
- **Entrega:** — · **Verificação:** —

### #2.7 — Cena 3D

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** PESADO — cena inteira, 5 arquivos ligados.
- **Modelo:** só Opus 5.5+ ou Fable — nunca outro.
- **Descrição:** `assets/js/cena/cena-base.js` (renderer, câmera, luzes, `OrbitControls`,
  redimensionar), `ilha.js`, `estacao.js`, `bloco-tarefa.js` e `rotulos.js` (`CSS2DRenderer`),
  conforme `CLAUDE.md` §4: ilha por projeto, estação por frente, bloco com a cor do nível,
  👀 âmbar pulsando, ⏹️ cinza translúcida, contorno vermelho para reserva parada, clique abre a
  etapa no GitHub. Atualização **por diferença** (cria, move ou remove só o que mudou).
- **Critérios de aceitação:** cores só de `config/cores.js`; nenhum objeto recriado a cada leitura;
  limites de código respeitados; `node --check` passa.
- **Entrega:** — · **Verificação:** —

### #2.8 — Painel 2D

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** MEDIO — tela em 1 arquivo.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/tela/painel.js`: contagem por status de cada fonte, data do último
  commit, hora da última leitura, aviso "fonte X sem atualização desde HH:MM" e legenda das cores.
- **Critérios de aceitação:** só monta HTML com classes de `painel.css` (sem `style=""`);
  `node --check` passa.
- **Entrega:** — · **Verificação:** —

### #2.9 — Integração (`principal.js`)

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** PESADO — liga leitura, modelo, cena e painel (mais de 3 arquivos ligados).
- **Modelo:** só Opus 5.5+ ou Fable — nunca outro.
- **Descrição:** `assets/js/principal.js`: ciclo de leitura a cada 60 s por fonte; pausa com a aba
  escondida e leitura imediata ao voltar; passa o modelo para a cena e o painel; contador de tempo
  a cada segundo sem nova leitura; falha mantém a última cena.
- **Critérios de aceitação:** `node --check` em **todos** os `.js`; nenhum token; limites de
  código conferidos em todos os arquivos.
- **Entrega:** — · **Verificação:** —

### #2.10 — `README.md` e conferência na tela

**Próximo passo:** aguardar a aprovação do plano.

- **Nível:** LEVE — só `.md`.
- **Modelo:** só Haiku — nunca outro.
- **Descrição:** `README.md` com o que é, como abrir (`python -m http.server 8080`) e como publicar
  pelo GitHub Pages (`main`, raiz). Item 👀 para o usuário: ativar o GitHub Pages e conferir a cena
  na tela (a IA não abre navegador).
- **Critérios de aceitação:** passos de abrir e publicar completos; item 👀 registrado.
- **Entrega:** — · **Verificação:** —
