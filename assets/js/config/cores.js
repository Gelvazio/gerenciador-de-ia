/**
 * Cores e medidas da cena e do painel. Nenhum valor fixo fica fora deste arquivo.
 * Os tokens de cor da página ficam em `assets/css/base.css` (`:root`).
 */

/** Cor de cada nível de tarefa, usada no bloco da subtarefa reservada. */
export const CORES_NIVEL = Object.freeze({
  LEVE: 0x2e9e5b,
  MEDIO: 0x2f6fd6,
  PESADO: 0x7d4bc9,
  "sem nível": 0xb8bec6,
});

/** Estação de frente 👀 Aguardando o usuário (pulsa devagar). */
export const COR_AGUARDANDO_USUARIO = 0xe0a100;

/** Estação de frente ⏹️ Encerrada (translúcida). */
export const COR_ENCERRADA = 0x6b7280;

/** Opacidade da estação encerrada. */
export const OPACIDADE_ENCERRADA = 0.35;

/** Contorno de reserva parada (mais de 24 h sem commit). */
export const COR_RESERVA_PARADA = 0xd93025;

/** Cor da ilha (plataforma) de cada projeto. */
export const COR_ILHA = 0x1f2937;

/** Cor da base da estação quando a frente está 🔄 Em execução. */
export const COR_ESTACAO_ATIVA = 0x0ea5e9;

/** Lado da ilha, em unidades da cena. */
export const LADO_ILHA = 8;

/** Espaço entre duas ilhas, em unidades da cena. */
export const ESPACO_ENTRE_ILHAS = 4;

/** Altura do bloco de tarefa, em unidades da cena. */
export const ALTURA_BLOCO = 1.2;

/** Velocidade da pulsação da estação 👀, em ciclos por segundo. */
export const FREQUENCIA_PULSACAO_HZ = 0.5;

/** Fundo da cena (igual ao token `--cor-fundo` de base.css). */
export const COR_FUNDO_CENA = 0x0b1220;

/** Luz ambiente (céu e chão) e luz direcional da cena. */
export const COR_LUZ_CEU = 0xdbeafe;
export const COR_LUZ_CHAO = 0x1e293b;
export const COR_LUZ_DIRECIONAL = 0xffffff;
export const INTENSIDADE_LUZ_AMBIENTE = 1.4;
export const INTENSIDADE_LUZ_DIRECIONAL = 1.6;

/** Espessura da ilha, em unidades da cena. */
export const ALTURA_ILHA = 0.6;

/** Margem entre a borda da ilha e as estações, em unidades da cena. */
export const MARGEM_ILHA = 1.2;

/** Lado e altura da base da estação, em unidades da cena. */
export const LADO_ESTACAO = 2;
export const ALTURA_ESTACAO = 0.3;

/** Distância entre os centros de duas estações vizinhas, em unidades da cena. */
export const PASSO_ESTACAO = 3.4;

/** Lado do bloco de tarefa e folga vertical entre blocos empilhados, em unidades da cena. */
export const LADO_BLOCO = 1.2;
export const FOLGA_BLOCO = 0.25;

/** Contorno da reserva parada: quanto o casco vermelho é maior que o bloco. */
export const ESCALA_CONTORNO_PARADA = 1.12;

/** Brilho da estação 👀 que pulsa: mínimo e máximo da intensidade emissiva. */
export const BRILHO_PULSACAO_MIN = 0.1;
export const BRILHO_PULSACAO_MAX = 0.9;

/** Câmera: campo de visão (graus), planos de corte e distância relativa ao tamanho da cena. */
export const CAMPO_VISAO_GRAUS = 45;
export const CORTE_PERTO = 0.1;
export const CORTE_LONGE = 1000;
export const FATOR_DISTANCIA_CAMERA = 1.1;
