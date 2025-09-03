/**
 * @module
 * @license MIT
 * @see https://www.twitch.tv/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as twitchPlugin from "../plugin/twitch.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Répartit un _live_ Twitch à un plugin de Kodi.
 *
 * @param {string} channelName L'identifiant du _live_ Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchLive = async (channelName) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.twitch" === a.addonid)) {
        return twitchPlugin.generateLiveUrl(channelName);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.twitch.tv/${channelName}`),
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
const dispatchVideo = async (videoId) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.twitch" === a.addonid)) {
        return twitchPlugin.generateVideoUrl(videoId);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.twitch.tv/videos/${videoId}`),
        );
    }
    // Envoyer par défaut au plugin Twitch.
    return twitchPlugin.generateVideoUrl(videoId);
};

/**
 * Répartit un clip Twitch à un plugin de Kodi.
 *
 * @param {string} slug L'identifiant du clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchClip = async (slug) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.twitch" === a.addonid)) {
        return twitchPlugin.generateClipUrl(slug);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://clips.twitch.tv/${slug}`),
        );
    }
    // Envoyer par défaut au plugin Twitch.
    return twitchPlugin.generateClipUrl(slug);
};

/**
 * Extrait les informations nécessaires pour lire un clip sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un clip Twitch.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionClip = ({ pathname, searchParams }) => {
    if ("/embed" === pathname) {
        return searchParams.has("clip")
            ? dispatchClip(searchParams.get("clip"))
            : Promise.resolve(undefined);
    }
    return dispatchClip(pathname.slice(1));
};
export const extractClip = matchURLPattern(
    actionClip,
    "https://clips.twitch.tv/*",
);

/**
 * Extrait les informations nécessaires pour lire un _live_ ou une vidéo
 * intégrée sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un _live_ ou d'une vidéo intégré.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionEmbed = ({ searchParams }) => {
    if (searchParams.has("channel")) {
        return dispatchLive(searchParams.get("channel"));
    }
    if (searchParams.has("video")) {
        return dispatchVideo(searchParams.get("video"));
    }
    return Promise.resolve(undefined);
};
export const extractEmbed = matchURLPattern(
    actionEmbed,
    "https://player.twitch.tv/*",
);

/**
 * Extrait les informations nécessaires pour lire un _live_ ou un clip
 * sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un _live_ ou d'un clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = ({ pathname }) => {
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
export const extract = matchURLPattern(
    action,
    "https://www.twitch.tv/*",
    "https://go.twitch.tv/*",
    "https://m.twitch.tv/*",
);
