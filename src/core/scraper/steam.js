/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}          _url L'URL d'un jeu Steam.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionGame = async function (_url, doc) {
    const div = doc.querySelector(".highlight_movie[data-mp4-hd-source]");
    return null === div ? null
                        : div.dataset.mp4HdSource;
};
export const extractGame = matchPattern(actionGame,
    "*://store.steampowered.com/app/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une diffusion Steam.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionBroadcast = async function ({ pathname }) {
    const url = "https://steamcommunity.com/broadcast/getbroadcastmpd/" +
                                               "?steamid=" + pathname.slice(17);
    const response = await fetch(url);
    const json = await response.json();
    return "hls_url" in json ? json.hls_url
                             : null;
};
export const extractBroadcast = matchPattern(actionBroadcast,
    "*://steamcommunity.com/broadcast/watch/*");
