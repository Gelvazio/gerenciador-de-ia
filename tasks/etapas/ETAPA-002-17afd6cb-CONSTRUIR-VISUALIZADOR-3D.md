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
| 2026-10-17 11:42 | Plano aprovado: execução liberada para todas as subtarefas | Gelvazio | "execute a tarefa 2" |

### #2.1 — Configuração: fontes e cores

**Próximo passo:** ✅ Concluída (2026-10-17 11:47). Nada a fazer; a #2.2, a #2.3 e a #2.5 já podem ser pegas.

- **Nível:** LEVE — só constantes, sem lógica.
- **Modelo:** só Haiku — nunca outro.
- **Descrição:** `assets/js/config/fontes.js` (dono, repositório, branch, caminho, nome exibido
  das 2 fontes; `INTERVALO_LEITURA_MS = 60000`) e `assets/js/config/cores.js` (cores dos níveis,
  👀 âmbar, ⏹️ cinza, contorno de reserva parada, medidas da cena), conforme `CLAUDE.md` §2 e §4.
- **Critérios de aceitação:** os 2 arquivos exportam só constantes nomeadas, com JSDoc;
  `node --check` passa.
- **Entrega:** commit de fechamento da #2.1 (`git log --grep="#2.1"`): `assets/js/config/fontes.js`
  (`FONTES_QUADRO`, `INTERVALO_LEITURA_MS`, `CAMINHO_QUADRO`, `BRANCH_QUADRO` e os dois limites de
  24 h usados pelo modelo) e `assets/js/config/cores.js` (`CORES_NIVEL`, cores de 👀, ⏹️ e reserva
  parada, medidas da cena).
- **Verificação:** os dois arquivos têm sintaxe válida e importam sem erro: `fontes` traz as 2
  fontes, intervalo 60000, branch `main` e caminho `tasks/STATUS.md`; `cores` traz os 4 níveis.
  Nenhuma linha passa de 100 caracteres. Como o repositório não é `"type": "module"`, o
  `node --check` direto recusaria o `export`: a checagem foi feita numa cópia `.mjs` temporária.

### #2.2 — Página: HTML, import map e CSS

**Próximo passo:** ✅ Concluída (2026-10-17 12:01). Nada a fazer; a #2.7 e a #2.8 usam os ids e
classes listados na Entrega.

- **Nível:** MEDIO — estrutura de página em 3 arquivos.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `index.html` (semântico; import map com `three@0.170.0` e `three/addons/` do
  jsDelivr; contêiner da cena e do painel; `principal.js` como módulo), `assets/css/base.css`
  (tokens em `:root`, layout em tela cheia) e `assets/css/painel.css` (painel 2D e rótulos).
- **Critérios de aceitação:** sem `style=""` e sem JS inline; versão exata do Three.js; cores e
  medidas só em tokens.
- **Entrega:** commit de fechamento da #2.2 (`git log --grep="#2.2"`): `index.html`,
  `assets/css/base.css` e `assets/css/painel.css`. Contrato para as próximas subtarefas:
  - **Ids do HTML:** `cena` (a #2.7 põe o canvas e o `CSS2DRenderer` aqui), `painel`,
    `painel-fontes`, `painel-leitura` (texto da última leitura), `painel-lista-fontes` (`<ul>`),
    `painel-avisos` (`aria-live`) e `painel-lista-legenda` (`<ul>`, a #2.8 monta a legenda).
  - **Classes para a #2.8:** `painel__aviso` e `painel__aviso--erro`; `fonte__nome`,
    `fonte__detalhe`, `fonte__numeros`; `legenda__item`, `legenda__cor` e os modificadores
    `--leve`, `--medio`, `--pesado`, `--sem-nivel`, `--aguardando`, `--encerrada`, `--parada`.
  - **Classes para a #2.7 (rótulos):** `rotulo`, `rotulo--clicavel`, `rotulo__titulo`,
    `rotulo__quem`, `rotulo__tempo` e os modificadores `rotulo--aguardando`,
    `rotulo--encerrada`, `rotulo--parada`.
  - **Tokens de cor** em `:root` de `base.css`, iguais aos de `config/cores.js` (mudou lá, muda
    aqui).
  - `index.html` aponta para `assets/js/principal.js`, que só existe depois da #2.9 (até lá o
    navegador mostra 404 para esse arquivo; é esperado).
- **Verificação:** script de conferência na pasta temporária da sessão (não entra no Git):
  import map é JSON válido com `three@0.170.0` nas duas entradas; nenhum `style=`, `onXXX=` ou
  script com código inline; todo `var(--…)` tem token definido; nenhuma cor fixa fora de `:root`;
  chaves do CSS balanceadas; os 8 tokens de cor batem com `config/cores.js`; todos os ids do HTML
  existem; todas as classes do HTML têm regra no CSS (exceto `painel__cabecalho`, só contêiner);
  nenhuma linha passa de 100 caracteres; `three.module.js`, `OrbitControls.js` e
  `CSS2DRenderer.js` respondem `200` no jsDelivr. **Conferir na tela:** layout, posição do painel
  e aparência (a IA não abre navegador).

### #2.3 — Leitor de tabela Markdown e utilitário de tempo

**Próximo passo:** ✅ Concluída (2026-10-17 12:12). Nada a fazer; a #2.4 já pode ser pega e usa as
funções listadas na Entrega.

- **Nível:** MEDIO — lógica em 2 arquivos.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/dados/leitor-tabela.js` (acha a seção pelo título `##`, lê a tabela
  pelo **nome da coluna**, aceita coluna ausente) e `assets/js/utilitarios/tempo.js` (lê
  `AAAA-MM-DD HH:MM` com fuso fixo `-03:00`; formata "há quanto tempo": `2 h 14 min`).
- **Critérios de aceitação:** sem DOM e sem Three.js; rodando com `node` contra os 2 quadros reais,
  a tabela "📌 Tarefas" sai com o número de linhas certo.
- **Entrega:** commit de fechamento da #2.3 (`git log --grep="#2.3"`). Funções exportadas:
  - `leitor-tabela.js`: `lerTabelaDaSecao(markdown, titulo)` (atalho), `lerLinhasDaSecao`,
    `lerTabela(linhas)` e `dividirCelulas(linha)`. O título é comparado pelo começo, sem emoji
    (`"Tarefas"`, `"Frentes de trabalho"`). Cada linha vira um objeto `{ nomeDaColuna: texto }`;
    coluna ausente fica `undefined` (nunca erro); célula faltando na linha fica `""`; seção
    ou tabela inexistente devolve lista vazia.
  - `tempo.js`: `lerDataHoraBrasilia(texto)` (primeiro `AAAA-MM-DD HH:MM`, fuso `-03:00`, `null`
    se não houver hora), `formatarDuracao(ms)`, `haQuantoTempo(desde, agora?)` e
    `formatarHoraBrasilia(data)` (`"HH:MM"`, usado pelo aviso "sem atualização desde HH:MM").
- **Verificação:** módulos copiados como `.mjs` na pasta temporária da sessão (o repositório não é
  `"type": "module"`) e rodados com `node` contra os quadros lidos agora do GitHub. "📌 Tarefas":
  `aulasenai` 850 linhas, `dashboard-ai` 43 e o quadro deste projeto 10, todas iguais à contagem
  independente por `awk`. Colunas lidas pelo nome nos três (incluindo `Verificado` e `Modelo`
  só onde existem); "🧭 Frentes de trabalho" do `aulasenai` com 33 frentes e as 4 colunas certas;
  no `dashboard-ai`, sem essa seção, devolve vazio sem erro. Barra escapada `\|` e linha curta
  tratadas. `lerDataHoraBrasilia("(desde 2026-10-16 21:48)")` dá `2026-10-17T00:48:00Z`; 8 casos
  de `formatarDuracao` (de "menos de 1 min" a "1 d 2 h") e `formatarHoraBrasilia` conferem.
  Limites: nenhuma linha acima de 100 caracteres, funções de 3 a 17 linhas, até 2 parâmetros,
  JSDoc em todas, sem DOM nem Three.js.

### #2.4 — Leitores de reserva e do quadro

**Próximo passo:** ✅ Concluída (2026-10-17 12:17). Nada a fazer; a #2.6 já pode ser pega (depende
só da #2.4) e usa as funções listadas na Entrega.

- **Nível:** MEDIO — lógica em 2 arquivos.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/dados/leitor-reserva.js` ("Em uso por" → `{ ia, modelo, frente,
  desde }` nos 3 formatos do `CLAUDE.md` §3; `—`, `— (não reservável)` e `🔒 Trava`) e
  `assets/js/dados/leitor-quadro.js` (tarefas com status pelo 1º emoji, nível por `Modelo` ou
  pelo título, mãe × subtarefa; frentes da tabela "🧭 Frentes" quando existir).
- **Critérios de aceitação:** os 3 exemplos do `CLAUDE.md` §3 dão IA, modelo e frente certos;
  rodando com `node` contra os 2 quadros, as reservas 🔄 batem com o quadro.
- **Entrega:** commit de fechamento da #2.4 (`git log --grep="#2.4"`), 2 arquivos novos:
  - `leitor-reserva.js`: `lerReserva(texto)` → `{ tipo, ia, modelo, frente, desde, textoOriginal }`;
    `tipo` é um de `TIPO_RESERVA` (`livre`, `nao-reservavel`, `trava`, `reserva`); `desde` é um
    `Date` (ou `null` sem data com hora). Frente = o parêntese com ` · ` (o último); modelo = o
    outro parêntese; sem parênteses o texto todo é a frente.
  - `leitor-quadro.js`: `lerQuadro(markdown)` → `{ tarefas, frentes }`. Tarefa: `id`, `titulo`
    (limpo), `ehMae`, `nivel` (`LEVE`/`MEDIO`/`PESADO`/`sem nível`), `ehDoUsuario`, `prioridade`
    (`maxima`/`alta`/`media`/`baixa`), `status` (`pendente`, `em-execucao`, `concluido`,
    `bloqueado`, `aguardando-usuario`), `statusTexto`, `reserva`, `dependencias` (ids) e `etapa`
    (`{ texto, caminho }`). Frente: `nome`, `tarefaTexto`, `situacao` (`ativa`,
    `aguardando-usuario`, `encerrada`), `situacaoTexto` e `atualizadoEm` (`Date`). Também
    exporta `lerTarefa`, `lerFrente`, `lerNivel` e `limparTitulo`.
  - **Decisões de leitura:** o nível vem **só** da coluna `Modelo` quando ela existe (`Usuário`,
    `—` e `⚠️ sem nível` dão "sem nível", mesmo com marcador no título); sem a coluna (caso do
    `dashboard-ai`), vale o `` `NIVEL · effort x` `` do título. Mãe = título ou id em negrito, ou
    "Em uso por" = `— (não reservável)`. Quadro sem "🧭 Frentes" devolve `frentes: []`; montar as
    frentes pelas reservas é da #2.6.
- **Verificação:** módulos copiados para a pasta temporária da sessão (com `package.json`
  `"type": "module"`, na mesma estrutura de pastas) e rodados com `node` contra os quadros lidos
  agora do GitHub e contra o quadro deste projeto. Os 3 exemplos do `CLAUDE.md` §3 dão IA, modelo,
  frente e data certos (e `—`, `— (não reservável)`, `🔒`, sem `(desde`, só modelo). Contagens
  iguais às feitas por `grep`/`awk`: `aulasenai` 850 tarefas, 815 ⬜, 7 🔄 e 2 reservas
  (`#171-…` e `#243.3`, com IA, modelo e frente certos); `dashboard-ai` 43 tarefas, 39 ⬜, 1 🔄 e
  1 reserva (`SUB-62.3`, Qoder, `local · main`), 31 travas. Níveis do `aulasenai` iguais à coluna
  `Modelo` (3 LEVE, 53 MEDIO, 725 PESADO, 69 sem nível) e, no `dashboard-ai`, iguais aos
  marcadores do título (39). 33 frentes do `aulasenai` com situação e data; `dashboard-ai` sem
  frentes e sem erro. A conferência achou e corrigiu um erro: o nível caía no título mesmo com
  `Modelo` = `Usuário`. A #2.4 reservada por esta frente foi lida certo (Sonnet 5.5, `local ·
  main`, nível MEDIO, depende de `#2.3`). Limites: linhas ≤ 100 caracteres, funções de 3 a 22
  linhas, até 2 parâmetros, JSDoc em todas, sem DOM nem Three.js.

### #2.5 — Cliente do GitHub

**Próximo passo:** plano aprovado (2026-10-17 11:42); pegar quando as dependências estiverem ✅, só pelo modelo da linha `Modelo`.

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

**Próximo passo:** plano aprovado (2026-10-17 11:42); pegar quando as dependências estiverem ✅, só pelo modelo da linha `Modelo`.

- **Nível:** MEDIO — regra em 1 arquivo.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/modelo/quadro.js`: junta as fontes em projetos → frentes → reservas;
  monta frentes a partir das reservas quando a fonte não tem "🧭 Frentes"; filtra ⏹️ com mais de
  24 h; marca reserva parada (> 24 h); conta por status para o painel.
- **Critérios de aceitação:** sem DOM e sem Three.js; rodando com `node` contra os 2 quadros, o
  resumo impresso bate com as tabelas.
- **Entrega:** — · **Verificação:** —

### #2.7 — Cena 3D

**Próximo passo:** plano aprovado (2026-10-17 11:42); pegar quando as dependências estiverem ✅, só pelo modelo da linha `Modelo`.

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

**Próximo passo:** plano aprovado (2026-10-17 11:42); pegar quando as dependências estiverem ✅, só pelo modelo da linha `Modelo`.

- **Nível:** MEDIO — tela em 1 arquivo.
- **Modelo:** só Sonnet — nunca outro.
- **Descrição:** `assets/js/tela/painel.js`: contagem por status de cada fonte, data do último
  commit, hora da última leitura, aviso "fonte X sem atualização desde HH:MM" e legenda das cores.
- **Critérios de aceitação:** só monta HTML com classes de `painel.css` (sem `style=""`);
  `node --check` passa.
- **Entrega:** — · **Verificação:** —

### #2.9 — Integração (`principal.js`)

**Próximo passo:** plano aprovado (2026-10-17 11:42); pegar quando as dependências estiverem ✅, só pelo modelo da linha `Modelo`.

- **Nível:** PESADO — liga leitura, modelo, cena e painel (mais de 3 arquivos ligados).
- **Modelo:** só Opus 5.5+ ou Fable — nunca outro.
- **Descrição:** `assets/js/principal.js`: ciclo de leitura a cada 60 s por fonte; pausa com a aba
  escondida e leitura imediata ao voltar; passa o modelo para a cena e o painel; contador de tempo
  a cada segundo sem nova leitura; falha mantém a última cena.
- **Critérios de aceitação:** `node --check` em **todos** os `.js`; nenhum token; limites de
  código conferidos em todos os arquivos.
- **Entrega:** — · **Verificação:** —

### #2.10 — `README.md` e conferência na tela

**Próximo passo:** plano aprovado (2026-10-17 11:42); pegar quando as dependências estiverem ✅, só pelo modelo da linha `Modelo`.

- **Nível:** LEVE — só `.md`.
- **Modelo:** só Haiku — nunca outro.
- **Descrição:** `README.md` com o que é, como abrir (`python -m http.server 8080`) e como publicar
  pelo GitHub Pages (`main`, raiz). Item 👀 para o usuário: ativar o GitHub Pages e conferir a cena
  na tela (a IA não abre navegador).
- **Critérios de aceitação:** passos de abrir e publicar completos; item 👀 registrado.
- **Entrega:** — · **Verificação:** —
