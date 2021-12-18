/**
 * @module
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url          L'URL d'une vidéo AlloCiné.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, content) {
    const doc = await content.html();
    const figure = doc.querySelector("figure[data-model]");
    if (null === figure) {
        return null;
    }

    const model = JSON.parse(figure.dataset.model);
    const source = Object.values(model.videos[0].sources).pop();
    return new URL(source, href).href;
};
export const extract = matchPattern(action,
    "*://www.allocine.fr/*",
    "*://rss.allocine.fr/*");
