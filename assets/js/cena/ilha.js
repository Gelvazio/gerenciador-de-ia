/**
 * Ilha de um projeto (uma fonte): plataforma com o nome do projeto e as estações das frentes
 * dispostas em grade. A ilha cresce quando o projeto tem mais frentes do que cabem no lado mínimo.
 */

import * as THREE from "three";

import {
  ALTURA_ILHA,
  COR_ILHA,
  LADO_ILHA,
  MARGEM_ILHA,
  PASSO_ESTACAO,
} from "../config/cores.js";
import { sincronizar } from "./diferenca.js";
import { Estacao } from "./estacao.js";
import { criarRotulo, descartarRotulo, escreverTexto } from "./rotulos.js";

const DISTANCIA_NOME = 0.8;
const TEXTO_SEM_FRENTES = "nenhuma frente para mostrar";

/** Geometria única das ilhas: cubo de lado 1, esticado em x e z pelo tamanho de cada ilha. */
const GEOMETRIA_ILHA = new THREE.BoxGeometry(1, ALTURA_ILHA, 1);

/**
 * Quantas colunas a grade de estações usa (quase quadrada).
 * @param {number} quantidade Número de estações.
 * @returns {number} Colunas da grade (no mínimo 1).
 */
function colunasDaGrade(quantidade) {
  return Math.max(1, Math.ceil(Math.sqrt(quantidade)));
}

/**
 * Posição (x, z) do centro de uma estação na grade, com a grade centrada na ilha.
 * @param {number} indice Posição da estação na lista (0 = primeira).
 * @param {number} colunas Colunas da grade.
 * @param {number} linhas Linhas da grade.
 * @returns {{x: number, z: number}} Coordenadas relativas ao centro da ilha.
 */
function posicaoNaGrade(indice, colunas, linhas) {
  const coluna = indice % colunas;
  const linha = Math.floor(indice / colunas);
  return {
    x: (coluna - (colunas - 1) / 2) * PASSO_ESTACAO,
    z: (linha - (linhas - 1) / 2) * PASSO_ESTACAO,
  };
}

/** Ilha 3D de um projeto, reaproveitada entre leituras. */
export class Ilha {
  /** Cria a plataforma, o rótulo com o nome do projeto e o mapa de estações (vazio). */
  constructor() {
    this.grupo = new THREE.Group();
    this.material = new THREE.MeshStandardMaterial({ color: COR_ILHA });
    this.plataforma = new THREE.Mesh(GEOMETRIA_ILHA, this.material);
    this.plataforma.position.y = -ALTURA_ILHA / 2;
    this.nome = criarRotulo();
    this.nome.objeto.center.set(0.5, 0);
    this.grupo.add(this.plataforma, this.nome.objeto);
    this.estacoes = new Map();
    this.lado = LADO_ILHA;
  }

  /**
   * Aplica o projeto lido agora: nome, estações (por diferença), grade e tamanho da ilha.
   * @param {object} projeto Projeto do modelo (`nome`, `frentes`).
   * @returns {number} Lado da ilha depois da atualização, em unidades da cena.
   */
  atualizar(projeto) {
    const pares = sincronizar(this.estacoes, projeto.frentes, {
      chave: (frente) => frente.nome,
      criar: () => this.adicionarEstacao(),
      descartar: (estacao) => estacao.descartar(),
    });
    const colunas = colunasDaGrade(pares.length);
    const linhas = Math.max(1, Math.ceil(pares.length / colunas));
    pares.forEach(({ objeto, item }, indice) => {
      const { x, z } = posicaoNaGrade(indice, colunas, linhas);
      objeto.grupo.position.set(x, 0, z);
      objeto.atualizar(item);
    });

    this.lado = Math.max(LADO_ILHA, Math.max(colunas, linhas) * PASSO_ESTACAO + MARGEM_ILHA);
    this.plataforma.scale.set(this.lado, 1, this.lado);
    this.nome.objeto.position.set(0, 0, this.lado / 2 + DISTANCIA_NOME);
    escreverTexto(this.nome.titulo, projeto.nome);
    escreverTexto(this.nome.quem, pares.length ? "" : TEXTO_SEM_FRENTES);
    return this.lado;
  }

  /**
   * Cria uma estação nova e a põe sobre a ilha.
   * @returns {Estacao} Estação criada.
   */
  adicionarEstacao() {
    const estacao = new Estacao();
    this.grupo.add(estacao.grupo);
    return estacao;
  }

  /**
   * Anima as estações (pulsação das frentes 👀).
   * @param {number} segundos Tempo desde o início da página, em segundos.
   * @returns {void}
   */
  animar(segundos) {
    for (const estacao of this.estacoes.values()) estacao.animar(segundos);
  }

  /**
   * Atualiza o contador de tempo de todos os blocos da ilha.
   * @param {number} agora Instante atual em milissegundos.
   * @returns {void}
   */
  atualizarTempos(agora) {
    for (const estacao of this.estacoes.values()) estacao.atualizarTempos(agora);
  }

  /**
   * Descarta as estações, o material e o rótulo do nome.
   * @returns {void}
   */
  descartar() {
    for (const estacao of this.estacoes.values()) estacao.descartar();
    this.estacoes.clear();
    descartarRotulo(this.nome);
    this.grupo.removeFromParent();
    this.material.dispose();
  }
}
