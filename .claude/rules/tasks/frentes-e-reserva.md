# 🧭 Frentes e reserva de tarefas

Reutilizável em qualquer projeto em que várias sessões ou IAs (Claude, Gemini, Grok, Copilot…)
trabalham no mesmo repositório e só se falam pelos arquivos. Quadro: `quadro.md`.

## Frentes

- Cada sessão é uma **frente**: `<ambiente> · <branch>` (ex.: `local · main`,
  `nuvem · <nome-da-sessão>`).
- Cada frente atualiza **só a própria linha** em "🧭 Frentes", ao começar e ao parar. Sem
  pendência → `⏹️ Encerrada`.
- O nome da IA/frente aparece na reserva, na linha da frente, no Executor da etapa e na mensagem
  de commit (ex.: `feat(x): ... por Claude Code (local · main)`).

## Pegar uma subtarefa

1. Sincronizar com o remoto; **só então** ler o `STATUS.md` (sem sincronizar, o quadro mente).
2. Escolher uma **subtarefa** (nunca a linha da mãe) com **"Em uso por" = `—`**, **todas as
   dependências ✅** e **do seu modelo** (coluna Modelo; regra de níveis do projeto). ⛔ **Nunca**
   de outro modelo, nem acima nem abaixo, sem exceção. Sem nível → classificar antes. Tarefa
   antiga sem subtarefas: vale a linha dela.
3. Entre as livres, a de **maior prioridade** (🔴 → 🟠 → 🟡 → 🟢); empate = ordem do quadro.
   🟢 Baixa só com orientação explícita do usuário. Sem subtarefa livre do seu modelo → não pega
   nenhuma e avisa o usuário.
4. Gravar `<IA (modelo)> (<frente>) (desde <data hora>)` em "Em uso por", fazer **commit + push
   imediatos** e só então começar o trabalho.
5. Push da reserva recusado → sincronizar, **reler** o quadro; se outra frente pegou a mesma
   subtarefa, desfazer a sua reserva e escolher outra.

## Limites

- **1 subtarefa reservada por frente.** Só pega a próxima depois de entregar ou liberar a atual.
- ⛔ Nunca mexer na reserva, na linha de frente ou na etapa de outra frente. Reserva "parada" não é
  abandonada: quem libera é **o usuário** (ou quem ele autorizar).
- Subtarefa grande demais (ou acima do seu nível) → dividir em subtarefas menores antes de
  começar, cada uma com linha própria, nível, prioridade (herda a da mãe) e dependências.
- A prioridade é **do usuário**; a IA não muda a de tarefas existentes sem pedido.
- Scripts e rascunhos temporários na **pasta da própria sessão**, nunca em pasta compartilhada
  nem no repositório.

## Conflitos

- Conflito no `STATUS.md` ao sincronizar: manter as mudanças das duas frentes (cada uma só mexe
  nas próprias linhas) e reler antes de seguir.

## Gatilho `;` — pegue a próxima tarefa do seu modelo

- Mensagem do usuário **só com `;`** = "Pegue a próxima tarefa disponível para o seu modelo".
  Vale para todas as IAs, sem confirmar nada antes.
- A IA faz, nesta ordem: **1)** sincronizar com o remoto; **2)** ler o `STATUS.md`; **3)** escolher a
  subtarefa por "Pegar uma subtarefa" (livre, dependências ✅, **do seu modelo**, maior
  prioridade); **4)** reservar (commit + push); **5)** executar até entregar; **6)** encerrar pelo
  ciclo da task e responder só **TAREFA FINALIZADA E SINCRONIZADA!**
- **Sem subtarefa livre do seu modelo** → não pega nenhuma e diz ao usuário qual modelo tem
  subtarefa livre (o `;` nunca autoriza pegar tarefa de outro modelo: `niveis-e-modelos.md`).
- Tarefa grande sem o "sim" do usuário ao plano **não** é pega pelo `;` (fica 👀 até o "sim").
- É **uma** subtarefa por mensagem `;`; para a seguinte, o usuário manda `;` de novo.
