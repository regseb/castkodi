/**
 * @module
 * @license MIT
 * @see https://www.twitch.tv/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as twitchPlugin from "../plugin/twitch.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Répartit un _live_ Twitch à un plugin de Kodi.
 *
 * @param {string} channelName L'identifiant du _live_ Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchLive = async function (channelName) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.twitch")) {
        return twitchPlugin.generateLiveUrl(channelName);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.twitch.com/${channelName}`),
        );
    }
    // Envoyer par défaut au plugin Twitch.
    return twitchPlugin.generateLiveUrl(channelName);
};

/**
 * Répartit une vidéo Twitch à un plugin de Kodi.
 *
 * @param {string} videoId L'identifiant de la vidéo Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchVideo = async function (videoId) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.twitch")) {
        return twitchPlugin.generateVideoUrl(videoId);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.twitch.com/videos/${videoId}`),
        );
    }
    // Envoyer par défaut au plugin Twitch.
    return twitchPlugin.generateVideoUrl(videoId);
};

/**
 * Répartit un clip Twitch à un plugin de Kodi.
 *
 * @param {string} clipId L'identifiant du clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchClip = async function (clipId) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.twitch")) {
        return twitchPlugin.generateClipUrl(clipId);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.twitch.com/clip/${clipId}`),
        );
    }
    // Envoyer par défaut au plugin Twitch.
    return twitchPlugin.generateClipUrl(clipId);
};

/**
 * Extrait les informations nécessaires pour lire un clip sur Kodi.
 *
 * @param {URL} url L'URL d'un clip Twitch.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionClip = function ({ pathname, searchParams }) {
    if ("/embed" === pathname) {
        return searchParams.has("clip")
            ? dispatchClip(searchParams.get("clip"))
            : Promise.resolve(undefined);
    }
    return dispatchClip(pathname.slice(1));
};
export const extractClip = matchPattern(actionClip, "*://clips.twitch.tv/*");

/**
 * Extrait les informations nécessaires pour lire un _live_ ou une vidéo
 * intégrée sur Kodi.
 *
 * @param {URL} url L'URL d'un _live_ ou d'une vidéo intégré.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionEmbed = function ({ searchParams }) {
    if (searchParams.has("channel")) {
        return dispatchLive(searchParams.get("channel"));
    }
    if (searchParams.has("video")) {
        return dispatchVideo(searchParams.get("video"));
    }
    return Promise.resolve(undefined);
};
export const extractEmbed = matchPattern(actionEmbed, "*://player.twitch.tv/*");

/**
 * Extrait les informations nécessaires pour lire un _live_ ou un clip
 * sur Kodi.
 *
 * @param {URL} url L'URL d'un _live_ ou d'un clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = function ({ pathname }) {
    if (pathname.startsWith("/videos/")) {
        return dispatchVideo(pathname.slice(8));
    }
    if (pathname.includes("/clip/")) {
        return dispatchClip(pathname.slice(pathname.lastIndexOf("/") + 1));
    }
    if (pathname.startsWith("/moderator/")) {
        return dispatchLive(pathname.slice(11));
    }
    return dispatchLive(pathname.slice(1));
};
export const extract = matchPattern(
    action,
    "*://www.twitch.tv/*",
    "*://go.twitch.tv/*",
    "*://m.twitch.tv/*",
);
