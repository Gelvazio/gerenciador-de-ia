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
