/**
 * Modelo do visualizador: junta os quadros lidos e entrega projetos → frentes → reservas, mais as
 * contagens do painel. É só regra: não usa DOM, Three.js nem rede (recebe os textos já lidos).
 *
 * Regras (CLAUDE.md §3 e §4):
 *  - bloco = subtarefa reservada (`Em uso por` com IA/frente) em 🔄 Em execução, não-mãe;
 *  - quadro sem "🧭 Frentes" (ou reserva de frente que a tabela não lista): a frente é montada
 *    a partir das reservas;
 *  - frente ⏹️ Encerrada só aparece se foi atualizada nas últimas 24 h;
 *  - reserva parada = mais de 24 h sem atividade (a data mais recente entre o `desde` da reserva
 *    e a última atualização da frente na tabela).
 */

import {
  BRANCH_QUADRO,
  JANELA_FRENTE_ENCERRADA_MS,
  LIMITE_RESERVA_PARADA_MS,
} from "../config/fontes.js";
import { lerQuadro } from "../dados/leitor-quadro.js";
import { TIPO_RESERVA } from "../dados/leitor-reserva.js";

const STATUS_EM_EXECUCAO = "em-execucao";
const STATUS_CONHECIDOS = Object.freeze([
  "pendente", "em-execucao", "concluido", "bloqueado", "aguardando-usuario",
]);
const STATUS_OUTRO = "outro";
const SITUACAO_ATIVA = "ativa";
const SITUACAO_AGUARDANDO = "aguardando-usuario";
const SITUACAO_ENCERRADA = "encerrada";
const SITUACOES = Object.freeze([SITUACAO_ATIVA, SITUACAO_AGUARDANDO, SITUACAO_ENCERRADA]);
const NOME_FRENTE_SEM_NOME = "(frente sem nome)";

/**
 * Conta as linhas do quadro por status. Tarefas-mãe só entram em `maes`.
 * @param {object[]} tarefas Tarefas lidas por `lerQuadro`.
 * @returns {{total: number, maes: number, porStatus: Record<string, number>}} Contagens.
 */
export function contarTarefas(tarefas) {
  const porStatus = Object.fromEntries(STATUS_CONHECIDOS.map((status) => [status, 0]));
  let maes = 0;
  for (const tarefa of tarefas) {
    if (tarefa.ehMae) {
      maes += 1;
      continue;
    }
    const chave = tarefa.status in porStatus ? tarefa.status : STATUS_OUTRO;
    porStatus[chave] = (porStatus[chave] ?? 0) + 1;
  }
  return { total: tarefas.length, maes, porStatus };
}

/**
 * Nome da frente de uma reserva: a frente, ou a IA, ou um texto padrão.
 * @param {{frente: string, ia: string}} reserva Reserva lida.
 * @returns {string} Nome para agrupar a reserva.
 */
function nomeDaFrente(reserva) {
  return reserva.frente || reserva.ia || NOME_FRENTE_SEM_NOME;
}

/**
 * Monta o endereço da etapa no GitHub, ou texto vazio se a tarefa não tem link de etapa.
 * @param {{dono: string, repositorio: string}} fonte Repositório do quadro.
 * @param {{caminho: string}} etapa Etapa da tarefa (caminho relativo a `tasks/`).
 * @returns {string} URL da etapa.
 */
function urlDaEtapa(fonte, etapa) {
  if (!etapa.caminho) return "";
  const repositorio = `${fonte.dono}/${fonte.repositorio}`;
  return `https://github.com/${repositorio}/blob/${BRANCH_QUADRO}/tasks/${etapa.caminho}`;
}

/**
 * Lista as subtarefas reservadas e em execução (os blocos da cena).
 * @param {object[]} tarefas Tarefas lidas por `lerQuadro`.
 * @param {{dono: string, repositorio: string}} fonte Repositório do quadro.
 * @returns {object[]} Reservas com id, título, nível, IA, modelo, frente, desde e url da etapa.
 */
export function listarReservas(tarefas, fonte) {
  return tarefas
    .filter((tarefa) => !tarefa.ehMae && tarefa.status === STATUS_EM_EXECUCAO)
    .filter((tarefa) => tarefa.reserva.tipo === TIPO_RESERVA.RESERVA)
    .map((tarefa) => ({
      id: tarefa.id,
      titulo: tarefa.titulo,
      nivel: tarefa.nivel,
      ia: tarefa.reserva.ia,
      modelo: tarefa.reserva.modelo,
      frente: nomeDaFrente(tarefa.reserva),
      desde: tarefa.reserva.desde,
      parada: false,
      urlEtapa: urlDaEtapa(fonte, tarefa.etapa),
    }));
}

/**
 * Diz se uma reserva está parada: mais de 24 h sem atividade. Sem nenhuma data, não dá para
 * afirmar, então não está.
 * @param {Date|null} desde Início da reserva.
 * @param {Date|null} atualizadoEm Última atualização da frente na tabela (ou null).
 * @param {number} agora Instante atual em milissegundos.
 * @returns {boolean} true quando passou do limite sem atividade.
 */
export function estaParada(desde, atualizadoEm, agora) {
  const instantes = [desde, atualizadoEm].filter(Boolean).map((data) => data.getTime());
  if (instantes.length === 0) return false;
  return agora - Math.max(...instantes) > LIMITE_RESERVA_PARADA_MS;
}

/**
 * Diz se uma frente da tabela está encerrada há mais de 24 h (some da cena).
 * @param {{situacao: string, atualizadoEm: Date|null}} frente Frente lida da tabela.
 * @param {number} agora Instante atual em milissegundos.
 * @returns {boolean} true quando deve ser escondida.
 */
function encerradaHaMuito(frente, agora) {
  if (frente.situacao !== SITUACAO_ENCERRADA || !frente.atualizadoEm) return false;
  return agora - frente.atualizadoEm.getTime() > JANELA_FRENTE_ENCERRADA_MS;
}

/**
 * Cria uma frente a partir de uma frente da tabela do quadro.
 * @param {object} frente Frente lida por `lerFrente`.
 * @returns {object} Frente do modelo, ainda sem reservas.
 */
function frenteDaTabela(frente) {
  return {
    nome: frente.nome,
    situacao: frente.situacao,
    atualizadoEm: frente.atualizadoEm,
    tarefaTexto: frente.tarefaTexto,
    derivada: false,
    reservas: [],
  };
}

/**
 * Cria uma frente montada a partir de uma reserva (quando a tabela não lista essa frente).
 * @param {string} nome Nome da frente.
 * @returns {object} Frente ativa, derivada, sem reservas ainda.
 */
function frenteDerivada(nome) {
  return {
    nome,
    situacao: SITUACAO_ATIVA,
    atualizadoEm: null,
    tarefaTexto: "",
    derivada: true,
    reservas: [],
  };
}

/**
 * Coloca cada reserva na sua frente (criando a frente quando ela não existe) e marca as paradas.
 * @param {object[]} frentes Frentes da tabela já filtradas; recebem as reservas.
 * @param {object[]} reservas Reservas de `listarReservas`.
 * @param {number} agora Instante atual em milissegundos.
 * @returns {object[]} Todas as frentes, as da tabela mais as derivadas.
 */
function distribuirReservas(frentes, reservas, agora) {
  const porNome = new Map(frentes.map((frente) => [frente.nome, frente]));
  for (const reserva of reservas) {
    if (!porNome.has(reserva.frente)) {
      const nova = frenteDerivada(reserva.frente);
      porNome.set(reserva.frente, nova);
      frentes.push(nova);
    }
    const frente = porNome.get(reserva.frente);
    const parada = estaParada(reserva.desde, frente.derivada ? null : frente.atualizadoEm, agora);
    frente.reservas.push({ ...reserva, parada });
  }
  return frentes;
}

/**
 * Dá a uma frente derivada a data da reserva mais recente como "atualizada em".
 * @param {object} frente Frente do modelo.
 * @returns {object} A própria frente, com `atualizadoEm` preenchido se for derivada.
 */
function completarDataDaDerivada(frente) {
  if (!frente.derivada) return frente;
  const datas = frente.reservas.map((reserva) => reserva.desde).filter(Boolean);
  const maisRecente = datas.length ? new Date(Math.max(...datas.map((d) => d.getTime()))) : null;
  return { ...frente, atualizadoEm: maisRecente };
}

/**
 * Ordena as frentes: ativas, depois aguardando o usuário, depois encerradas; dentro de cada
 * grupo, a atualizada há menos tempo primeiro.
 * @param {object[]} frentes Frentes do modelo.
 * @returns {object[]} Nova lista ordenada.
 */
function ordenarFrentes(frentes) {
  const indice = (frente) => SITUACOES.indexOf(frente.situacao);
  const posicao = (frente) => (indice(frente) === -1 ? SITUACOES.length : indice(frente));
  const instante = (frente) => frente.atualizadoEm?.getTime() ?? 0;
  return [...frentes].sort((a, b) => posicao(a) - posicao(b) || instante(b) - instante(a));
}

/**
 * Conta as frentes por situação (derivadas contam como ativas).
 * @param {object[]} frentes Frentes visíveis do modelo.
 * @param {number} ocultas Quantas encerradas foram escondidas por terem mais de 24 h.
 * @returns {Record<string, number>} Contagem por situação, mais `encerradaOculta`.
 */
function contarFrentes(frentes, ocultas) {
  const contagem = Object.fromEntries(SITUACOES.map((situacao) => [situacao, 0]));
  for (const frente of frentes) contagem[frente.situacao] = (contagem[frente.situacao] ?? 0) + 1;
  return { ...contagem, encerradaOculta: ocultas };
}

/**
 * Monta o projeto (uma fonte) a partir do resultado da leitura.
 * @param {{fonte: object, resultado: object}} leitura Fonte da configuração e resultado do
 *   cliente (`texto`, `sha`, `data`, `erro`, `lidoEm`).
 * @param {number} agora Instante atual em milissegundos.
 * @returns {object} Projeto com frentes, reservas e contagens.
 */
export function montarProjeto(leitura, agora) {
  const { fonte, resultado } = leitura;
  const quadro = lerQuadro(resultado.texto ?? "");
  const ocultas = quadro.frentes.filter((frente) => encerradaHaMuito(frente, agora));
  const daTabela = quadro.frentes.filter((frente) => !ocultas.includes(frente)).map(frenteDaTabela);
  const reservas = listarReservas(quadro.tarefas, fonte);
  const frentes = ordenarFrentes(
    distribuirReservas(daTabela, reservas, agora).map(completarDataDaDerivada),
  );

  return {
    id: `${fonte.dono}/${fonte.repositorio}`,
    nome: fonte.nomeExibido,
    commit: { sha: resultado.sha ?? "", data: resultado.data ?? null },
    lidoEm: resultado.lidoEm ?? null,
    erro: resultado.erro ?? null,
    frentes,
    contagens: {
      tarefas: contarTarefas(quadro.tarefas),
      frentes: contarFrentes(frentes, ocultas.length),
      reservas: {
        total: frentes.reduce((soma, frente) => soma + frente.reservas.length, 0),
        paradas: frentes.reduce(
          (soma, frente) => soma + frente.reservas.filter((reserva) => reserva.parada).length, 0,
        ),
      },
    },
  };
}

/**
 * Monta o modelo inteiro a partir da leitura de todas as fontes.
 * @param {Array<{fonte: object, resultado: object}>} leituras Uma entrada por fonte.
 * @param {number} [agora] Instante atual em milissegundos (padrão: agora).
 * @returns {{geradoEm: Date, projetos: object[], totais: object}} Projetos e totais.
 */
export function montarModelo(leituras, agora = Date.now()) {
  const projetos = leituras.map((leitura) => montarProjeto(leitura, agora));
  const soma = (campo) => projetos.reduce((total, projeto) => total + campo(projeto), 0);
  return {
    geradoEm: new Date(agora),
    projetos,
    totais: {
      reservas: soma((projeto) => projeto.contagens.reservas.total),
      paradas: soma((projeto) => projeto.contagens.reservas.paradas),
      frentesAtivas: soma((projeto) => projeto.contagens.frentes[SITUACAO_ATIVA]),
      aguardandoUsuario: soma((projeto) => projeto.contagens.frentes[SITUACAO_AGUARDANDO]),
    },
  };
}
