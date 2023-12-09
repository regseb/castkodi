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
 * Répartit un <em>live</em> Twitch à un plugin de Kodi.
 *
 * @param {string} channelName L'identifiant du <em>live</em> Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatchLive = async function (channelName) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.twitch")) {
        return await twitchPlugin.generateLiveUrl(channelName);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return await sendtokodiPlugin.generateUrl(
            new URL(`https://www.twitch.com/${channelName}`),
        );
    }
    // Envoyer par défaut au plugin Twitch.
    return await twitchPlugin.generateLiveUrl(channelName);
};

/**
 * Répartit une vidéo Twitch à un plugin de Kodi.
 *
 * @param {string} videoId L'identifiant de la vidéo Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatchVideo = async function (videoId) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.twitch")) {
        return await twitchPlugin.generateVideoUrl(videoId);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return await sendtokodiPlugin.generateUrl(
            new URL(`https://www.twitch.com/videos/${videoId}`),
        );
    }
    // Envoyer par défaut au plugin Twitch.
    return await twitchPlugin.generateVideoUrl(videoId);
};

/**
 * Répartit un clip Twitch à un plugin de Kodi.
 *
 * @param {string} clipId L'identifiant du clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatchClip = async function (clipId) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.twitch")) {
        return await twitchPlugin.generateClipUrl(clipId);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return await sendtokodiPlugin.generateUrl(
            new URL(`https://www.twitch.com/clip/${clipId}`),
        );
    }
    // Envoyer par défaut au plugin Twitch.
    return await twitchPlugin.generateClipUrl(clipId);
};

/**
 * Extrait les informations nécessaires pour lire un clip sur Kodi.
 *
 * @param {URL} url L'URL d'un clip Twitch.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
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
 * Extrait les informations nécessaires pour lire un <em>live</em> ou une vidéo
 * intégré sur Kodi.
 *
 * @param {URL} url L'URL d'un <em>live</em> ou d'une vidéo intégré.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
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
 * Extrait les informations nécessaires pour lire un <em>live</em> ou un clip
 * sur Kodi.
 *
 * @param {URL} url L'URL d'un <em>live</em> ou d'un clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
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
