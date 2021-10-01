/**
 * @module
 * @see https://kodi.wiki/view/Add-on:Vimeo
 */
/* eslint-disable require-await */

import * as labeller from "../labeller/vimeo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Vimeo.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vimeo/play/?video_id=";

/**
 * Génère l'URL d'une vidéo dans l'extension SoundCloud.
 *
 * @param {string}           videoId L'identifiant de la vidéo Vimeo.
 * @param {string|undefined} hash    L'éventuel <em>hash</em> pour accéder à une
 *                                   vidéo non-listée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateUrl = async function (videoId, hash) {
    return PLUGIN_URL + videoId + (undefined === hash ? ""
                                                      : `:${hash}`);
};

/**
 * Extrait le titre d'une vidéo Vimeo.
 *
 * @param {URL} url Une URL utilisant le plugin de Vimeo.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (!searchParams.has("video_id")) {
        return null;
    }

    const [videoId, hash] = searchParams.get("video_id").split(":");
    return labeller.extract(videoId, hash);
};
export const extract = matchPattern(action,
    "plugin://plugin.video.vimeo/play/*");
