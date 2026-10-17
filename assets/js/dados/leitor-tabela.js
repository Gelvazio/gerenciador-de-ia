/**
 * Leitor de tabelas Markdown dos quadros `tasks/STATUS.md`.
 * Não usa DOM nem Three.js. As colunas são lidas pelo NOME, nunca pela posição, porque os
 * quadros têm colunas diferentes; coluna ausente vira texto vazio.
 */

const PREFIXO_TITULO_SECAO = "## ";
const SEPARADOR_COLUNA = "|";
const BARRA_ESCAPADA = "\\|";
const MARCA_BARRA_ESCAPADA = "\u0000";
const REGEX_LINHA_SEPARADORA = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/;
const REGEX_PREFIXO_SEM_LETRA = /^[^\p{L}\p{N}]+/u;

/**
 * Tira os símbolos e emojis do começo de um título e deixa em minúsculas.
 * @param {string} titulo Título como aparece no quadro (ex.: "📌 Tarefas").
 * @returns {string} Título comparável (ex.: "tarefas").
 */
function normalizarTitulo(titulo) {
  return titulo.replace(REGEX_PREFIXO_SEM_LETRA, "").trim().toLowerCase();
}

/**
 * Acha uma seção `##` pelo começo do título e devolve as linhas dela, sem o título.
 * A seção vai até o próximo título `##` (subtítulos `###` ficam dentro dela).
 * @param {string} markdown Texto completo do quadro.
 * @param {string} tituloProcurado Começo do título (ex.: "Tarefas", "Frentes de trabalho").
 * @returns {string[]} Linhas da seção, ou lista vazia se ela não existir.
 */
export function lerLinhasDaSecao(markdown, tituloProcurado) {
  const procurado = normalizarTitulo(tituloProcurado);
  const linhas = markdown.split(/\r?\n/);
  const eTituloDeSecao = (linha) => linha.startsWith(PREFIXO_TITULO_SECAO);
  const inicio = linhas.findIndex(
    (linha) => eTituloDeSecao(linha) && normalizarTitulo(linha.slice(3)).startsWith(procurado),
  );
  if (inicio === -1) return [];

  const proximo = linhas.findIndex((linha, indice) => indice > inicio && eTituloDeSecao(linha));
  return linhas.slice(inicio + 1, proximo === -1 ? linhas.length : proximo);
}

/**
 * Divide uma linha de tabela em células, respeitando a barra escapada (`\|`).
 * @param {string} linha Linha que começa com `|`.
 * @returns {string[]} Células sem espaços nas pontas.
 */
export function dividirCelulas(linha) {
  const protegida = linha.trim().split(BARRA_ESCAPADA).join(MARCA_BARRA_ESCAPADA);
  const semBordas = protegida.replace(/^\|/, "").replace(/\|$/, "");
  return semBordas
    .split(SEPARADOR_COLUNA)
    .map((celula) => celula.split(MARCA_BARRA_ESCAPADA).join(SEPARADOR_COLUNA).trim());
}

/**
 * Lê a primeira tabela de um trecho de linhas e devolve uma lista de objetos por coluna.
 * @param {string[]} linhas Linhas de uma seção.
 * @returns {Array<Record<string, string>>} Uma entrada por linha da tabela; vazio se não houver.
 */
export function lerTabela(linhas) {
  const eLinhaDeTabela = (linha) => linha.trim().startsWith(SEPARADOR_COLUNA);
  const inicio = linhas.findIndex(
    (linha, indice) =>
      eLinhaDeTabela(linha) && REGEX_LINHA_SEPARADORA.test((linhas[indice + 1] ?? "").trim()),
  );
  if (inicio === -1) return [];

  const colunas = dividirCelulas(linhas[inicio]);
  const registros = [];
  for (const linha of linhas.slice(inicio + 2)) {
    if (!eLinhaDeTabela(linha)) break;
    const celulas = dividirCelulas(linha);
    registros.push(Object.fromEntries(colunas.map((nome, i) => [nome, celulas[i] ?? ""])));
  }
  return registros;
}

/**
 * Atalho: acha a seção pelo título e lê a primeira tabela dela.
 * @param {string} markdown Texto completo do quadro.
 * @param {string} tituloProcurado Começo do título da seção.
 * @returns {Array<Record<string, string>>} Linhas da tabela (vazio se a seção não existir).
 */
export function lerTabelaDaSecao(markdown, tituloProcurado) {
  return lerTabela(lerLinhasDaSecao(markdown, tituloProcurado));
}
