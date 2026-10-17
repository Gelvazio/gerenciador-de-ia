/**
 * Rótulos em HTML presos a objetos da cena (CSS2DRenderer): legíveis e com acento.
 * Só usam as classes de `assets/css/painel.css` (`rotulo`, `rotulo__*` e modificadores);
 * nenhum estilo inline. O texto só é reescrito quando muda.
 */

import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

/** Classe base e modificadores dos rótulos (painel.css). */
export const CLASSE_ROTULO = Object.freeze({
  BASE: "rotulo",
  CLICAVEL: "rotulo--clicavel",
  AGUARDANDO: "rotulo--aguardando",
  ENCERRADA: "rotulo--encerrada",
  PARADA: "rotulo--parada",
});

const ETIQUETA_LINK = "a";
const ETIQUETA_CAIXA = "div";
const ETIQUETA_LINHA = "span";
const ALVO_NOVA_ABA = "_blank";
const REL_SEGURO = "noopener noreferrer";

/**
 * Cria uma linha do rótulo (`<span class="rotulo__<parte>">`).
 * @param {HTMLElement} raiz Elemento do rótulo.
 * @param {string} parte Parte do rótulo: `titulo`, `quem` ou `tempo`.
 * @returns {HTMLElement} A linha criada.
 */
function criarLinha(raiz, parte) {
  const linha = document.createElement(ETIQUETA_LINHA);
  linha.className = `${CLASSE_ROTULO.BASE}__${parte}`;
  raiz.append(linha);
  return linha;
}

/**
 * Cria um rótulo com título, "quem" e tempo. Rótulo clicável é um link que abre em nova aba.
 * @param {{clicavel?: boolean, comTempo?: boolean}} [opcoes] Tipo do rótulo.
 * @returns {{objeto: CSS2DObject, raiz: HTMLElement, titulo: HTMLElement,
 *   quem: HTMLElement, tempo: HTMLElement|null}} Rótulo pronto para pôr na cena.
 */
export function criarRotulo(opcoes = {}) {
  const raiz = document.createElement(opcoes.clicavel ? ETIQUETA_LINK : ETIQUETA_CAIXA);
  raiz.className = CLASSE_ROTULO.BASE;
  if (opcoes.clicavel) {
    raiz.target = ALVO_NOVA_ABA;
    raiz.rel = REL_SEGURO;
  }
  const titulo = criarLinha(raiz, "titulo");
  const quem = criarLinha(raiz, "quem");
  const tempo = opcoes.comTempo ? criarLinha(raiz, "tempo") : null;
  return { objeto: new CSS2DObject(raiz), raiz, titulo, quem, tempo };
}

/**
 * Troca o texto de um elemento só quando ele mudou (evita mexer no DOM à toa).
 * @param {HTMLElement|null} elemento Linha do rótulo.
 * @param {string} texto Texto novo.
 * @returns {void}
 */
export function escreverTexto(elemento, texto) {
  if (elemento && elemento.textContent !== texto) elemento.textContent = texto;
}

/**
 * Aplica as classes do rótulo: a base, mais os modificadores ligados.
 * @param {{raiz: HTMLElement}} rotulo Rótulo criado por `criarRotulo`.
 * @param {string[]} modificadores Classes de `CLASSE_ROTULO` que valem agora.
 * @returns {void}
 */
export function marcarRotulo(rotulo, modificadores) {
  const classes = [CLASSE_ROTULO.BASE, ...modificadores].join(" ");
  if (rotulo.raiz.className !== classes) rotulo.raiz.className = classes;
}

/**
 * Define o endereço de um rótulo clicável; sem endereço, o rótulo deixa de ser link.
 * @param {{raiz: HTMLElement}} rotulo Rótulo criado com `clicavel: true`.
 * @param {string} url Endereço da etapa no GitHub (ou vazio).
 * @returns {void}
 */
export function definirLink(rotulo, url) {
  if (url) rotulo.raiz.href = url;
  else rotulo.raiz.removeAttribute("href");
}

/**
 * Tira o rótulo da cena; o CSS2DObject remove o próprio elemento do DOM ao sair.
 * @param {{objeto: CSS2DObject}} rotulo Rótulo a descartar.
 * @returns {void}
 */
export function descartarRotulo(rotulo) {
  rotulo.objeto.removeFromParent();
}
