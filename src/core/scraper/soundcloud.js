/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'expression rationnelle pour extraire l'URL de la musique.
 *
 * @constant {RegExp}
 */
const URL_REGEXP = /api\.soundcloud\.com%2Ftracks%2F([^&]+)/iu;

/**
 * L'URL de l'extension pour lire des sons issus de SoundCloud.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud/play/?track_id=";

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'un son SoundCloud.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname, href }) {
    // Si le chemin contient plusieurs barres obliques.
    if (pathname.indexOf("/", 1) !== pathname.lastIndexOf("/"))  {
        return null;
    }

    const url = "https://soundcloud.com/oembed?url=" +
                encodeURIComponent(href.replace("//mobi.", "//"));
    const response = await fetch(url);
    const text = await response.text();
    const result = URL_REGEXP.exec(text);
    return null === result ? null
                           : PLUGIN_URL + result[1];
};
export const extract = matchPattern(action,
    "*://soundcloud.com/*/*",
    "*://mobi.soundcloud.com/*/*");
