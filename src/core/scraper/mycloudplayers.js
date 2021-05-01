/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des musiques issues de SoundCloud.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud/play/?audio_id=";

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'une musique My Cloud Player.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ searchParams }) {
    return searchParams.has("play") ? PLUGIN_URL + searchParams.get("play")
                                    : null;
};
export const extract = matchPattern(action, "*://mycloudplayers.com/*");
