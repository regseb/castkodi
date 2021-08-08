/**
 * @module
 * @see https://kodi.wiki/view/Add-on:Vimeo
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
import * as labeller from "../labeller/vimeo.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Vimeo.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vimeo/play/?video_id=";

/**
 * Génère l'URL d'une vidéo dans l'extension SoundCloud.
 *
 * @param {string} videoId L'identifiant de la vidéo Vimeo.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateUrl = async function (videoId) {
    return PLUGIN_URL + videoId;
};

/**
 * Extrait le titre d'une vidéo Vimeo.
 *
 * @param {URL} url Une URL utilisant le plugin de Vimeo.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const action = async function ({ searchParams }) {
    return searchParams.has("video_id")
                                ? labeller.extract(searchParams.get("video_id"))
                                : null;
};
export const extract = matchPattern(action,
    "plugin://plugin.video.vimeo/play/*");
