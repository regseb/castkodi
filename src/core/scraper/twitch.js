/**
 * @module
 */
/* eslint-disable require-await */

import * as plugin from "../plugin/twitch.js";
import { matchPattern } from "../tools/matchpattern.js";

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
                              ? plugin.generateClipUrl(searchParams.get("clip"))
                              : null;
    }
    return plugin.generateClipUrl(pathname.slice(1));
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
        return plugin.generateLiveUrl(searchParams.get("channel"));
    }
    if (searchParams.has("video")) {
        return plugin.generateVideoUrl(searchParams.get("video"));
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
        return plugin.generateVideoUrl(pathname.slice(8));
    }
    if (pathname.includes("/clip/")) {
        return plugin.generateClipUrl(
            pathname.slice(pathname.lastIndexOf("/") + 1),
        );
    }
    if (pathname.startsWith("/moderator/")) {
        return plugin.generateLiveUrl(pathname.slice(11));
    }
    return plugin.generateLiveUrl(pathname.slice(1));
};
export const extract = matchPattern(action,
    "*://www.twitch.tv/*",
    "*://go.twitch.tv/*",
    "*://m.twitch.tv/*");
