/**
 * @module
 * @license MIT
 * @see https://www.allocine.fr/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url           L'URL d'une vidéo AlloCiné.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (url, metadata) => {
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
export const extract = matchURLPattern(action, "https://www.allocine.fr/*");
