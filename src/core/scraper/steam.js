/**
 * @module
 * @license MIT
 * @see https://store.steampowered.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'un jeu Steam.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionGame = async (_url, metadata) => {
    const doc = await metadata.html();
    const div = doc.querySelector(".highlight_movie[data-mp4-hd-source]");
    return div?.dataset.mp4HdSource;
};
export const extractGame = matchURLPattern(
    actionGame,
    "https://store.steampowered.com/app/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une diffusion Steam avec l'identifiant.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionBroadcast = async ({ id }) => {
    const response = await fetch(
        `https://steamcommunity.com/broadcast/getbroadcastmpd/?steamid=${id}`,
    );
    const json = await response.json();
    return json.hls_url;
};
export const extractBroadcast = matchURLPattern(
    actionBroadcast,
    "https://steamcommunity.com/broadcast/watch/:id",
);
