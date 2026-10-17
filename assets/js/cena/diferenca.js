/**
 * Atualização por diferença (CLAUDE.md §4): a cada leitura, cria só o que é novo, mantém o
 * que continua e descarta o que sumiu. Usado pelas ilhas, estações e blocos.
 * Sem Three.js nem DOM.
 */

/**
 * Sincroniza um mapa de objetos da cena com a lista de dados mais recente.
 * @param {Map<string, object>} mapa Objetos atuais por chave; é alterado no lugar.
 * @param {object[]} itens Dados da leitura atual, na ordem em que devem aparecer.
 * @param {{chave: function(object): string, criar: function(object): object,
 *   descartar: function(object): void}} acoes Como achar a chave, criar e descartar um objeto.
 * @returns {Array<{objeto: object, item: object}>} Um par por item, na ordem dos itens.
 */
export function sincronizar(mapa, itens, acoes) {
  const vistas = new Set();
  const pares = itens.map((item) => {
    const chave = acoes.chave(item);
    vistas.add(chave);
    if (!mapa.has(chave)) mapa.set(chave, acoes.criar(item));
    return { objeto: mapa.get(chave), item };
  });

  for (const [chave, objeto] of mapa) {
    if (vistas.has(chave)) continue;
    acoes.descartar(objeto);
    mapa.delete(chave);
  }
  return pares;
}
