/**
 * @module
 * @license MIT
 * @see https://www.france.tv/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire l'identifiant de la vidéo.
 *
 * @type {RegExp}
 */
const UUID_REGEXP = /"videoId":"(?<videoId>[-0-9a-f]+)"/u;

/**
 * L'URL de l'API de France tv.
 *
 * @type {string}
 */
const API_URL = "https://player.webservices.francetelevisions.fr/v1/videos/";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une page de France tv.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = UUID_REGEXP.exec(script.text);
        if (null === result) {
            continue;
        }

        const url =
            API_URL +
            result.groups.videoId +
            "?device_type=desktop&browser=firefox";
        let response = await fetch(url);
        let json = await response.json();

        response = await fetch(json.video.token);
        json = await response.json();
        return json.url;
    }
    return undefined;
};
export const extract = matchPattern(action, "*://www.france.tv/*");
