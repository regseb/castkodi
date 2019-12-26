/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.youtube/play/?video_id=";

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo DevTube.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const action = async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(7);
};
export const extract = matchPattern(action, "*://dev.tube/video/*");
