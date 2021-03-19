/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url       L'URL d'un jeu Steam.
 * @param {Object}   _content  Le contenu de l'URL.
 *
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
 const action = async function (url, _content) {
    const html = await (await fetch(url)).text();
    const found = html.match(/https:.*.m3u8/gmu);
    if (null === found) {
        return null;
    }
    return found[0];
};
export const extract = matchPattern(action, "https://www.star.gr/*");
