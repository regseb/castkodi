/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une vidéo de Melty.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        if (!script.text.startsWith("window.__INITIAL_STATE__=")) {
            continue;
        }

        const state = JSON.parse(script.text.slice(25,
                                 script.text.indexOf(";(function()")));
        for (const item of state.articles.items) {
            if ("Video" === item.video?.kind) {
                return item.video.URL.replace("{device}", "desktop");
            }
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://www.melty.fr/*");
