/**
 * Inicialização da página: liga leitura (cliente do GitHub) → modelo → cena e painel.
 *
 * Ciclo (CLAUDE.md §2): lê todas as fontes juntas a cada INTERVALO_LEITURA_MS (o cliente dobra
 * o intervalo quando o limite da API está no fim); pausa com a aba escondida e lê na hora ao
 * voltar; o contador de tempo dos blocos anda a cada segundo, sem nova leitura. Uma falha
 * mantém a última cena: o cliente devolve o último estado bom junto com o erro.
 * Sem token e sem IA: só `api.github.com` e `raw.githubusercontent.com`.
 */

import { FONTES_QUADRO, INTERVALO_LEITURA_MS } from "./config/fontes.js";
import { criarCenaTarefas } from "./cena/cena-tarefas.js";
import { ClienteGithub, SITUACAO_LEITURA } from "./dados/cliente-github.js";
import { montarModelo } from "./modelo/quadro.js";
import { atualizarPainel } from "./tela/painel.js";
import { formatarHoraBrasilia } from "./utilitarios/tempo.js";

const ID_CENA = "cena";
const INTERVALO_CONTADOR_MS = 1000;
const MS_POR_MINUTO = 60000;
const TEXTO_SEM_CENA = "A cena 3D não abriu neste navegador (WebGL indisponível). " +
  "O painel continua mostrando os quadros.";

/**
 * Monta os avisos do limite da API: intervalo dobrado ou leitura pelo raw da branch.
 * @param {ClienteGithub} cliente Cliente com o último limite lido.
 * @param {number} intervaloMs Intervalo que será usado até a próxima leitura.
 * @returns {string[]} Textos de aviso (vazio quando o limite está folgado).
 */
function avisosDoLimite(cliente, intervaloMs) {
  const { restante, resetaEm } = cliente.limite;
  const ate = resetaEm ? ` até ${formatarHoraBrasilia(new Date(resetaEm))}` : "";
  if (cliente.limiteEsgotado()) {
    return [`Limite da API do GitHub esgotado: lendo o quadro pela branch (até 5 min de ` +
      `atraso)${ate}.`];
  }
  if (intervaloMs <= INTERVALO_LEITURA_MS) return [];
  const minutos = Math.round(intervaloMs / MS_POR_MINUTO);
  return [`Limite da API quase no fim (${restante} restantes): leitura a cada ${minutos} min` +
    `${ate}.`];
}

/** Ciclo de leitura das fontes e entrega do modelo para a cena e o painel. */
export class Visualizador {
  /**
   * @param {{cliente: ClienteGithub, cena: (object|null), documento: Document}} partes Cliente
   *   do GitHub, cena (`null` quando o WebGL não abriu) e o `document` da página.
   */
  constructor({ cliente, cena, documento }) {
    this.cliente = cliente;
    this.cena = cena;
    this.documento = documento;
    this.ultimaLeituraBoa = {};
    this.avisosFixos = cena ? [] : [TEXTO_SEM_CENA];
    this.temporizador = null;
    this.lendo = false;
  }

  /**
   * Começa: primeira leitura agora, contador a cada segundo e pausa com a aba escondida.
   * @returns {void}
   */
  iniciar() {
    this.documento.addEventListener("visibilitychange", () => this.aoMudarVisibilidade());
    setInterval(() => this.atualizarContador(), INTERVALO_CONTADOR_MS);
    this.lerAgora();
  }

  /**
   * Aba escondida: cancela a próxima leitura. Aba visível de novo: lê na hora.
   * @returns {void}
   */
  aoMudarVisibilidade() {
    if (this.documento.hidden) {
      clearTimeout(this.temporizador);
      this.temporizador = null;
      return;
    }
    this.lerAgora();
  }

  /**
   * Lê todas as fontes, entrega o modelo e agenda a próxima leitura (se a aba estiver visível).
   * Ignora o pedido se já houver uma leitura em andamento.
   * @returns {Promise<void>}
   */
  async lerAgora() {
    if (this.lendo) return;
    this.lendo = true;
    clearTimeout(this.temporizador);
    try {
      const leituras = await Promise.all(FONTES_QUADRO.map((fonte) => this.lerFonte(fonte)));
      this.entregar(leituras);
    } catch (erro) {
      console.error("Falha ao desenhar a leitura; a cena anterior continua:", erro);
    } finally {
      this.lendo = false;
      this.agendar();
    }
  }

  /**
   * Lê uma fonte e lembra a hora, quando a leitura deu certo (para o aviso "sem atualização").
   * @param {{dono: string, repositorio: string}} fonte Fonte da configuração.
   * @returns {Promise<{fonte: object, resultado: object}>} Leitura no formato de `montarModelo`.
   */
  async lerFonte(fonte) {
    const resultado = await this.cliente.lerFonte(fonte);
    if (resultado.situacao !== SITUACAO_LEITURA.ERRO) {
      this.ultimaLeituraBoa[resultado.fonte] = resultado.lidoEm;
    }
    return { fonte, resultado };
  }

  /**
   * Monta o modelo e atualiza a cena (por diferença) e o painel.
   * @param {Array<{fonte: object, resultado: object}>} leituras Uma por fonte.
   * @returns {void}
   */
  entregar(leituras) {
    const modelo = montarModelo(leituras, Date.now());
    if (this.cena) this.cena.atualizar(modelo);
    const intervalo = this.cliente.intervaloSugeridoMs(INTERVALO_LEITURA_MS);
    const avisosExtras = [...this.avisosFixos, ...avisosDoLimite(this.cliente, intervalo)];
    atualizarPainel(modelo, { ultimaLeituraBoa: this.ultimaLeituraBoa, avisosExtras },
      this.documento);
  }

  /**
   * Agenda a próxima leitura com o intervalo sugerido pelo cliente; com a aba escondida, não
   * agenda (a leitura volta no `visibilitychange`).
   * @returns {void}
   */
  agendar() {
    if (this.documento.hidden) return;
    const intervalo = this.cliente.intervaloSugeridoMs(INTERVALO_LEITURA_MS);
    this.temporizador = setTimeout(() => this.lerAgora(), intervalo);
  }

  /**
   * Avança o contador de tempo dos blocos, sem nova leitura.
   * @returns {void}
   */
  atualizarContador() {
    if (this.cena && !this.documento.hidden) this.cena.atualizarTempos(Date.now());
  }
}

/**
 * Cria a cena 3D; se o navegador não abrir o WebGL, segue só com o painel.
 * @param {Document} documento Documento da página.
 * @returns {object|null} Cena pronta, ou null.
 */
function criarCenaOuNada(documento) {
  try {
    return criarCenaTarefas(documento.getElementById(ID_CENA));
  } catch (erro) {
    console.error("Cena 3D indisponível:", erro);
    return null;
  }
}

new Visualizador({
  cliente: new ClienteGithub(),
  cena: criarCenaOuNada(document),
  documento: document,
}).iniciar();
