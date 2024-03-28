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

        let url =
            `https://k7.ftven.fr/videos/${result.groups.videoId}` +
            "?domain=www.france.tv&browser=chrome";
        let response = await fetch(url);
        let json = await response.json();

        url =
            "https://hdfauth.ftven.fr/esi/TA?format=json&url=" +
            encodeURIComponent(json.video.url);
        response = await fetch(url);
        json = await response.json();
        return json.url;
    }
    return undefined;
};
export const extract = matchPattern(action, "*://www.france.tv/*");
