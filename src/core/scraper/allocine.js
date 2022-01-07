/**
 * @module
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une vidéo AlloCiné.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const figure = doc.querySelector("figure[data-model]");
    if (null === figure) {
        return null;
    }

    const model = JSON.parse(figure.dataset.model);
    const sources = model.videos[0].sources;
    return sources.high ??
           sources.standard ??
           sources.medium ??
           sources.low ??
           null;
};
export const extract = matchPattern(action,
    "*://www.allocine.fr/*",
    "*://rss.allocine.fr/*");
