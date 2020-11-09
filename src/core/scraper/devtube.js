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
const PLUGIN_URL = "plugin://plugin.video.youtube/play/";

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {URL}     url               L'URL d'une vidéo DevTube.
 * @param {Object}  _content          Le contenu de l'URL.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ pathname }, _content, { incognito }) {
    return PLUGIN_URL + "?video_id=" + pathname.slice(7) +
                        "&incognito=" + incognito.toString();
};
export const extract = matchPattern(action, "*://dev.tube/video/*");
