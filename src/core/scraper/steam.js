/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'un jeu Steam.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionGame = async function (_url, content) {
    const doc = await content.html();
    const div = doc.querySelector(".highlight_movie[data-mp4-hd-source]");
    return div?.dataset.mp4HdSource ?? null;
};
export const extractGame = matchPattern(actionGame,
    "*://store.steampowered.com/app/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une diffusion Steam.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionBroadcast = async function ({ pathname }) {
    const url = "https://steamcommunity.com/broadcast/getbroadcastmpd/" +
                                               "?steamid=" + pathname.slice(17);
    const response = await fetch(url);
    const json = await response.json();
    return json?.hls_url ?? null;
};
export const extractBroadcast = matchPattern(actionBroadcast,
    "*://steamcommunity.com/broadcast/watch/*");
