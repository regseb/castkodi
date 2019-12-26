/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Dailymotion.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}          _url L'URL d'une page de Gamekult.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
    const video = doc.querySelector(".js-dailymotion-video[data-id]");
    return null === video ? null
                          : PLUGIN_URL + video.dataset.id;
};
export const extract = matchPattern(action,
    "*://www.gamekult.com/*",
    "*://gamekult.com/*");
