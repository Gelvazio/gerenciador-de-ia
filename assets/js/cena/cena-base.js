/**
 * Base da cena 3D: renderer WebGL, camada de rótulos (CSS2DRenderer), câmera, luzes, controles
 * de órbita, redimensionamento, laço de animação (`requestAnimationFrame`) e clique em objetos.
 * Não sabe nada de projetos ou tarefas: quem desenha o conteúdo é a `CenaTarefas`.
 */

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

import {
  CAMPO_VISAO_GRAUS,
  COR_FUNDO_CENA,
  COR_LUZ_CEU,
  COR_LUZ_CHAO,
  COR_LUZ_DIRECIONAL,
  CORTE_LONGE,
  CORTE_PERTO,
  FATOR_DISTANCIA_CAMERA,
  INTENSIDADE_LUZ_AMBIENTE,
  INTENSIDADE_LUZ_DIRECIONAL,
} from "../config/cores.js";

const CLASSE_CAMADA_ROTULOS = "cena__rotulos";
const PROPORCAO_PIXEL_MAX = 2;
const POSICAO_LUZ = Object.freeze([12, 24, 16]);
const DIRECAO_CAMERA = new THREE.Vector3(0, 0.85, 1).normalize();
const ANGULO_POLAR_MAX = Math.PI * 0.47;
const LIMIAR_CLIQUE_PX = 6;
const MS_POR_SEGUNDO = 1000;

/**
 * Cria o renderer WebGL e põe o canvas no contêiner.
 * @param {HTMLElement} conteiner Elemento `#cena`.
 * @returns {THREE.WebGLRenderer} Renderer pronto.
 */
function criarRendererWebgl(conteiner) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, PROPORCAO_PIXEL_MAX));
  conteiner.append(renderer.domElement);
  return renderer;
}

/**
 * Cria a camada dos rótulos HTML por cima do canvas (classe `cena__rotulos` em base.css).
 * @param {HTMLElement} conteiner Elemento `#cena`.
 * @returns {CSS2DRenderer} Renderer dos rótulos.
 */
function criarRendererRotulos(conteiner) {
  const camada = document.createElement("div");
  camada.className = CLASSE_CAMADA_ROTULOS;
  conteiner.append(camada);
  return new CSS2DRenderer({ element: camada });
}

/**
 * Põe na cena a luz ambiente (céu e chão) e uma luz direcional vinda do alto.
 * @param {THREE.Scene} cena Cena 3D.
 * @returns {void}
 */
function adicionarLuzes(cena) {
  const ambiente = new THREE.HemisphereLight(COR_LUZ_CEU, COR_LUZ_CHAO, INTENSIDADE_LUZ_AMBIENTE);
  const direcional = new THREE.DirectionalLight(COR_LUZ_DIRECIONAL, INTENSIDADE_LUZ_DIRECIONAL);
  direcional.position.set(...POSICAO_LUZ);
  cena.add(ambiente, direcional);
}

/**
 * Cria os controles de órbita (girar, aproximar, arrastar) sem deixar a câmera passar do chão.
 * @param {THREE.Camera} camera Câmera da cena.
 * @param {HTMLElement} alvo Elemento que recebe o mouse e o toque (o canvas).
 * @returns {OrbitControls} Controles prontos.
 */
function criarControles(camera, alvo) {
  const controles = new OrbitControls(camera, alvo);
  controles.enableDamping = true;
  controles.maxPolarAngle = ANGULO_POLAR_MAX;
  return controles;
}

/** Renderer, câmera, luzes e controles da cena; laço de animação e clique. */
export class CenaBase {
  /**
   * Monta a cena dentro do contêiner e passa a acompanhar o tamanho dele.
   * @param {HTMLElement} conteiner Elemento `#cena` da página.
   */
  constructor(conteiner) {
    this.conteiner = conteiner;
    this.cena = new THREE.Scene();
    this.cena.background = new THREE.Color(COR_FUNDO_CENA);
    this.camera = new THREE.PerspectiveCamera(CAMPO_VISAO_GRAUS, 1, CORTE_PERTO, CORTE_LONGE);
    this.renderer = criarRendererWebgl(conteiner);
    this.rotulos = criarRendererRotulos(conteiner);
    this.controles = criarControles(this.camera, this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    adicionarLuzes(this.cena);
    this.redimensionar();
    new ResizeObserver(() => this.redimensionar()).observe(conteiner);
  }

  /**
   * Ajusta câmera e renderers ao tamanho atual do contêiner.
   * @returns {void}
   */
  redimensionar() {
    const largura = this.conteiner.clientWidth;
    const altura = this.conteiner.clientHeight;
    if (!largura || !altura) return;
    this.camera.aspect = largura / altura;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(largura, altura);
    this.rotulos.setSize(largura, altura);
  }

  /**
   * Aponta a câmera para o centro do conteúdo, de longe o bastante para caber tudo.
   * @param {THREE.Vector3} centro Centro do conteúdo.
   * @param {number} tamanho Maior medida do conteúdo, em unidades da cena.
   * @returns {void}
   */
  enquadrar(centro, tamanho) {
    const meioCampo = THREE.MathUtils.degToRad(CAMPO_VISAO_GRAUS) / 2;
    const distancia = (tamanho * FATOR_DISTANCIA_CAMERA) / (2 * Math.tan(meioCampo));
    this.controles.target.copy(centro);
    this.camera.position.copy(centro).addScaledVector(DIRECAO_CAMERA, distancia);
    this.controles.update();
  }

  /**
   * Começa o laço de animação: a cada quadro chama `aCadaQuadro(segundos)` e desenha.
   * @param {function(number): void} aCadaQuadro Animação do conteúdo (segundos desde o início).
   * @returns {void}
   */
  iniciar(aCadaQuadro) {
    const passo = (instanteMs) => {
      aCadaQuadro(instanteMs / MS_POR_SEGUNDO);
      this.controles.update();
      this.renderer.render(this.cena, this.camera);
      this.rotulos.render(this.cena, this.camera);
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  /**
   * Avisa quando o usuário clica (sem arrastar) no canvas, com os objetos atingidos.
   * @param {function(THREE.Intersection[]): void} aoClicar Recebe os objetos, do mais perto ao
   *   mais longe.
   * @returns {void}
   */
  aoClicar(aoClicar) {
    const canvas = this.renderer.domElement;
    let inicio = null;
    canvas.addEventListener("pointerdown", (evento) => {
      inicio = { x: evento.clientX, y: evento.clientY };
    });
    canvas.addEventListener("pointerup", (evento) => {
      if (!inicio) return;
      const arrastou = Math.hypot(evento.clientX - inicio.x, evento.clientY - inicio.y);
      inicio = null;
      if (arrastou <= LIMIAR_CLIQUE_PX) aoClicar(this.objetosNoPonto(evento));
    });
  }

  /**
   * Lista os objetos da cena sob o ponto do evento.
   * @param {PointerEvent} evento Evento do ponteiro sobre o canvas.
   * @returns {THREE.Intersection[]} Objetos atingidos, do mais perto ao mais longe.
   */
  objetosNoPonto(evento) {
    const area = this.renderer.domElement.getBoundingClientRect();
    const ponto = new THREE.Vector2(
      ((evento.clientX - area.left) / area.width) * 2 - 1,
      -((evento.clientY - area.top) / area.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(ponto, this.camera);
    return this.raycaster.intersectObjects(this.cena.children, true);
  }
}
