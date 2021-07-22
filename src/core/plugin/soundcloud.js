/**
 * @module
 * @see https://kodi.wiki/view/Add-on:SoundCloud
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
import * as labeller from "../labeller/soundcloud.js";

/**
 * L'URL de l'extension pour lire des musiques issues de SoundCloud.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.audio.soundcloud/play/?url=";

/**
 * Génère l'URL d'une musique dans l'extension SoundCloud.
 *
 * @param {URL} audioUrl L'URL de la musique SoundCloud.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateUrl = async function ({ href }) {
    return PLUGIN_URL + encodeURIComponent(href);
};

/**
 * Extrait le titre d'un son SoundCloud.
 *
 * @param {URL} url L'URL utilisant le plugin de SoundCloud.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("url")) {
        const href = decodeURIComponent(searchParams.get("url"));
        return labeller.extract(new URL(href));
    }
    return null;
};
export const extract = matchPattern(action,
    "plugin://plugin.audio.soundcloud/play/*");
