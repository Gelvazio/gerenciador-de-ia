/**
 * Cliente de leitura dos quadros no GitHub, sem token (CLAUDE.md §2). Não usa DOM nem Three.js.
 *
 * Leitura em dois passos, para ver mudanças em cerca de 1 minuto apesar do cache de 5 minutos
 * do `raw.githubusercontent.com`:
 *  1. último commit do quadro pela API, com `If-None-Match` (sem token, a resposta 304 gasta
 *     1 requisição como qualquer outra: ela só evita baixar o texto de novo);
 *  2. conteúdo pelo raw com o SHA, só quando o SHA mudou (a URL com SHA nunca vem velha).
 *
 * Limite de 60 requisições por hora sem token, e toda chamada à API gasta 1: com poucas
 * restantes o intervalo sugerido dobra; com zero restantes a leitura cai para o raw pela branch
 * (até 5 minutos de atraso) até o reset.
 * O `fetch` e o relógio entram pelo construtor, para trocar a fonte sem mexer na regra.
 */

import { BRANCH_QUADRO, CAMINHO_QUADRO } from "../config/fontes.js";

const URL_API = "https://api.github.com";
const URL_RAW = "https://raw.githubusercontent.com";
const TIPO_CONTEUDO_API = "application/vnd.github+json";
const CABECALHO_ETAG = "etag";
const CABECALHO_LIMITE_RESTANTE = "x-ratelimit-remaining";
const CABECALHO_LIMITE_RESETA = "x-ratelimit-reset";
const STATUS_NAO_MODIFICADO = 304;
const STATUS_PROIBIDO = 403;
const STATUS_MUITAS_REQUISICOES = 429;
const LIMITE_RESTANTE_PARA_DOBRAR = 10;
const FATOR_INTERVALO_LIMITADO = 2;
const MS_POR_SEGUNDO = 1000;

/** Resultado de uma leitura. */
export const SITUACAO_LEITURA = Object.freeze({
  NOVO: "novo",
  SEM_MUDANCA: "sem-mudanca",
  ERRO: "erro",
});

/** Tipos de erro de leitura. */
export const TIPO_ERRO = Object.freeze({ REDE: "rede", HTTP: "http", LIMITE: "limite" });

/** Caminho usado: API (com SHA) ou raw pela branch (sem SHA, só quando o limite acabou). */
export const VIA_LEITURA = Object.freeze({ API: "api", RAW_BRANCH: "raw-branch" });

/** Erro de leitura com tipo e status HTTP, tratado dentro do cliente. */
class ErroLeitura extends Error {
  /**
   * @param {string} tipo Um valor de TIPO_ERRO.
   * @param {number} status Status HTTP (0 quando não houve resposta).
   * @param {string} mensagem Texto do erro.
   */
  constructor(tipo, status, mensagem) {
    super(mensagem);
    this.tipo = tipo;
    this.status = status;
  }
}

/**
 * Monta a URL do último commit que mexeu no quadro.
 * @param {{dono: string, repositorio: string}} fonte Repositório lido.
 * @returns {string} URL da API de commits (um só resultado).
 */
export function urlUltimoCommit(fonte) {
  const consulta = `path=${CAMINHO_QUADRO}&sha=${BRANCH_QUADRO}&per_page=1`;
  return `${URL_API}/repos/${fonte.dono}/${fonte.repositorio}/commits?${consulta}`;
}

/**
 * Monta a URL do quadro no raw, fixada num SHA (ou numa branch).
 * @param {{dono: string, repositorio: string}} fonte Repositório lido.
 * @param {string} referencia SHA do commit ou nome da branch.
 * @returns {string} URL do arquivo no `raw.githubusercontent.com`.
 */
export function urlRaw(fonte, referencia) {
  return `${URL_RAW}/${fonte.dono}/${fonte.repositorio}/${referencia}/${CAMINHO_QUADRO}`;
}

/**
 * Lê o limite da API nos cabeçalhos de uma resposta.
 * @param {{get: function(string): (string|null)}} cabecalhos Cabeçalhos da resposta.
 * @returns {{restante: number|null, resetaEm: number|null}} Requisições restantes e instante
 *   do reset em milissegundos; null quando o cabeçalho não veio.
 */
export function lerLimite(cabecalhos) {
  const restante = Number.parseInt(cabecalhos.get(CABECALHO_LIMITE_RESTANTE) ?? "", 10);
  const reseta = Number.parseInt(cabecalhos.get(CABECALHO_LIMITE_RESETA) ?? "", 10);
  return {
    restante: Number.isNaN(restante) ? null : restante,
    resetaEm: Number.isNaN(reseta) ? null : reseta * MS_POR_SEGUNDO,
  };
}

/** Lê os quadros dos repositórios e lembra o último estado de cada um. */
export class ClienteGithub {
  /**
   * @param {{buscar?: function, agora?: function(): number}} [dependencias] `buscar` tem a forma
   *   do `fetch` (padrão: o `fetch` global) e `agora` devolve o instante atual em milissegundos.
   */
  constructor({ buscar = (...argumentos) => globalThis.fetch(...argumentos),
    agora = () => Date.now() } = {}) {
    this.buscar = buscar;
    this.agora = agora;
    this.estados = new Map();
    this.limite = { restante: null, resetaEm: null };
  }

  /**
   * Diz se o limite da API acabou e ainda não houve reset.
   * @returns {boolean} true quando não há mais requisições até o reset.
   */
  limiteEsgotado() {
    const { restante, resetaEm } = this.limite;
    return restante === 0 && resetaEm !== null && this.agora() < resetaEm;
  }

  /**
   * Sugere o intervalo entre leituras: dobra quando restam poucas requisições até o reset.
   * @param {number} intervaloBaseMs Intervalo normal em milissegundos.
   * @returns {number} Intervalo a usar, em milissegundos.
   */
  intervaloSugeridoMs(intervaloBaseMs) {
    const { restante, resetaEm } = this.limite;
    const restamPoucas = restante !== null && restante < LIMITE_RESTANTE_PARA_DOBRAR;
    const naJanela = resetaEm === null || this.agora() < resetaEm;
    return restamPoucas && naJanela ? intervaloBaseMs * FATOR_INTERVALO_LIMITADO : intervaloBaseMs;
  }

  /**
   * Lê o quadro de uma fonte. Nunca lança erro: falhas voltam em `erro`, junto com o último
   * estado conhecido, para a cena continuar mostrando o que já tinha.
   * @param {{dono: string, repositorio: string}} fonte Repositório a ler.
   * @returns {Promise<{situacao: string, fonte: string, sha: string, data: Date|null,
   *   texto: string, via: string, erro: ({tipo: string, status: number, mensagem: string}|null),
   *   lidoEm: Date}>} Resultado da leitura.
   */
  async lerFonte(fonte) {
    const chave = `${fonte.dono}/${fonte.repositorio}`;
    const estado = this.estados.get(chave) ?? null;
    try {
      if (this.limiteEsgotado()) return await this.lerPelaBranch(fonte, chave, estado);
      return await this.lerPelaApi(fonte, chave, estado);
    } catch (erro) {
      const tipo = erro instanceof ErroLeitura ? erro.tipo : TIPO_ERRO.REDE;
      const status = erro instanceof ErroLeitura ? erro.status : 0;
      const detalhe = { tipo, status, mensagem: String(erro?.message ?? erro) };
      return this.montarResultado(chave, SITUACAO_LEITURA.ERRO, estado, { erro: detalhe });
    }
  }

  /**
   * Passo 1 e 2: pergunta o último commit pela API e baixa o texto só se o SHA mudou.
   * @param {{dono: string, repositorio: string}} fonte Repositório a ler.
   * @param {string} chave Identificador `dono/repositorio`.
   * @param {object|null} estado Último estado guardado da fonte.
   * @returns {Promise<object>} Resultado da leitura.
   */
  async lerPelaApi(fonte, chave, estado) {
    const cabecalhos = { Accept: TIPO_CONTEUDO_API };
    if (estado?.etag) cabecalhos["If-None-Match"] = estado.etag;
    const resposta = await this.buscar(urlUltimoCommit(fonte), { headers: cabecalhos });
    this.guardarLimite(resposta.headers);

    if (resposta.status === STATUS_NAO_MODIFICADO && estado) {
      return this.montarResultado(chave, SITUACAO_LEITURA.SEM_MUDANCA, estado, {});
    }
    if (!resposta.ok) throw this.erroDaResposta(resposta);

    const commit = (await resposta.json())[0];
    if (!commit?.sha) throw new ErroLeitura(TIPO_ERRO.HTTP, resposta.status, "quadro sem commits");
    const etag = resposta.headers.get(CABECALHO_ETAG);
    if (estado?.sha === commit.sha) {
      this.estados.set(chave, { ...estado, etag });
      return this.montarResultado(chave, SITUACAO_LEITURA.SEM_MUDANCA, estado, {});
    }
    const data = new Date(commit.commit.committer.date);
    const texto = await this.baixarTexto(urlRaw(fonte, commit.sha));
    const novo = { sha: commit.sha, data, texto, etag };
    this.estados.set(chave, novo);
    return this.montarResultado(chave, SITUACAO_LEITURA.NOVO, novo, {});
  }

  /**
   * Plano B com o limite esgotado: lê o raw pela branch (sem SHA, com até 5 min de atraso).
   * @param {{dono: string, repositorio: string}} fonte Repositório a ler.
   * @param {string} chave Identificador `dono/repositorio`.
   * @param {object|null} estado Último estado guardado da fonte.
   * @returns {Promise<object>} Resultado da leitura, com `via` = raw-branch.
   */
  async lerPelaBranch(fonte, chave, estado) {
    const texto = await this.baixarTexto(urlRaw(fonte, BRANCH_QUADRO));
    const via = { via: VIA_LEITURA.RAW_BRANCH };
    if (estado?.texto === texto) {
      return this.montarResultado(chave, SITUACAO_LEITURA.SEM_MUDANCA, estado, via);
    }
    const novo = { sha: "", data: null, texto, etag: null };
    this.estados.set(chave, novo);
    return this.montarResultado(chave, SITUACAO_LEITURA.NOVO, novo, via);
  }

  /**
   * Baixa um arquivo de texto.
   * @param {string} url Endereço do arquivo.
   * @returns {Promise<string>} Conteúdo do arquivo.
   * @throws {ErroLeitura} Quando a resposta não é de sucesso.
   */
  async baixarTexto(url) {
    const resposta = await this.buscar(url);
    if (!resposta.ok) {
      const mensagem = `falha ao baixar o quadro (${resposta.status})`;
      throw new ErroLeitura(TIPO_ERRO.HTTP, resposta.status, mensagem);
    }
    return resposta.text();
  }

  /**
   * Guarda o limite informado pela API, se a resposta trouxe os cabeçalhos.
   * @param {{get: function(string): (string|null)}} cabecalhos Cabeçalhos da resposta.
   * @returns {void}
   */
  guardarLimite(cabecalhos) {
    const lido = lerLimite(cabecalhos);
    if (lido.restante !== null) this.limite = lido;
  }

  /**
   * Transforma uma resposta de erro da API em ErroLeitura.
   * @param {{status: number}} resposta Resposta que não foi de sucesso.
   * @returns {ErroLeitura} Erro de limite (429, ou 403 com zero restantes) ou de HTTP.
   */
  erroDaResposta(resposta) {
    const estourou = resposta.status === STATUS_MUITAS_REQUISICOES ||
      (resposta.status === STATUS_PROIBIDO && this.limite.restante === 0);
    const tipo = estourou ? TIPO_ERRO.LIMITE : TIPO_ERRO.HTTP;
    const motivo = estourou ? "limite da API do GitHub esgotado" : "a API recusou a leitura";
    return new ErroLeitura(tipo, resposta.status, `${motivo} (${resposta.status})`);
  }

  /**
   * Monta o objeto devolvido por `lerFonte`.
   * @param {string} chave Identificador `dono/repositorio`.
   * @param {string} situacao Um valor de SITUACAO_LEITURA.
   * @param {object|null} estado Estado a mostrar (último conhecido, ou o novo).
   * @param {{via?: string, erro?: object}} extras Caminho usado e erro, quando houver.
   * @returns {object} Resultado com sha, data, texto, via, erro e hora da leitura.
   */
  montarResultado(chave, situacao, estado, extras) {
    return {
      situacao,
      fonte: chave,
      sha: estado?.sha ?? "",
      data: estado?.data ?? null,
      texto: estado?.texto ?? "",
      via: extras.via ?? VIA_LEITURA.API,
      erro: extras.erro ?? null,
      lidoEm: new Date(this.agora()),
    };
  }
}
