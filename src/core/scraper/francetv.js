/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire l'identifiant de la vidéo.
 *
 * @constant {RegExp}
 */
const UUID_REGEXP = /"videoId":"(?<videoId>[0-9a-f-]+)"/u;

/**
 * L'URL de l'API de France tv.
 *
 * @constant {string}
 */
const API_URL = "https://player.webservices.francetelevisions.fr/v1/videos/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une page de France tv.
 * @param {object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = UUID_REGEXP.exec(script.text);
        if (null === result) {
            continue;
        }

        const url = API_URL + result.groups.videoId + "?device_type=desktop" +
                                                      "&browser=firefox";
        const response = await fetch(url);
        const json = await response.json();
        return json.streamroot.content_id;
    }
    return null;
};
export const extract = matchPattern(action, "*://www.france.tv/*");
