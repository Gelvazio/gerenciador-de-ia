/**
 * Fontes lidas pelo visualizador: os quadros `tasks/STATUS.md` dos repositórios públicos.
 * Para incluir uma fonte nova, acrescente uma linha em FONTES_QUADRO. Nada mais muda.
 */

/** Intervalo entre duas leituras de cada fonte, em milissegundos. */
export const INTERVALO_LEITURA_MS = 60000;

/** Reserva sem commit da frente há mais de isso é marcada como parada (24 h). */
export const LIMITE_RESERVA_PARADA_MS = 24 * 60 * 60 * 1000;

/** Frente ⏹️ Encerrada só aparece na cena se foi atualizada nas últimas 24 h. */
export const JANELA_FRENTE_ENCERRADA_MS = 24 * 60 * 60 * 1000;

/** Caminho do quadro dentro de cada repositório. */
export const CAMINHO_QUADRO = "tasks/STATUS.md";

/** Branch lida em cada repositório. */
export const BRANCH_QUADRO = "main";

/**
 * Lista de fontes. Cada item: dono do repositório, nome do repositório e nome exibido na página.
 * @type {ReadonlyArray<{dono: string, repositorio: string, nomeExibido: string}>}
 */
export const FONTES_QUADRO = Object.freeze([
  { dono: "Gelvazio", repositorio: "aulasenai", nomeExibido: "Aulas SENAI" },
  { dono: "Gelvazio", repositorio: "dashboard-ai", nomeExibido: "Dashboard AI" },
]);
