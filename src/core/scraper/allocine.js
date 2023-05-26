/**
 * @module
 * @license MIT
 * @see https://www.allocine.fr/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url           L'URL d'une vidéo AlloCiné.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (url, metadata) {
    const doc = await metadata.html();
    const figure = doc.querySelector("figure[data-model]");
    if (null === figure) {
        return undefined;
    }

    const model = JSON.parse(figure.dataset.model);
    const sources = model.videos[0].sources;
    const source =
        sources.high ?? sources.standard ?? sources.medium ?? sources.low;
    return undefined === source ? undefined : new URL(source, url).href;
};
export const extract = matchPattern(action, "*://www.allocine.fr/*");
