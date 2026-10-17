/**
 * Bloco de uma subtarefa reservada (🔄), em cima da estação da frente: cor do nível, contorno
 * vermelho quando a reserva está parada (> 24 h) e rótulo com id, título curto, IA (modelo) e
 * contador de tempo. Clique no bloco ou no rótulo abre a etapa no GitHub.
 */

import * as THREE from "three";

import {
  ALTURA_BLOCO,
  ALTURA_ESTACAO,
  COR_RESERVA_PARADA,
  CORES_NIVEL,
  ESCALA_CONTORNO_PARADA,
  FOLGA_BLOCO,
  LADO_BLOCO,
} from "../config/cores.js";
import { haQuantoTempo } from "../utilitarios/tempo.js";
import {
  CLASSE_ROTULO,
  criarRotulo,
  definirLink,
  descartarRotulo,
  escreverTexto,
  marcarRotulo,
} from "./rotulos.js";

const NIVEL_PADRAO = "sem nível";
const TAMANHO_TITULO_CURTO = 48;
const RETICENCIAS = "…";
const TEXTO_SEM_DATA = "sem data de início";
const DISTANCIA_ROTULO = 0.6;
const REGEX_ID_COM_UUID = /^(#[\d.]+)-[0-9a-f]{8}-[0-9a-f-]+$/i;

/** Geometria única de todos os blocos e do contorno (nunca é descartada). */
const GEOMETRIA_BLOCO = new THREE.BoxGeometry(LADO_BLOCO, ALTURA_BLOCO, LADO_BLOCO);

/** Material único do contorno: casco vermelho visto por dentro, um pouco maior que o bloco. */
const MATERIAL_CONTORNO = new THREE.MeshBasicMaterial({
  color: COR_RESERVA_PARADA,
  side: THREE.BackSide,
});

/**
 * Corta o título para caber no rótulo.
 * @param {string} titulo Título limpo da subtarefa.
 * @returns {string} Título com no máximo `TAMANHO_TITULO_CURTO` caracteres.
 */
function tituloCurto(titulo) {
  if (titulo.length <= TAMANHO_TITULO_CURTO) return titulo;
  return titulo.slice(0, TAMANHO_TITULO_CURTO - 1).trimEnd() + RETICENCIAS;
}

/**
 * Encurta o id que leva um UUID (`#171-cb630440-…` → `#171`) para caber no rótulo.
 * @param {string} id Id da subtarefa no quadro.
 * @returns {string} Id curto (os outros formatos ficam iguais).
 */
function idCurto(id) {
  const partes = REGEX_ID_COM_UUID.exec(id);
  return partes ? partes[1] : id;
}

/**
 * Texto "quem" da reserva: `IA (modelo)`, só a IA, ou a frente quando não há IA.
 * @param {{ia: string, modelo: string, frente: string}} reserva Reserva do modelo.
 * @returns {string} Texto do rótulo.
 */
export function descreverQuem(reserva) {
  if (!reserva.ia) return reserva.frente;
  return reserva.modelo ? `${reserva.ia} (${reserva.modelo})` : reserva.ia;
}

/**
 * Altura do centro do bloco na pilha da estação (o 1º fica logo acima da base).
 * @param {number} indice Posição do bloco na pilha (0 = de baixo).
 * @returns {number} Coordenada y do centro do bloco.
 */
function alturaNaPilha(indice) {
  return ALTURA_ESTACAO + ALTURA_BLOCO / 2 + indice * (ALTURA_BLOCO + FOLGA_BLOCO);
}

/** Bloco 3D de uma subtarefa reservada, reaproveitado entre leituras. */
export class BlocoTarefa {
  /** Cria a malha, o contorno (escondido) e o rótulo clicável. */
  constructor() {
    this.grupo = new THREE.Group();
    this.material = new THREE.MeshStandardMaterial({ color: CORES_NIVEL[NIVEL_PADRAO] });
    this.malha = new THREE.Mesh(GEOMETRIA_BLOCO, this.material);
    this.contorno = new THREE.Mesh(GEOMETRIA_BLOCO, MATERIAL_CONTORNO);
    this.contorno.scale.setScalar(ESCALA_CONTORNO_PARADA);
    this.contorno.visible = false;
    this.rotulo = criarRotulo({ clicavel: true, comTempo: true });
    this.rotulo.objeto.position.set(LADO_BLOCO / 2 + DISTANCIA_ROTULO, 0, 0);
    this.rotulo.objeto.center.set(0, 0.5);
    this.grupo.add(this.malha, this.contorno, this.rotulo.objeto);
    this.reserva = null;
  }

  /**
   * Aplica a reserva lida agora: cor, contorno, posição na pilha, rótulo e link.
   * @param {object} reserva Reserva do modelo (`id`, `titulo`, `nivel`, `parada`, `urlEtapa`…).
   * @param {number} indice Posição do bloco na pilha da estação.
   * @returns {void}
   */
  atualizar(reserva, indice) {
    this.reserva = reserva;
    this.material.color.setHex(CORES_NIVEL[reserva.nivel] ?? CORES_NIVEL[NIVEL_PADRAO]);
    this.contorno.visible = reserva.parada;
    this.grupo.position.y = alturaNaPilha(indice);
    this.malha.userData.urlEtapa = reserva.urlEtapa;

    const modificadores = reserva.urlEtapa ? [CLASSE_ROTULO.CLICAVEL] : [];
    if (reserva.parada) modificadores.push(CLASSE_ROTULO.PARADA);
    marcarRotulo(this.rotulo, modificadores);
    definirLink(this.rotulo, reserva.urlEtapa);
    escreverTexto(this.rotulo.titulo, `${idCurto(reserva.id)} · ${tituloCurto(reserva.titulo)}`);
    escreverTexto(this.rotulo.quem, descreverQuem(reserva));
  }

  /**
   * Atualiza só o contador "há quanto tempo" (chamado a cada segundo, sem nova leitura).
   * @param {number} agora Instante atual em milissegundos.
   * @returns {void}
   */
  atualizarTempo(agora) {
    const desde = this.reserva?.desde;
    escreverTexto(this.rotulo.tempo, desde ? haQuantoTempo(desde, agora) : TEXTO_SEM_DATA);
  }

  /**
   * Libera o material e tira o rótulo do DOM (a geometria é compartilhada e fica).
   * @returns {void}
   */
  descartar() {
    descartarRotulo(this.rotulo);
    this.grupo.removeFromParent();
    this.material.dispose();
  }
}
