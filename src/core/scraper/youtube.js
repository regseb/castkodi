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
 * Extrait les informations nécessaire pour lire une vidéo / playlist sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo / playlist YouTube (ou Invidious /
 *                  HookTube).
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionVideo = async function ({ searchParams }) {
    const config = await browser.storage.local.get(["youtube-playlist"]);
    if (searchParams.has("list") &&
            ("playlist" === config["youtube-playlist"] ||
             !searchParams.has("v"))) {
        return PLUGIN_URL + "?playlist_id=" + searchParams.get("list");
    }
    if (searchParams.has("v")) {
        return PLUGIN_URL + "?video_id=" + searchParams.get("v");
    }

    return null;
};
export const extractVideo = matchPattern(actionVideo,
    "*://*.youtube.com/watch*",
    "*://invidio.us/watch*",
    "*://hooktube.com/watch*");

/**
 * Extrait les informations nécessaire pour lire une playlist sur Kodi.
 *
 * @param {URL} url L'URL d'une playlist YouTube.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionPlaylist = async function ({ searchParams }) {
    return searchParams.has("list")
                       ? PLUGIN_URL + "?playlist_id=" + searchParams.get("list")
                       : null;
};
export const extractPlaylist = matchPattern(actionPlaylist,
    "*://*.youtube.com/playlist*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo YouTube intégrée (ou Invidious /
 *                  HookTube).
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const actionEmbed = async function ({ pathname }) {
    return PLUGIN_URL + "?video_id=" + pathname.slice(7);
};
export const extractEmbed = matchPattern(actionEmbed,
    "*://www.youtube.com/embed/*",
    "*://www.youtube-nocookie.com/embed/*",
    "*://invidio.us/embed/*",
    "*://hooktube.com/embed/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL minifiée d'une vidéo YouTube.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const actionMinify = async function ({ pathname }) {
    return PLUGIN_URL + "?video_id=" + pathname.slice(1);
};
export const extractMinify = matchPattern(actionMinify, "*://youtu.be/*");
