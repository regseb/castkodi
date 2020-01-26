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
 * @param {URL}          url               L'URL d'une vidéo / playlist YouTube
 *                                         (ou Invidious / HookTube).
 * @param {HTMLDocument} _doc              Le contenu HTML de la page.
 * @param {object}       options           Les options de l'extraction.
 * @param {boolean}      options.incognito La marque indiquant si l'utilisateur
 *                                         est en navigation privée.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionVideo = async function ({ searchParams }, _doc, { incognito }) {
    const config = await browser.storage.local.get(["youtube-playlist"]);
    if (searchParams.has("list") &&
            ("playlist" === config["youtube-playlist"] ||
             !searchParams.has("v"))) {
        return PLUGIN_URL + "?playlist_id=" + searchParams.get("list") +
                            "&incognito=" + incognito.toString();
    }
    if (searchParams.has("v")) {
        return PLUGIN_URL + "?video_id=" + searchParams.get("v") +
                            "&incognito=" + incognito.toString();
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
 * @param {URL}          url               L'URL d'une playlist YouTube.
 * @param {HTMLDocument} _doc              Le contenu HTML de la page.
 * @param {object}       options           Les options de l'extraction.
 * @param {boolean}      options.incognito La marque indiquant si l'utilisateur
 *                                         est en navigation privée.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionPlaylist = async function ({ searchParams }, _doc, { incognito }) {
    return searchParams.has("list")
                     ? PLUGIN_URL + "?playlist_id=" + searchParams.get("list") +
                                    "&incognito=" + incognito.toString()
                     : null;
};
export const extractPlaylist = matchPattern(actionPlaylist,
    "*://*.youtube.com/playlist*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}          url               L'URL d'une vidéo YouTube intégrée
 *                                         (ou Invidious / HookTube).
 * @param {HTMLDocument} _doc              Le contenu HTML de la page.
 * @param {object}       options           Les options de l'extraction.
 * @param {boolean}      options.incognito La marque indiquant si l'utilisateur
 *                                         est en navigation privée.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const actionEmbed = async function ({ pathname }, _doc, { incognito }) {
    return PLUGIN_URL + "?video_id=" + pathname.slice(7) +
                        "&incognito=" + incognito.toString();
};
export const extractEmbed = matchPattern(actionEmbed,
    "*://www.youtube.com/embed/*",
    "*://www.youtube-nocookie.com/embed/*",
    "*://invidio.us/embed/*",
    "*://hooktube.com/embed/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}          url               L'URL minifiée d'une vidéo YouTube.
 * @param {HTMLDocument} _doc              Le contenu HTML de la page.
 * @param {object}       options           Les options de l'extraction.
 * @param {boolean}      options.incognito La marque indiquant si l'utilisateur
 *                                         est en navigation privée.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const actionMinify = async function ({ pathname }, _doc, { incognito }) {
    return PLUGIN_URL + "?video_id=" + pathname.slice(1) +
                        "&incognito=" + incognito.toString();
};
export const extractMinify = matchPattern(actionMinify, "*://youtu.be/*");
