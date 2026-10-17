/**
 * Estação de uma frente, sobre a ilha do projeto: base com a cor da situação (🔄 ativa,
 * 👀 âmbar pulsando, ⏹️ cinza translúcida), placa com o nome da frente e a IA (modelo), e a
 * pilha de blocos das subtarefas reservadas.
 */

import * as THREE from "three";

import {
  ALTURA_ESTACAO,
  BRILHO_PULSACAO_MAX,
  BRILHO_PULSACAO_MIN,
  COR_AGUARDANDO_USUARIO,
  COR_ENCERRADA,
  COR_ESTACAO_ATIVA,
  FREQUENCIA_PULSACAO_HZ,
  LADO_ESTACAO,
  OPACIDADE_ENCERRADA,
} from "../config/cores.js";
import { BlocoTarefa, descreverQuem } from "./bloco-tarefa.js";
import { sincronizar } from "./diferenca.js";
import {
  CLASSE_ROTULO,
  criarRotulo,
  descartarRotulo,
  escreverTexto,
  marcarRotulo,
} from "./rotulos.js";

const SITUACAO_AGUARDANDO = "aguardando-usuario";
const SITUACAO_ENCERRADA = "encerrada";
const COR_SEM_BRILHO = 0x000000;
const DISTANCIA_PLACA = 0.5;
const VOLTA_COMPLETA = 2 * Math.PI;

/** Aparência da base por situação da frente (ativa e derivada usam a padrão). */
const APARENCIA = Object.freeze({
  ativa: { cor: COR_ESTACAO_ATIVA, brilho: COR_SEM_BRILHO, opacidade: 1, classe: null },
  [SITUACAO_AGUARDANDO]: {
    cor: COR_AGUARDANDO_USUARIO,
    brilho: COR_AGUARDANDO_USUARIO,
    opacidade: 1,
    classe: CLASSE_ROTULO.AGUARDANDO,
  },
  [SITUACAO_ENCERRADA]: {
    cor: COR_ENCERRADA,
    brilho: COR_SEM_BRILHO,
    opacidade: OPACIDADE_ENCERRADA,
    classe: CLASSE_ROTULO.ENCERRADA,
  },
});

/** Geometria única de todas as estações (nunca é descartada). */
const GEOMETRIA_ESTACAO = new THREE.BoxGeometry(LADO_ESTACAO, ALTURA_ESTACAO, LADO_ESTACAO);

/**
 * Texto "quem" da placa: a IA (modelo) da 1ª reserva, se o nome da frente ainda não a mostra.
 * @param {{nome: string, reservas: object[]}} frente Frente do modelo.
 * @returns {string} Texto da segunda linha da placa (pode ser vazio).
 */
function quemDaFrente(frente) {
  const primeira = frente.reservas[0];
  if (!primeira) return "";
  const quem = descreverQuem(primeira);
  return frente.nome.includes(quem) ? "" : quem;
}

/** Estação 3D de uma frente, reaproveitada entre leituras. */
export class Estacao {
  /** Cria a base, a placa e o mapa de blocos (vazio). */
  constructor() {
    this.grupo = new THREE.Group();
    this.material = new THREE.MeshStandardMaterial({ color: COR_ESTACAO_ATIVA });
    this.base = new THREE.Mesh(GEOMETRIA_ESTACAO, this.material);
    this.base.position.y = ALTURA_ESTACAO / 2;
    this.placa = criarRotulo();
    this.placa.objeto.position.set(0, 0, LADO_ESTACAO / 2 + DISTANCIA_PLACA);
    this.placa.objeto.center.set(0.5, 0);
    this.grupo.add(this.base, this.placa.objeto);
    this.blocos = new Map();
    this.pulsando = false;
  }

  /**
   * Aplica a frente lida agora: aparência da situação, placa e blocos (por diferença).
   * @param {object} frente Frente do modelo (`nome`, `situacao`, `reservas`).
   * @returns {void}
   */
  atualizar(frente) {
    this.aplicarSituacao(frente.situacao);
    escreverTexto(this.placa.titulo, frente.nome);
    escreverTexto(this.placa.quem, quemDaFrente(frente));

    const pares = sincronizar(this.blocos, frente.reservas, {
      chave: (reserva) => reserva.id,
      criar: () => this.adicionarBloco(),
      descartar: (bloco) => bloco.descartar(),
    });
    pares.forEach(({ objeto, item }, indice) => objeto.atualizar(item, indice));
  }

  /**
   * Cria um bloco novo e o põe sobre a estação.
   * @returns {BlocoTarefa} Bloco criado.
   */
  adicionarBloco() {
    const bloco = new BlocoTarefa();
    this.grupo.add(bloco.grupo);
    return bloco;
  }

  /**
   * Muda cor, brilho, transparência e classe da placa conforme a situação da frente.
   * @param {string} situacao `ativa`, `aguardando-usuario` ou `encerrada`.
   * @returns {void}
   */
  aplicarSituacao(situacao) {
    const aparencia = APARENCIA[situacao] ?? APARENCIA.ativa;
    const transparente = aparencia.opacidade < 1;
    if (this.material.transparent !== transparente) this.material.needsUpdate = true;
    this.material.color.setHex(aparencia.cor);
    this.material.emissive.setHex(aparencia.brilho);
    this.material.emissiveIntensity = BRILHO_PULSACAO_MIN;
    this.material.transparent = transparente;
    this.material.opacity = aparencia.opacidade;
    this.pulsando = situacao === SITUACAO_AGUARDANDO;
    marcarRotulo(this.placa, aparencia.classe ? [aparencia.classe] : []);
  }

  /**
   * Anima a pulsação da frente 👀 (chamado a cada quadro).
   * @param {number} segundos Tempo desde o início da página, em segundos.
   * @returns {void}
   */
  animar(segundos) {
    if (!this.pulsando) return;
    const onda = 0.5 + 0.5 * Math.sin(VOLTA_COMPLETA * FREQUENCIA_PULSACAO_HZ * segundos);
    this.material.emissiveIntensity =
      BRILHO_PULSACAO_MIN + (BRILHO_PULSACAO_MAX - BRILHO_PULSACAO_MIN) * onda;
  }

  /**
   * Atualiza o contador de tempo de todos os blocos da estação.
   * @param {number} agora Instante atual em milissegundos.
   * @returns {void}
   */
  atualizarTempos(agora) {
    for (const bloco of this.blocos.values()) bloco.atualizarTempo(agora);
  }

  /**
   * Descarta os blocos, o material e a placa.
   * @returns {void}
   */
  descartar() {
    for (const bloco of this.blocos.values()) bloco.descartar();
    this.blocos.clear();
    descartarRotulo(this.placa);
    this.grupo.removeFromParent();
    this.material.dispose();
  }
}
