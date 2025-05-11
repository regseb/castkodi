/**
 * @module
 * @license MIT
 * @see https://www.arteradio.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Arte Radio.
 *
 * @type {string}
 */
const API_URL = "https://www.arteradio.com/_next/data";

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL}      _url          L'URL d'un son Arte Radio.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = async function ({ pathname }, metadata) {
    const slug = pathname.slice(5);
    const doc = await metadata.html();
    const buildId = JSON.parse(
        doc.querySelector("script#__NEXT_DATA__").text,
    ).buildId;

    const response = await fetch(`${API_URL}/${buildId}/son/${slug}.json`);
    const json = await response.json();
    return json.pageProps.sound.mp3HifiMedia.finalUrl;
};
export const extract = matchPattern(action, "*://www.arteradio.com/son/*");
