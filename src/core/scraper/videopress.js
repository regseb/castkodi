/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'API de WordPress.
 *
 * @constant {string}
 */
const API_URL = "https://public-api.wordpress.com/rest/v1.1/videos/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une video de VideoPress.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    // Enlever le préfixe "/v/" ou "/embed/".
    const id = pathname.slice(pathname.indexOf("/", 1) + 1);
    const response = await fetch(API_URL + id);
    if (response.ok) {
        const json = await response.json();
        return json.original;
    }
    return null;
};
export const extract = matchPattern(action,
    "*://videopress.com/v/*",
    "*://videopress.com/embed/*");
