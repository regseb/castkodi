/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Twitch.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.twitch/?mode=play";

/**
 * Extrait les informations nécessaire pour lire un clip sur Kodi.
 *
 * @param {URL} url L'URL d'un clip Twitch.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionClip = async function ({ pathname, searchParams }) {
    if (pathname.startsWith("/embed")) {
        return searchParams.has("clip")
                              ? PLUGIN_URL + "&slug=" + searchParams.get("clip")
                              : null;
    }
    return PLUGIN_URL + "&slug=" + pathname.slice(1);
};
export const extractClip = matchPattern(actionClip, "*://clips.twitch.tv/*");

/**
 * Extrait les informations nécessaire pour lire un <em>live</em> ou une vidéo
 * intégré sur Kodi.
 *
 * @param {URL} url L'URL d'un <em>live</em> ou d'une vidéo intégré.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionEmbed = async function ({ searchParams }) {
    if (searchParams.has("channel")) {
        return PLUGIN_URL + "&channel_name=" + searchParams.get("channel");
    }
    if (searchParams.has("video")) {
        return PLUGIN_URL + "&video_id=" + searchParams.get("video");
    }
    return null;
};
export const extractEmbed = matchPattern(actionEmbed, "*://player.twitch.tv/*");

/**
 * Extrait les informations nécessaire pour lire un <em>live</em> ou un clip sur
 * Kodi.
 *
 * @param {URL} url L'URL d'un <em>live</em> ou d'un clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ pathname }) {
    if (pathname.startsWith("/videos/")) {
        return PLUGIN_URL + "&video_id=" + pathname.slice(8);
    }
    if (pathname.includes("/clip/")) {
        return PLUGIN_URL + "&slug=" +
                                  pathname.slice(pathname.lastIndexOf("/") + 1);
    }
    if (pathname.startsWith("/moderator/")) {
        return PLUGIN_URL + "&channel_name=" + pathname.slice(11);
    }
    return PLUGIN_URL + "&channel_name=" + pathname.slice(1);
};
export const extract = matchPattern(action,
    "*://www.twitch.tv/*",
    "*://go.twitch.tv/*",
    "*://m.twitch.tv/*");
