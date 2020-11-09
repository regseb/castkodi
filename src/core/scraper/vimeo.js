/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Vimeo.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vimeo/play/?video_id=";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Vimeo.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionVideo = async function ({ pathname }) {
    return (/^\/\d+$/u).test(pathname) ? PLUGIN_URL + pathname.slice(1)
                                       : null;
};
export const extractVideo = matchPattern(actionVideo, "*://vimeo.com/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Vimeo intégrée.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionEmbed = async function ({ pathname }) {
    return (/^\/video\/\d+$/u).test(pathname) ? PLUGIN_URL + pathname.slice(7)
                                              : null;
};
export const extractEmbed = matchPattern(actionEmbed,
    "*://player.vimeo.com/video/*");
