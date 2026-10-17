/**
 * Datas e tempos dos quadros. Todas as datas dos quadros estão no horário de Brasília
 * (UTC−3, sem horário de verão), por isso o fuso é fixo e nunca o do navegador.
 * Não usa DOM nem Three.js.
 */

const FUSO_BRASILIA = "-03:00";
const DESLOCAMENTO_BRASILIA_MS = -3 * 60 * 60 * 1000;
const MS_POR_MINUTO = 60 * 1000;
const MINUTOS_POR_HORA = 60;
const HORAS_POR_DIA = 24;
const REGEX_DATA_HORA = /(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/;
const TEXTO_MENOS_DE_UM_MINUTO = "menos de 1 min";

/**
 * Completa um número com zero à esquerda até ter dois dígitos.
 * @param {number} numero Número a formatar.
 * @returns {string} Número com dois dígitos (ex.: 7 vira "07").
 */
function doisDigitos(numero) {
  return String(numero).padStart(2, "0");
}

/**
 * Lê o primeiro `AAAA-MM-DD HH:MM` de um texto como horário de Brasília.
 * @param {string} texto Texto que contém a data (ex.: "(desde 2026-10-16 21:48)").
 * @returns {Date|null} Instante correspondente, ou null se não houver data com hora válida.
 */
export function lerDataHoraBrasilia(texto) {
  const partes = REGEX_DATA_HORA.exec(texto ?? "");
  if (!partes) return null;

  const [, ano, mes, dia, hora, minuto] = partes;
  const data = new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:00${FUSO_BRASILIA}`);
  return Number.isNaN(data.getTime()) ? null : data;
}

/**
 * Formata uma duração em português curto: "menos de 1 min", "45 min", "2 h 14 min", "3 d 2 h".
 * @param {number} milissegundos Duração (negativa vira zero).
 * @returns {string} Texto da duração.
 */
export function formatarDuracao(milissegundos) {
  const totalMinutos = Math.floor(Math.max(0, milissegundos) / MS_POR_MINUTO);
  if (totalMinutos < 1) return TEXTO_MENOS_DE_UM_MINUTO;

  const totalHoras = Math.floor(totalMinutos / MINUTOS_POR_HORA);
  const minutos = totalMinutos % MINUTOS_POR_HORA;
  if (totalHoras < 1) return `${minutos} min`;
  if (totalHoras < HORAS_POR_DIA) return `${totalHoras} h ${minutos} min`;

  const dias = Math.floor(totalHoras / HORAS_POR_DIA);
  return `${dias} d ${totalHoras % HORAS_POR_DIA} h`;
}

/**
 * Diz há quanto tempo algo começou.
 * @param {Date} desde Instante de início.
 * @param {number} [agora] Instante atual em milissegundos (padrão: agora).
 * @returns {string} Texto da duração (ex.: "2 h 14 min").
 */
export function haQuantoTempo(desde, agora = Date.now()) {
  return formatarDuracao(agora - desde.getTime());
}

/**
 * Formata um instante como "HH:MM" no horário de Brasília.
 * @param {Date} data Instante a formatar.
 * @returns {string} Hora e minuto, com dois dígitos cada.
 */
export function formatarHoraBrasilia(data) {
  const emBrasilia = new Date(data.getTime() + DESLOCAMENTO_BRASILIA_MS);
  return `${doisDigitos(emBrasilia.getUTCHours())}:${doisDigitos(emBrasilia.getUTCMinutes())}`;
}

/**
 * Formata um instante como "DD/MM HH:MM" no horário de Brasília.
 * @param {Date} data Instante a formatar.
 * @returns {string} Dia, mês, hora e minuto, com dois dígitos cada (ex.: "17/10 12:14").
 */
export function formatarDataHoraBrasilia(data) {
  const emBrasilia = new Date(data.getTime() + DESLOCAMENTO_BRASILIA_MS);
  const dia = doisDigitos(emBrasilia.getUTCDate());
  const mes = doisDigitos(emBrasilia.getUTCMonth() + 1);
  return `${dia}/${mes} ${formatarHoraBrasilia(data)}`;
}
