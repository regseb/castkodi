/**
 * @module
 * @license MIT
 * @see https://www.dumpert.nl/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo Dumpert.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();

    // Ne pas utiliser le scraper opengraph, car Dumpert n'implémente pas
    // correctement la norme Open Graph. La clé "og:video" est définie dans
    // l'attribut "name", alors qu'il faut la renseigner dans l'attribut
    // "property".
    return doc.querySelector('meta[name="og:video"]')?.content;
};
export const extract = matchPattern(
    action,
    "*://www.dumpert.nl/item/*",
    "*://www.dumpert.nl/mediabase/*",
);
