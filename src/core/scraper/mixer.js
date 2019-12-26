/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL du l'API de Mixer pour obtenir des informations sur une chaine.
 *
 * @constant {string}
 */
const API_URL = "https://mixer.com/api/v1/channels/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une chaine Mixer.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    let name;
    if (-1 === pathname.indexOf("/", 1)) {
        name = pathname.slice(1);
    } else if (pathname.startsWith("/embed/player/")) {
        name = pathname.slice(14);
    } else {
        return null;
    }

    const response = await fetch(API_URL + name);
    if (response.ok) {
        const json = await response.json();
        return API_URL + json.id + "/manifest.m3u8";
    }
    return null;
};
export const extract = matchPattern(action, "*://mixer.com/*");
