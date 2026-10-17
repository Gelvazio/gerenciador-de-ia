/**
 * Conteúdo da cena: uma ilha por projeto, lado a lado, atualizadas por diferença a cada leitura.
 * Recebe a `CenaBase` pronta (injetada), então a regra de desenho não depende do renderer.
 *
 * Uso (pela #2.9, `principal.js`):
 *   const cena = criarCenaTarefas(document.getElementById("cena"));
 *   cena.atualizar(modelo);           // a cada leitura (modelo de `montarModelo`)
 *   cena.atualizarTempos(Date.now()); // a cada segundo, sem nova leitura
 */

import * as THREE from "three";

import { ESPACO_ENTRE_ILHAS } from "../config/cores.js";
import { CenaBase } from "./cena-base.js";
import { sincronizar } from "./diferenca.js";
import { Ilha } from "./ilha.js";

const ALVO_NOVA_ABA = "_blank";
const RECURSOS_NOVA_ABA = "noopener,noreferrer";

/**
 * Coloca as ilhas lado a lado no eixo x, com o conjunto centrado na origem.
 * @param {Array<{ilha: Ilha, lado: number}>} medidas Ilhas na ordem das fontes e o lado de cada.
 * @returns {number} Largura total do conjunto, em unidades da cena.
 */
function enfileirarIlhas(medidas) {
  const largura = medidas.reduce((soma, { lado }) => soma + lado, 0) +
    ESPACO_ENTRE_ILHAS * Math.max(0, medidas.length - 1);
  let x = -largura / 2;
  for (const { ilha, lado } of medidas) {
    ilha.grupo.position.set(x + lado / 2, 0, 0);
    x += lado + ESPACO_ENTRE_ILHAS;
  }
  return largura;
}

/**
 * Acha a etapa do objeto clicado: o mais próximo que tem `urlEtapa` (um bloco de tarefa).
 * @param {THREE.Intersection[]} atingidos Objetos sob o clique, do mais perto ao mais longe.
 * @returns {string} Endereço da etapa, ou vazio.
 */
function urlDoClique(atingidos) {
  const comLink = atingidos.find(({ object }) => object.userData.urlEtapa);
  return comLink ? comLink.object.userData.urlEtapa : "";
}

/** Ilhas, estações e blocos de todos os projetos. */
export class CenaTarefas {
  /**
   * Liga o conteúdo à base: animação a cada quadro e clique no bloco.
   * @param {{cena: THREE.Scene, enquadrar: Function, aoClicar: Function}} base Base da cena.
   */
  constructor(base) {
    this.base = base;
    this.ilhas = new Map();
    this.quantidadeEnquadrada = 0;
    base.aoClicar((atingidos) => {
      const url = urlDoClique(atingidos);
      if (url) window.open(url, ALVO_NOVA_ABA, RECURSOS_NOVA_ABA);
    });
  }

  /**
   * Aplica o modelo lido agora: cria, move ou remove só o que mudou.
   * @param {{projetos: object[]}} modelo Modelo de `montarModelo`.
   * @returns {void}
   */
  atualizar(modelo) {
    const pares = sincronizar(this.ilhas, modelo.projetos, {
      chave: (projeto) => projeto.id,
      criar: () => this.adicionarIlha(),
      descartar: (ilha) => ilha.descartar(),
    });
    const medidas = pares.map(({ objeto, item }) => ({
      ilha: objeto,
      lado: objeto.atualizar(item),
    }));
    const largura = enfileirarIlhas(medidas);
    this.enquadrarSePreciso(medidas, largura);
    this.atualizarTempos(Date.now());
  }

  /**
   * Enquadra a câmera na 1ª leitura e quando o número de ilhas muda (no resto, o usuário manda
   * na câmera).
   * @param {Array<{lado: number}>} medidas Lado de cada ilha.
   * @param {number} largura Largura total do conjunto.
   * @returns {void}
   */
  enquadrarSePreciso(medidas, largura) {
    if (!medidas.length || medidas.length === this.quantidadeEnquadrada) return;
    const profundidade = Math.max(...medidas.map(({ lado }) => lado));
    this.base.enquadrar(new THREE.Vector3(0, 0, 0), Math.max(largura, profundidade));
    this.quantidadeEnquadrada = medidas.length;
  }

  /**
   * Cria uma ilha nova e a põe na cena.
   * @returns {Ilha} Ilha criada.
   */
  adicionarIlha() {
    const ilha = new Ilha();
    this.base.cena.add(ilha.grupo);
    return ilha;
  }

  /**
   * Atualiza o contador de tempo de todos os blocos (sem nova leitura).
   * @param {number} agora Instante atual em milissegundos.
   * @returns {void}
   */
  atualizarTempos(agora) {
    for (const ilha of this.ilhas.values()) ilha.atualizarTempos(agora);
  }

  /**
   * Anima o conteúdo a cada quadro (pulsação das frentes 👀).
   * @param {number} segundos Tempo desde o início da página, em segundos.
   * @returns {void}
   */
  animar(segundos) {
    for (const ilha of this.ilhas.values()) ilha.animar(segundos);
  }
}

/**
 * Cria a cena completa dentro do contêiner e já começa a animação.
 * @param {HTMLElement} conteiner Elemento `#cena` da página.
 * @returns {CenaTarefas} Cena pronta para receber o modelo.
 */
export function criarCenaTarefas(conteiner) {
  const base = new CenaBase(conteiner);
  const cena = new CenaTarefas(base);
  base.iniciar((segundos) => cena.animar(segundos));
  return cena;
}
