/**
 * @module
 * @see https://kodi.wiki/view/Add-on:DailyMotion.com
 */
/* eslint-disable require-await */

import * as labeller from "../labeller/dailymotion.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Dailymotion.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=";

/**
 * Génère l'URL d'une vidéo dans l'extension Dailymotion.
 *
 * @param {string} videoId L'identifiant de la vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateUrl = async function (videoId) {
    return PLUGIN_URL + videoId;
};

/**
 * Extrait le titre d'une vidéo Dailymotion.
 *
 * @param {URL} url L'URL utilisant le plugin de Dailymotion.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const action = async function ({ searchParams }) {
    return searchParams.has("url") ? labeller.extract(searchParams.get("url"))
                                   : null;
};
export const extract = matchPattern(action,
    "plugin://plugin.video.dailymotion_com/*");
