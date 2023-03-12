/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Twitch
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import * as labeller from "../labeller/twitch.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Twitch.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.twitch/?mode=play";

/**
 * Génère l'URL d'un <em>live</em> dans l'extension Twitch.
 *
 * @param {string} channelName L'identifiant du <em>live</em> Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateLiveUrl = async function (channelName) {
    return `${PLUGIN_URL}&channel_name=${channelName}`;
};

/**
 * Génère l'URL d'une vidéo dans l'extension Twitch.
 *
 * @param {string} videoId L'identifiant de la vidéo Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateVideoUrl = async function (videoId) {
    return `${PLUGIN_URL}&video_id=${videoId}`;
};

/**
 * Génère l'URL d'un clip dans l'extension Twitch.
 *
 * @param {string} clipId L'identifiant du clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateClipUrl = async function (clipId) {
    return `${PLUGIN_URL}&slug=${clipId}`;
};

/**
 * Extrait le titre d'un <em>live</em>, d'une vidéo ou d'un clip Twitch.
 *
 * @param {URL} url L'URL utilisant le plugin de Twitch.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("channel_name")) {
        return labeller.extractLive(searchParams.get("channel_name"));
    }
    if (searchParams.has("video_id")) {
        return labeller.extractVideo(searchParams.get("video_id"));
    }
    if (searchParams.has("slug")) {
        return labeller.extractClip(searchParams.get("slug"));
    }
    return undefined;
};
export const extract = matchPattern(action, "plugin://plugin.video.twitch/*");
