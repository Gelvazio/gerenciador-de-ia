/**
 * Leitor de um quadro `tasks/STATUS.md` inteiro: tarefas (seção "📌 Tarefas") e frentes
 * (seção "🧭 Frentes de trabalho", que só alguns quadros têm). Não usa DOM nem Three.js.
 * As colunas são lidas pelo nome; o que não existir no quadro fica vazio.
 */

import { lerTabelaDaSecao } from "./leitor-tabela.js";
import { lerReserva, TIPO_RESERVA } from "./leitor-reserva.js";
import { lerDataHoraBrasilia } from "../utilitarios/tempo.js";

const TITULO_SECAO_TAREFAS = "Tarefas";
const TITULO_SECAO_FRENTES = "Frentes de trabalho";
const NIVEL_SEM_NIVEL = "sem nível";
const MARCA_NEGRITO = "**";
const TEXTO_USUARIO = "Usuário";
const REGEX_PRIMEIRO_EMOJI = /^\p{Extended_Pictographic}/u;
const REGEX_NIVEL_NO_MODELO = /\b(LEVE|MEDIO|PESADO)\b/;
const REGEX_NIVEL_NO_TITULO = /`(LEVE|MEDIO|PESADO)\s*·/;
const REGEX_SUFIXO_NIVEL = /\s*·\s*(LEVE|MEDIO|PESADO)\b.*$/;
const REGEX_LINK_MARKDOWN = /\[([^\]]*)\]\(([^)]*)\)/;
const DEPENDENCIA_VAZIA = new Set(["", "—", "nenhuma"]);

/** Status da tarefa pelo primeiro emoji (código do ponto Unicode → chave). */
const STATUS_POR_EMOJI = new Map([
  [0x2b1c, "pendente"], // ⬜
  [0x1f504, "em-execucao"], // 🔄
  [0x2705, "concluido"], // ✅
  [0x26d4, "bloqueado"], // ⛔
  [0x1f440, "aguardando-usuario"], // 👀
]);

/** Prioridade pelo emoji (🔴 🟠 🟡 🟢). */
const PRIORIDADE_POR_EMOJI = new Map([
  [0x1f534, "maxima"],
  [0x1f7e0, "alta"],
  [0x1f7e1, "media"],
  [0x1f7e2, "baixa"],
]);

/** Situação da frente pelo emoji (🔄 ⏹️ 👀). */
const SITUACAO_POR_EMOJI = new Map([
  [0x1f504, "ativa"],
  [0x23f9, "encerrada"],
  [0x1f440, "aguardando-usuario"],
]);

/**
 * Traduz o primeiro emoji de um texto numa chave.
 * @param {string|undefined} texto Texto que começa com o emoji (ex.: "⬜ Pendente").
 * @param {Map<number, string>} mapa Código do ponto Unicode → chave.
 * @returns {string} Chave, ou texto vazio se o emoji não estiver no mapa.
 */
function chavePeloEmoji(texto, mapa) {
  const emoji = REGEX_PRIMEIRO_EMOJI.exec((texto ?? "").trim());
  return emoji ? (mapa.get(emoji[0].codePointAt(0)) ?? "") : "";
}

/**
 * Descobre o nível da subtarefa. Quando o quadro tem a coluna Modelo, só ela vale (valores
 * como `Usuário`, `—` ou `⚠️ sem nível` dão "sem nível", mesmo que o título tenha marcador).
 * Quando o quadro não tem essa coluna, vale o marcador do título.
 * @param {string|undefined} modelo Texto da coluna Modelo; undefined se a coluna não existe.
 * @param {string} titulo Título bruto (ex.: "… · `MEDIO · effort medium`").
 * @returns {string} "LEVE", "MEDIO", "PESADO" ou "sem nível".
 */
export function lerNivel(modelo, titulo) {
  const marcador = modelo === undefined
    ? REGEX_NIVEL_NO_TITULO.exec(titulo)
    : REGEX_NIVEL_NO_MODELO.exec(modelo);
  return marcador ? marcador[1] : NIVEL_SEM_NIVEL;
}

/**
 * Deixa o título legível: sem negrito, sem crases e sem o marcador de nível do fim.
 * @param {string} titulo Título bruto da tabela.
 * @returns {string} Título limpo.
 */
export function limparTitulo(titulo) {
  return titulo
    .split(MARCA_NEGRITO).join("")
    .split("`").join("")
    .replace(REGEX_SUFIXO_NIVEL, "")
    .trim();
}

/**
 * Lê o link da coluna Etapa (`[001-abc](etapas/ARQUIVO.md)`).
 * @param {string|undefined} celula Texto da célula.
 * @returns {{texto: string, caminho: string}} Texto e caminho (vazio se não houver link).
 */
function lerEtapa(celula) {
  const texto = celula ?? "";
  const link = REGEX_LINK_MARKDOWN.exec(texto);
  return link ? { texto: link[1], caminho: link[2] } : { texto, caminho: "" };
}

/**
 * Lista as dependências de uma subtarefa (só o identificador, sem marcas como ✅).
 * @param {string|undefined} celula Texto da coluna "Depende de".
 * @returns {string[]} Identificadores (vazio para `—` e `Nenhuma`).
 */
function lerDependencias(celula) {
  return (celula ?? "")
    .split(",")
    .map((item) => item.trim().split(/\s+/)[0] ?? "")
    .filter((item) => !DEPENDENCIA_VAZIA.has(item.toLowerCase()));
}

/**
 * Converte uma linha da tabela "📌 Tarefas" numa tarefa.
 * @param {Record<string, string>} linha Linha lida por `lerTabelaDaSecao`.
 * @returns {object} Tarefa com id, título, nível, status, reserva, dependências e etapa.
 */
export function lerTarefa(linha) {
  const reserva = lerReserva(linha["Em uso por"]);
  const tituloBruto = linha["Título"] ?? "";
  const ehMae =
    tituloBruto.startsWith(MARCA_NEGRITO) ||
    (linha["Tarefa"] ?? "").startsWith(MARCA_NEGRITO) ||
    reserva.tipo === TIPO_RESERVA.NAO_RESERVAVEL;

  return {
    id: (linha["Tarefa"] ?? "").split(MARCA_NEGRITO).join("").trim(),
    titulo: limparTitulo(tituloBruto),
    ehMae,
    nivel: lerNivel(linha["Modelo"], tituloBruto),
    ehDoUsuario: (linha["Modelo"] ?? "").startsWith(TEXTO_USUARIO),
    prioridade: chavePeloEmoji(linha["Prioridade"], PRIORIDADE_POR_EMOJI),
    status: chavePeloEmoji(linha["Status"], STATUS_POR_EMOJI),
    statusTexto: linha["Status"] ?? "",
    reserva,
    dependencias: lerDependencias(linha["Depende de"]),
    etapa: lerEtapa(linha["Etapa"]),
  };
}

/**
 * Converte uma linha da tabela "🧭 Frentes de trabalho" numa frente.
 * @param {Record<string, string>} linha Linha lida por `lerTabelaDaSecao`.
 * @returns {object} Frente com nome, tarefa, situação e data da última atualização.
 */
export function lerFrente(linha) {
  return {
    nome: linha["Frente"] ?? "",
    tarefaTexto: linha["Tarefa (etapa)"] ?? "",
    situacao: chavePeloEmoji(linha["Situação"], SITUACAO_POR_EMOJI),
    situacaoTexto: linha["Situação"] ?? "",
    atualizadoEm: lerDataHoraBrasilia(linha["Atualizado em"]),
  };
}

/**
 * Lê o quadro inteiro.
 * @param {string} markdown Texto do `tasks/STATUS.md`.
 * @returns {{tarefas: object[], frentes: object[]}} Tarefas e frentes; `frentes` fica vazia
 *   quando o quadro não tem a seção "🧭 Frentes de trabalho".
 */
export function lerQuadro(markdown) {
  return {
    tarefas: lerTabelaDaSecao(markdown, TITULO_SECAO_TAREFAS).map(lerTarefa),
    frentes: lerTabelaDaSecao(markdown, TITULO_SECAO_FRENTES).map(lerFrente),
  };
}
