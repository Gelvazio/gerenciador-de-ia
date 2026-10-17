/**
 * Leitor da coluna "Em uso por" dos quadros. Não usa DOM nem Three.js.
 *
 * Formatos lidos (CLAUDE.md §3):
 *  - `Claude Code (Opus 5.5) (nuvem · ccr-x) (desde 2026-10-16 21:48)` → IA, modelo e frente
 *  - `Qoder (local · main) (desde 2026-10-13 22:01)` → IA e frente, sem modelo
 *  - `nuvem · session_x (desde 2026-10-14 23:31)` (antigo) → só a frente
 *  - `—` (livre), `— (não reservável)` (tarefa-mãe) e `🔒 Trava especial…` (bloqueada)
 */

import { lerDataHoraBrasilia } from "../utilitarios/tempo.js";

/** Tipos possíveis de uma célula "Em uso por". */
export const TIPO_RESERVA = Object.freeze({
  LIVRE: "livre",
  NAO_RESERVAVEL: "nao-reservavel",
  TRAVA: "trava",
  RESERVA: "reserva",
});

const TRACO = "—";
const MARCA_TRAVA = "\u{1F512}";
const TEXTO_NAO_RESERVAVEL = "não reservável";
const SEPARADOR_FRENTE = " · ";
const ABRE_PARENTESES = "(";
const REGEX_DESDE_NO_FIM = /\(desde\s+[^)]*\)\s*$/;
const REGEX_PARENTESES = /\(([^()]*)\)/g;

/**
 * Monta o resultado de uma célula que não é uma reserva de verdade.
 * @param {string} tipo Um valor de TIPO_RESERVA.
 * @param {string} textoOriginal Texto da célula.
 * @returns {{tipo: string, ia: string, modelo: string, frente: string, desde: null,
 *   textoOriginal: string}} Reserva sem IA, modelo, frente nem data.
 */
function reservaSemDono(tipo, textoOriginal) {
  return { tipo, ia: "", modelo: "", frente: "", desde: null, textoOriginal };
}

/**
 * Separa IA, modelo e frente de uma reserva. Dos parênteses, o que tem " · " é a frente
 * (o último, se houver mais de um) e o outro é o modelo; o texto antes deles é a IA.
 * Sem parênteses, o texto todo é a frente.
 * @param {string} semData Texto da reserva sem o "(desde …)".
 * @returns {{ia: string, modelo: string, frente: string}} Partes da reserva.
 */
function separarDono(semData) {
  if (!semData.includes(ABRE_PARENTESES)) return { ia: "", modelo: "", frente: semData };

  const parenteses = [...semData.matchAll(REGEX_PARENTESES)].map((par) => par[1].trim());
  const indiceFrente = parenteses.findLastIndex((texto) => texto.includes(SEPARADOR_FRENTE));
  const modelo = parenteses.find((_texto, indice) => indice !== indiceFrente) ?? "";
  return {
    ia: semData.slice(0, semData.indexOf(ABRE_PARENTESES)).trim(),
    modelo,
    frente: indiceFrente === -1 ? "" : parenteses[indiceFrente],
  };
}

/**
 * Lê uma célula "Em uso por".
 * @param {string|undefined} texto Texto da célula (coluna ausente vira livre).
 * @returns {{tipo: string, ia: string, modelo: string, frente: string, desde: Date|null,
 *   textoOriginal: string}} Reserva lida; `desde` é null quando não há data com hora.
 */
export function lerReserva(texto) {
  const original = (texto ?? "").trim();
  if (original === "" || original === TRACO) return reservaSemDono(TIPO_RESERVA.LIVRE, original);
  if (original.startsWith(MARCA_TRAVA)) return reservaSemDono(TIPO_RESERVA.TRAVA, original);
  if (original.startsWith(TRACO) && original.includes(TEXTO_NAO_RESERVAVEL)) {
    return reservaSemDono(TIPO_RESERVA.NAO_RESERVAVEL, original);
  }

  const semData = original.replace(REGEX_DESDE_NO_FIM, "").trim();
  return {
    tipo: TIPO_RESERVA.RESERVA,
    ...separarDono(semData),
    desde: lerDataHoraBrasilia(original),
    textoOriginal: original,
  };
}
