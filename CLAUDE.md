# CLAUDE.md — Gerenciador de IA (visualizador 3D de tarefas)

> Regras deste repositório para **todas as IAs**. Precedência: este arquivo →
> `C:\fontes\CLAUDE.md` → regras globais (`C:\fontes\rules-ai`). Em divergência, vale este arquivo
> e o usuário decide.

## 1. Propósito

Página estática que mostra, **quase em tempo real**, numa cena 3D feita com **Three.js**:

- **qual tarefa** está sendo feita (subtarefa reservada, com título e nível);
- **por quem** (IA + modelo + frente);
- **há quanto tempo** (contador desde a reserva).

A página **só lê** os quadros de outros repositórios. Ela nunca escreve neles, não tem login e
não usa banco.

## 2. Fontes de dados

| Projeto | Arquivo lido | Tem "🧭 Frentes"? | Coluna Modelo? |
|---|---|---|---|
| `Gelvazio/aulasenai` | `tasks/STATUS.md` (branch `main`) | ✅ | ✅ (`Modelo` e `Verificado`) |
| `Gelvazio/dashboard-ai` | `tasks/STATUS.md` (branch `main`) | ❌ | ❌ (nível no título) |

- Os dois repositórios são **públicos**: leitura **sem token**. ⛔ Nunca colocar token, chave ou
  segredo na página, no código ou no Git.
- A lista de fontes fica **só** em `assets/js/config/fontes.js` (repositório, branch, caminho,
  nome exibido). Fonte nova = uma linha nova nessa lista, sem mexer no resto do código (SOLID: O).

### Como ler (o "quase tempo real")

O CDN do `raw.githubusercontent.com` guarda o arquivo por **5 minutos** (`Cache-Control:
max-age=300`). Por isso a leitura é feita em dois passos:

1. **Último commit do quadro** (a cada **60 s** por fonte):
   `GET https://api.github.com/repos/<dono>/<repo>/commits?path=tasks/STATUS.md&sha=main&per_page=1`
   com `If-None-Match: <ETag anterior>`. A resposta `304` não gasta o limite da API.
2. **Conteúdo, só quando o SHA mudou:**
   `GET https://raw.githubusercontent.com/<dono>/<repo>/<sha>/tasks/STATUS.md`. A URL com o SHA
   é única e não pega cópia velha do cache.

| Regra | Valor |
|---|---|
| Intervalo de leitura | 60 s por fonte (constante `INTERVALO_LEITURA_MS`) |
| Limite da API sem token | 60 requisições por hora por IP. Com `X-RateLimit-Remaining` < 10, dobrar o intervalo até `X-RateLimit-Reset` |
| Falha de rede ou `403`/`429` | manter a última cena, mostrar o aviso "fonte X sem atualização desde HH:MM" e tentar de novo no próximo ciclo |
| Aba escondida (`document.hidden`) | pausar a leitura; ao voltar, ler na hora |

- O atraso real é **o push de cada frente + até 60 s**. A fonte da verdade é o Git: tarefa sem
  push não aparece. Isso é esperado, não é erro.
- A página mostra, por fonte, a **data do último commit** do quadro e a **hora da última leitura**.

## 3. Formato esperado dos quadros

Leitura das tabelas Markdown **pelo nome da coluna, nunca pela posição**, porque as fontes têm
colunas diferentes. Coluna ausente = valor vazio (sem erro).

### Tabela "📌 Tarefas" (as duas fontes)

| Coluna | Uso | Observações |
|---|---|---|
| `Tarefa` | identificador | `#252`, `#243.3`, `#171-<uuid>`, `SUB-45.18`, `KIRO-DEV-CLONE.1` |
| `Título` | texto do cartão | tirar `**` e crases; o trecho `` `NIVEL · effort x` `` vira nível |
| `Prioridade` | 🔴 / 🟠 / 🟡 / 🟢 | só o emoji |
| `Modelo` | nível | `LEVE · só Haiku`, `PESADO · só Opus 5.5+ ou Fable`, `⚠️ sem nível…` |
| `Status` | estado | **só o 1º emoji** conta: ⬜ 🔄 ✅ ⛔ 👀; o resto é detalhe |
| `Em uso por` | reserva | formatos abaixo |
| `Depende de` | dependências | `—`, `Nenhuma` ou lista |

- **Tarefa-mãe:** título em negrito ou "Em uso por" = `— (não reservável)`. Não vira cartão
  sozinha: agrupa as subtarefas.
- **Nível:** primeiro a coluna `Modelo`; sem ela, o `` `LEVE|MEDIO|PESADO · effort …` `` do título;
  sem nenhum dos dois, `sem nível`.
- `🔒 Trava especial…` em "Em uso por" = bloqueada pelo usuário (não é reserva).

### Formatos de "Em uso por" (todos precisam ser lidos)

| Exemplo | IA | Modelo | Frente |
|---|---|---|---|
| `Claude Code (Opus 5.5) (nuvem · ccr-a26b3c0e-1ljztf) (desde 2026-10-16 21:48)` | Claude Code | Opus 5.5 | nuvem · ccr-… |
| `Qoder (local · main) (desde 2026-10-13 22:01)` | Qoder | — | local · main |
| `nuvem · session_01Lj… (desde 2026-10-14 23:31)` (antigo) | — | — | nuvem · session_… |

Regra de leitura: separar o `(desde AAAA-MM-DD HH:MM)` do fim. Dos parênteses que sobram, **o
último é a frente** (tem ` · `) e o anterior, se houver, é o modelo. O texto antes dos parênteses
é a IA. Sem parênteses, o texto todo é a frente. `—` = livre.

### Tabela "🧭 Frentes de trabalho" (só `aulasenai`)

Colunas `Frente | Tarefa (etapa) | Situação | Atualizado em`. A situação usa o 1º emoji:
🔄 Ativa · 👀 Aguardando o usuário · ⏹️ Encerrada. Fonte sem essa tabela → as frentes são
**montadas a partir das reservas** (uma frente por valor distinto de "Em uso por").

### Datas

Todas as datas dos quadros estão no **horário de Brasília** (UTC−3, sem horário de verão).
Converter com fuso fixo `-03:00`, nunca pelo fuso do navegador.

## 4. Cena 3D (Three.js)

| Elemento | Representação |
|---|---|
| Fonte (projeto) | **ilha/plataforma** com o nome do projeto; uma ao lado da outra |
| Frente | **estação** sobre a ilha (base + placa com o nome da frente e a IA + modelo) |
| Subtarefa reservada (🔄) | **bloco** sobre a estação, com a **cor do nível**; rótulo com id, título curto, IA (modelo) e **contador de tempo** (`2 h 14 min`, atualizado a cada segundo, sem nova leitura) |
| Frente 👀 Aguardando o usuário | estação na cor **âmbar**, pulsando devagar |
| Frente ⏹️ Encerrada | estação **cinza e translúcida**; só aparece se foi atualizada nas últimas 24 h |
| Reserva parada (> 24 h) | bloco com **contorno vermelho** (mesmo critério do `verify`) |
| ⛔ Bloqueada / 🔒 Trava | não vira bloco; entra só na contagem do painel |

Cores em constantes nomeadas (`assets/js/config/cores.js`), nunca soltas no código:

| Nível | Cor |
|---|---|
| `LEVE` | verde |
| `MEDIO` | azul |
| `PESADO` | roxo |
| `sem nível` | cinza claro |

- **Biblioteca:** Three.js `0.170.0` por **import map** do `cdn.jsdelivr.net`, com versão
  exata (`three@0.170.0`), nunca `@latest`. Complementos do mesmo pacote: `OrbitControls`
  (câmera) e `CSS2DRenderer` (rótulos em HTML, legíveis e com acento).
- **Painel 2D** (HTML sobre a cena): contagem por status de cada fonte, hora da última leitura,
  avisos de falha e legenda das cores.
- **Animação:** só `requestAnimationFrame`; a cena é **atualizada por diferença** (cria, move ou
  remove só o que mudou). Nada é recriado a cada leitura.
- Clique no bloco → abre a etapa no GitHub, em nova aba:
  `https://github.com/<dono>/<repo>/blob/main/tasks/<link da coluna Etapa>`.

## 5. Estrutura de pastas

```
index.html                       ← só estrutura + import map; sem CSS/JS inline
assets/
├── css/
│   ├── base.css                 ← tokens em :root, layout da página
│   └── painel.css               ← painel 2D e rótulos
└── js/
    ├── principal.js             ← inicialização: liga leitura → modelo → cena
    ├── config/
    │   ├── fontes.js            ← repositórios lidos (único lugar)
    │   └── cores.js             ← cores e medidas da cena
    ├── dados/
    │   ├── cliente-github.js    ← commits + raw por SHA, ETag, limite da API
    │   ├── leitor-tabela.js     ← tabela Markdown → objetos por nome de coluna
    │   ├── leitor-quadro.js     ← seções "📌 Tarefas" e "🧭 Frentes" → modelo
    │   └── leitor-reserva.js    ← "Em uso por" → { ia, modelo, frente, desde }
    ├── modelo/
    │   └── quadro.js            ← junta as fontes: projetos → frentes → reservas
    ├── cena/
    │   ├── cena-base.js         ← renderer, câmera, luzes, controles
    │   ├── ilha.js · estacao.js · bloco-tarefa.js
    │   └── rotulos.js           ← CSS2DRenderer
    ├── tela/
    │   └── painel.js            ← painel 2D
    └── utilitarios/
        └── tempo.js             ← fuso -03:00, "há quanto tempo"
```

- **HTML, CSS e JS separados**; ES modules (`type="module"`), sem bundler e sem `package.json`.
- **SOLID:** leitura (dados), regra (modelo) e desenho (cena/tela) não se misturam. O cliente do
  GitHub é **injetado** em quem lê (dá para trocar a fonte sem mexer no leitor).
- Limites: arquivo ≤ 1000 linhas, função ≤ 45, linha ≤ 100, ≤ 3 parâmetros, ≤ 2 níveis de
  aninhamento, JSDoc em toda função, constantes nomeadas.
- **Nomes em português sem acento** (`lerQuadro`, `blocoTarefa`, `INTERVALO_LEITURA_MS`); em
  inglês só o que vem do Three.js, do DOM e da API do GitHub.

### Como abrir

ES modules não carregam por `file://` (duplo clique). A página roda por servidor estático:

- **Publicado:** GitHub Pages deste repositório (branch `main`, raiz).
- **Local (pelo usuário):** `python -m http.server 8080` na raiz e abrir `http://localhost:8080`.

## 6. Validação (sem navegador)

- ⛔ A IA **não abre navegador**, não sobe servidor para conferir e **não escreve testes
  automatizados** (exceto ao corrigir bug).
- ✅ Conferir por: leitura do código; `node --check` em todo `.js`; e `curl` nas URLs das fontes
  (status `200` e cabeçalhos).
- ✅ Os leitores (`dados/`) não usam DOM nem Three.js: dá para rodar com `node` contra um
  `STATUS.md` baixado na pasta temporária da sessão e imprimir o resumo (frentes, reservas,
  contagens). Isso é conferência manual, não suíte de testes, e o script não entra no Git.
- O que só a tela mostra (cores, posição, animação) → avisar o usuário para conferir.

## 7. Git

- Tudo na **`main`**: sem branches paralelas, sem `git worktree`, sem PR.
- `git fetch --all --prune` + `git pull --rebase origin main` antes de ler o quadro.
- `git add <arquivos da tarefa>`, ⛔ nunca `git add .`/`-A`; ⛔ sem `push --force`; ⛔ sem
  `pull` sem `--rebase`.
- **Um commit por subtarefa** entregue, com o quadro no mesmo commit, e **push sempre**.
- Mensagem: `tipo(tema): descrição por <IA (modelo)> (<frente>)`, terminando com
  `Co-Authored-By: <modelo> <e-mail noreply do fornecedor>`.

## 8. Quadro de tarefas deste repositório

- Quadro em `tasks/STATUS.md`, etapas em `tasks/etapas/`, concluídas em `tasks/task_complete.md`.
- Regras do quadro (fonte única, copiadas na #1.1):
  [`quadro.md`](.claude/rules/tasks/quadro.md) ·
  [`ciclo-da-task.md`](.claude/rules/tasks/ciclo-da-task.md) ·
  [`frentes-e-reserva.md`](.claude/rules/tasks/frentes-e-reserva.md) ·
  [`verificacao.md`](.claude/rules/tasks/verificacao.md).
- Todo pedido que muda arquivo vira TASK **antes** de executar: criar → publicar → reservar →
  trabalhar. Ao terminar: responder **TAREFA FINALIZADA E SINCRONIZADA!**
- Mensagem só com `.` → listar as tarefas pendentes do quadro, sem começar nenhuma.
- Mensagem só com `;` → pegar a próxima subtarefa livre do **seu** modelo e executar (regra em
  [`frentes-e-reserva.md`](.claude/rules/tasks/frentes-e-reserva.md), global C24 do `rules-ai`).
- Mensagem `verify` → verificação do quadro (`verificacao.md`).

### Níveis — quem pega o quê

| Nível | Sinais | Claude Code |
|---|---|---|
| `LEVE` | só `.md`, textos, linhas do quadro, configuração sem lógica | **só Haiku** |
| `MEDIO` | código com lógica em 1 a 3 arquivos (leitores, painel, um elemento da cena) | **só Sonnet** |
| `PESADO` | arquitetura, cena 3D inteira, mais de 3 arquivos ligados, segurança, mudança em massa | **só Opus 5.5+ ou Fable** |

- O sinal mais restritivo vence; na dúvida, sobe o nível.
- ⛔ **Nunca executar subtarefa que não é do seu modelo**, nem a pedido: nem acima nem abaixo.
  Sem subtarefa livre do seu modelo → não pegar nenhuma e avisar o usuário.
- Reserva: `<IA (modelo)> (<frente>) (desde AAAA-MM-DD HH:MM)`, horário de Brasília.

## 9. Idioma

Respostas, comentários e documentação em **português do Brasil**, com acentuação correta.
