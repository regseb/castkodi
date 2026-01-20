/**
 * @module
 * @license MIT
 * @see https://kick.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de Kick.
 *
 * @type {string}
 */
const API_URL = "https://kick.com/api/v2/channels";

/**
 * L'expression rationnelle pour extraire l'URL de la vidéo.
 *
 * @type {RegExp}
 */
const URL_REGEXP =
    /\\"source\\":\\"(?<source>https:\/\/stream\.kick\.com\/[^"]+\/master\.m3u8)\\",/v;

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un live Kick.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionLive = async ({ pathname }) => {
    const response = await fetch(API_URL + pathname);
    const json = await response.json();
    const playbackUrl = json.playback_url;
    return playbackUrl?.startsWith("https://") ? playbackUrl : undefined;
};
export const extractLive = matchURLPattern(
    actionLive,
    String.raw`https://kick.com/([^\/]+)`,
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une vidéo de Kick.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionVideo = async (_url, metadata) => {
    const doc = await metadata.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = URL_REGEXP.exec(script.text);
        if (null !== result) {
            return result.groups.source;
        }
    }
    return undefined;
};
export const extractVideo = matchURLPattern(
    actionVideo,
    String.raw`https://kick.com/([^\/]+)/videos/*`,
);
