/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Vimeo.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vimeo/play/?video_id=";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi. Seul les
 * URLs des vidéos intégrées sont gérées car pour les URLs vers les vidéos : le
 * scraper <em>opengraph</em> va extrait l'URL de la vidéo intégrée depuis la
 * méta-donnée <code>og:video:secure_url</code>.
 *
 * @param {URL} url L'URL d'une vidéo Vimeo intégrée.
 * @returns {Promise<string>} Une promesse contenant le lien du
                              <em>fichier</em>.
 */
const action = async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(7);
};
export const extract = matchPattern(action, "*://player.vimeo.com/video/*");
