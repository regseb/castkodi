/**
 * @module
 * @license MIT
 * @see https://www.bigo.tv/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Bigo Live pour obtenir des informations sur la vidéo.
 *
 * @type {string}
 */
const API_URL =
    "https://ta.bigo.tv/official_website/studio/getInternalStudioInfo";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo de Bigo Live.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ pathname }) => {
    const result = /^\/(?:[a-z]{2}\/)?(?<id>\d+)$/iu.exec(pathname);
    if (undefined === result?.groups) {
        return undefined;
    }
    const response = await fetch(API_URL, {
        method: "POST",
        body: new URLSearchParams({ siteId: result.groups.id }),
    });
    const json = await response.json();
    return "" === json.data.hls_src
        ? undefined
        : (json.data.hls_src ?? undefined);
};
export const extract = matchPattern(action, "*://www.bigo.tv/*");
