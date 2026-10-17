/**
 * Painel 2D: quadros lidos, contagens por status, avisos e legenda das cores.
 *
 * Duas partes: `descreverPainel` (pura, só dados e textos) e `renderizarPainel` (desenha no DOM
 * com `textContent` e classes de `assets/css/painel.css`; nunca `innerHTML` nem `style`).
 * Os elementos são os ids de `index.html`: painel-leitura, painel-lista-fontes, painel-avisos
 * e painel-lista-legenda.
 */

import { INTERVALO_LEITURA_MS } from "../config/fontes.js";
import { formatarDataHoraBrasilia, formatarHoraBrasilia } from "../utilitarios/tempo.js";

const ID_LEITURA = "painel-leitura";
const ID_LISTA_FONTES = "painel-lista-fontes";
const ID_AVISOS = "painel-avisos";
const ID_LISTA_LEGENDA = "painel-lista-legenda";
const SEPARADOR = " · ";
const MS_POR_SEGUNDO = 1000;
const SEGUNDOS_POR_MINUTO = 60;
const TAMANHO_SHA_CURTO = 7;
const TEXTO_SEM_LEITURA = "Aguardando a primeira leitura…";
const TEXTO_SEM_TAREFAS = "nenhuma tarefa lida";
const TEXTO_SEM_COMMIT = "Quadro ainda não lido";
const TEXTO_COMMIT_INDISPONIVEL = "Último commit do quadro: indisponível (leitura sem a API)";

/** Rótulos dos status: [chave do modelo, singular, plural]. */
const ROTULOS_STATUS = Object.freeze([
  ["pendente", "pendente", "pendentes"],
  ["em-execucao", "em execução", "em execução"],
  ["aguardando-usuario", "aguardando você", "aguardando você"],
  ["bloqueado", "bloqueada", "bloqueadas"],
  ["concluido", "concluída", "concluídas"],
]);

/** Legenda das cores (o modificador é a classe `legenda__cor--<modificador>`). */
export const LEGENDA = Object.freeze([
  { modificador: "leve", texto: "LEVE: tarefa fácil (só Haiku)" },
  { modificador: "medio", texto: "MEDIO: tarefa média (só Sonnet)" },
  { modificador: "pesado", texto: "PESADO: tarefa difícil (só Opus 5.5+ ou Fable)" },
  { modificador: "sem-nivel", texto: "Sem nível definido" },
  { modificador: "aguardando", texto: "Frente aguardando você" },
  { modificador: "encerrada", texto: "Frente encerrada (vista por até 24 h)" },
  { modificador: "parada", texto: "Reserva parada (mais de 24 h sem atividade)" },
]);

/**
 * Escreve "N singular" ou "N plural".
 * @param {number} quantidade Quantidade.
 * @param {string} singular Texto para 1.
 * @param {string} plural Texto para os demais valores.
 * @returns {string} Quantidade seguida do rótulo.
 */
function contar(quantidade, singular, plural) {
  return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

/**
 * Descreve o intervalo de leitura: minutos quando exato, senão segundos.
 * @param {number} milissegundos Intervalo.
 * @returns {string} Texto como "1 min" ou "150 s".
 */
function descreverIntervalo(milissegundos) {
  const segundos = Math.round(milissegundos / MS_POR_SEGUNDO);
  const exatoEmMinutos = segundos % SEGUNDOS_POR_MINUTO === 0;
  return exatoEmMinutos ? `${segundos / SEGUNDOS_POR_MINUTO} min` : `${segundos} s`;
}

/**
 * Monta o texto do alto do painel: hora da última leitura e totais.
 * @param {{projetos: object[], totais: object}} modelo Modelo de `montarModelo`.
 * @returns {string} Texto da leitura.
 */
function textoDaLeitura(modelo) {
  const instantes = modelo.projetos.map((projeto) => projeto.lidoEm).filter(Boolean);
  if (instantes.length === 0) return TEXTO_SEM_LEITURA;

  const maisRecente = new Date(Math.max(...instantes.map((data) => data.getTime())));
  const { reservas, paradas, aguardandoUsuario } = modelo.totais;
  const partes = [
    `Última leitura às ${formatarHoraBrasilia(maisRecente)}`,
    `a cada ${descreverIntervalo(INTERVALO_LEITURA_MS)}`,
    paradas > 0
      ? `${contar(reservas, "reserva", "reservas")} (${contar(paradas, "parada", "paradas")})`
      : contar(reservas, "reserva", "reservas"),
  ];
  if (aguardandoUsuario > 0) {
    partes.push(contar(aguardandoUsuario, "frente aguardando você", "frentes aguardando você"));
  }
  return partes.join(SEPARADOR);
}

/**
 * Texto do último commit conhecido do quadro de uma fonte.
 * @param {object} projeto Projeto do modelo.
 * @returns {string} Linha de detalhe da fonte.
 */
function detalheDoCommit(projeto) {
  const { data, sha } = projeto.commit;
  if (data) {
    const curto = sha ? ` (${sha.slice(0, TAMANHO_SHA_CURTO)})` : "";
    return `Último commit do quadro: ${formatarDataHoraBrasilia(data)}${curto}`;
  }
  return projeto.contagens.tarefas.total > 0 ? TEXTO_COMMIT_INDISPONIVEL : TEXTO_SEM_COMMIT;
}

/**
 * Texto com as contagens de uma fonte: tarefas por status (só os que existem) e reservas.
 * @param {object} projeto Projeto do modelo.
 * @returns {string} Linha de números da fonte.
 */
function numerosDaFonte(projeto) {
  const { porStatus } = projeto.contagens.tarefas;
  const partes = ROTULOS_STATUS
    .filter(([chave]) => porStatus[chave] > 0)
    .map(([chave, singular, plural]) => contar(porStatus[chave], singular, plural));
  if (partes.length === 0) return TEXTO_SEM_TAREFAS;

  const { total, paradas } = projeto.contagens.reservas;
  if (total > 0) {
    const reservas = contar(total, "reserva", "reservas");
    partes.push(paradas > 0 ? `${reservas} (${contar(paradas, "parada", "paradas")})` : reservas);
  }
  return partes.join(SEPARADOR);
}

/**
 * Explica o erro de leitura em português.
 * @param {{tipo: string, status: number}} erro Erro do cliente do GitHub.
 * @returns {string} Motivo curto.
 */
function motivoDoErro(erro) {
  if (erro.tipo === "limite") return "limite de requisições do GitHub atingido";
  if (erro.tipo === "http") return `o GitHub respondeu ${erro.status}`;
  return "falha de rede";
}

/**
 * Monta os avisos de cada fonte: erro de leitura (vermelho) e reservas paradas (âmbar).
 * @param {object[]} projetos Projetos do modelo.
 * @param {Record<string, Date>} ultimaLeituraBoa Última leitura bem-sucedida por id de fonte.
 * @returns {Array<{texto: string, erro: boolean}>} Avisos na ordem das fontes.
 */
function avisosDasFontes(projetos, ultimaLeituraBoa) {
  const avisos = [];
  for (const projeto of projetos) {
    if (projeto.erro) {
      const boa = ultimaLeituraBoa[projeto.id];
      const hora = boa ? formatarHoraBrasilia(boa) : "";
      const desde = boa ? `sem atualização desde ${hora}` : "ainda sem leitura";
      const motivo = motivoDoErro(projeto.erro);
      avisos.push({ erro: true, texto: `${projeto.nome}: ${desde} (${motivo})` });
    }
    const { paradas } = projeto.contagens.reservas;
    if (paradas > 0) {
      const quantas = contar(paradas, "reserva parada", "reservas paradas");
      avisos.push({ erro: false, texto: `${projeto.nome}: ${quantas} há mais de 24 h` });
    }
  }
  return avisos;
}

/**
 * Descreve o painel inteiro como dados (sem DOM).
 * @param {{projetos: object[], totais: object}} modelo Modelo de `montarModelo`.
 * @param {{ultimaLeituraBoa?: Record<string, Date>, avisosExtras?: string[]}} [opcoes]
 *   `ultimaLeituraBoa`: última leitura bem-sucedida por id de fonte (a #2.9 guarda);
 *   `avisosExtras`: textos de aviso do chamador (ex.: limite da API quase no fim).
 * @returns {{leitura: string, fontes: object[], avisos: object[], legenda: object[]}} Painel.
 */
export function descreverPainel(modelo, opcoes = {}) {
  const { ultimaLeituraBoa = {}, avisosExtras = [] } = opcoes;
  const extras = avisosExtras.map((texto) => ({ erro: false, texto }));
  return {
    leitura: textoDaLeitura(modelo),
    fontes: modelo.projetos.map((projeto) => ({
      id: projeto.id,
      nome: projeto.nome,
      detalhe: detalheDoCommit(projeto),
      numeros: numerosDaFonte(projeto),
    })),
    avisos: [...avisosDasFontes(modelo.projetos, ultimaLeituraBoa), ...extras],
    legenda: LEGENDA,
  };
}

/**
 * Cria um elemento com classes e texto (sempre por `textContent`).
 * @param {Document} documento Documento onde criar.
 * @param {string} etiqueta Nome da tag (ex.: "li").
 * @param {string} classes Classes separadas por espaço (podem ser vazias).
 * @returns {HTMLElement} Elemento criado.
 */
function criarElemento(documento, etiqueta, classes) {
  const elemento = documento.createElement(etiqueta);
  if (classes) elemento.className = classes;
  return elemento;
}

/**
 * Cria um `<span>` de texto.
 * @param {Document} documento Documento onde criar.
 * @param {string} classes Classes do span.
 * @param {string} texto Conteúdo (como texto, nunca como HTML).
 * @returns {HTMLElement} Span criado.
 */
function criarTexto(documento, classes, texto) {
  const span = criarElemento(documento, "span", classes);
  span.textContent = texto;
  return span;
}

/**
 * Busca um elemento do painel pelo id.
 * @param {Document} documento Documento da página.
 * @param {string} id Id do elemento.
 * @returns {HTMLElement} Elemento encontrado.
 * @throws {Error} Quando o elemento não existe na página.
 */
function obterElemento(documento, id) {
  const elemento = documento.getElementById(id);
  if (!elemento) throw new Error(`O elemento #${id} não existe na página.`);
  return elemento;
}

/**
 * Desenha a descrição do painel no DOM, trocando o conteúdo dos 4 elementos.
 * @param {{leitura: string, fontes: object[], avisos: object[], legenda: object[]}} descricao
 *   Resultado de `descreverPainel`.
 * @param {Document} [documento] Documento da página (padrão: o global).
 * @returns {void}
 * @throws {Error} Quando falta algum dos elementos do painel.
 */
export function renderizarPainel(descricao, documento = globalThis.document) {
  obterElemento(documento, ID_LEITURA).textContent = descricao.leitura;

  const fontes = descricao.fontes.map((fonte) => {
    const item = criarElemento(documento, "li", "");
    item.append(
      criarTexto(documento, "fonte__nome", fonte.nome),
      criarTexto(documento, "fonte__detalhe", fonte.detalhe),
      criarTexto(documento, "fonte__detalhe fonte__numeros", fonte.numeros),
    );
    return item;
  });
  obterElemento(documento, ID_LISTA_FONTES).replaceChildren(...fontes);

  const avisos = descricao.avisos.map((aviso) => {
    const classes = aviso.erro ? "painel__aviso painel__aviso--erro" : "painel__aviso";
    const paragrafo = criarElemento(documento, "p", classes);
    paragrafo.textContent = aviso.texto;
    return paragrafo;
  });
  obterElemento(documento, ID_AVISOS).replaceChildren(...avisos);

  const legenda = descricao.legenda.map((entrada) => {
    const item = criarElemento(documento, "li", "legenda__item");
    const cor = criarTexto(documento, `legenda__cor legenda__cor--${entrada.modificador}`, "");
    cor.setAttribute("aria-hidden", "true");
    item.append(cor, criarTexto(documento, "", entrada.texto));
    return item;
  });
  obterElemento(documento, ID_LISTA_LEGENDA).replaceChildren(...legenda);
}

/**
 * Atalho: descreve e desenha o painel de uma vez.
 * @param {{projetos: object[], totais: object}} modelo Modelo de `montarModelo`.
 * @param {object} [opcoes] Opções de `descreverPainel`.
 * @param {Document} [documento] Documento da página (padrão: o global).
 * @returns {void}
 */
export function atualizarPainel(modelo, opcoes = {}, documento = globalThis.document) {
  renderizarPainel(descreverPainel(modelo, opcoes), documento);
}
