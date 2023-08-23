/**
 * @module
 * @license MIT
 * @see https://store.steampowered.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'un jeu Steam.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionGame = async function (_url, metadata) {
    const doc = await metadata.html();
    const div = doc.querySelector(".highlight_movie[data-mp4-hd-source]");
    return div?.dataset.mp4HdSource;
};
export const extractGame = matchPattern(
    actionGame,
    "*://store.steampowered.com/app/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une diffusion Steam.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionBroadcast = async function ({ pathname }) {
    const id = pathname.slice(17);
    const response = await fetch(
        `https://steamcommunity.com/broadcast/getbroadcastmpd/?steamid=${id}`,
    );
    const json = await response.json();
    return json.hls_url;
};
export const extractBroadcast = matchPattern(
    actionBroadcast,
    "*://steamcommunity.com/broadcast/watch/*",
);
