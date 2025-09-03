/**
 * @module
 * @license MIT
 * @see https://www.apple.com/apple-podcasts/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'un son Apple Podcasts.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    const script = doc.querySelector("script#serialized-server-data");
    if (null === script) {
        return undefined;
    }
    const json = JSON.parse(script.text);
    return json[0].data.shelves[0].items[0].contextAction.episodeOffer
        ?.streamUrl;
};
export const extract = matchURLPattern(
    action,
    "https://podcasts.apple.com/*/podcast/*/id*",
);
