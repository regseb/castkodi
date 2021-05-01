/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'API de Bigo Live pour obtenir des informations sur la vidéo.
 *
 * @type {string}
 */
const API_URL = "https://www.bigo.tv/studio/getInternalStudioInfo";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo de Bigo Live.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    const response = await fetch(API_URL, {
        method: "POST",
        body:   new URLSearchParams({ siteId: pathname.slice(1) }),
    });
    const json = await response.json();
    return json.data.hls_src ?? null;
};
export const extract = matchPattern(action, "*://www.bigo.tv/*");
