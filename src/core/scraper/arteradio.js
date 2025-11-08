/**
 * @module
 * @license MIT
 * @see https://www.arteradio.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de Arte Radio.
 *
 * @type {string}
 */
const API_URL = "https://www.arteradio.com/_next/data";

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} urlMatch      L'URL d'un son Arte Radio avec le _slug_ du
 *                                 son.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = async ({ slug }, metadata) => {
    const doc = await metadata.html();
    const buildId = JSON.parse(
        doc.querySelector("script#__NEXT_DATA__").text,
    ).buildId;

    const response = await fetch(`${API_URL}/${buildId}/son/${slug}.json`);
    const json = await response.json();
    return json.pageProps.sound.mp3HifiMedia.finalUrl;
};
export const extract = matchURLPattern(
    action,
    "https://www.arteradio.com/son/:slug",
);
