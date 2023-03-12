/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:YouTube
 * @see https://kodi.wiki/view/Add-on:Tubed
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import { kodi } from "../jsonrpc/kodi.js";
import * as labeller from "../labeller/youtube.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'extension <em>YouTube</em> pour lire des vidéos issues de YouTube.
 *
 * @type {string}
 */
const YOUTUBE_PLUGIN_URL = "plugin://plugin.video.youtube/play/";

/**
 * L'URL de l'extension <em>Tubed</em> pour lire des vidéos issues de YouTube.
 *
 * @type {string}
 */
const TUBED_PLUGIN_URL = "plugin://plugin.video.tubed/?mode=play";

/**
 * Génère l'URL d'une vidéo dans l'extension YouTube ou Tubed.
 *
 * @param {string}  videoId   L'identifiant de la vidéo YouTube.
 * @param {boolean} incognito La marque indiquant s'il faut lire la vidéo en
 *                            navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateVideoUrl = async function (videoId, incognito) {
    const addons = await kodi.addons.getAddons("video");
    // Si les deux extensions YouTube et Tubed sont présentes ou si aucune est
    // présente : envoyer les vidéos à YouTube ; sinon envoyer à l'extension
    // présente.
    if (
        addons.includes("plugin.video.tubed") &&
        !addons.includes("plugin.video.youtube")
    ) {
        return `${TUBED_PLUGIN_URL}&video_id=${videoId}`;
    }

    return (
        YOUTUBE_PLUGIN_URL +
        `?video_id=${videoId}&incognito=${incognito.toString()}`
    );
};

/**
 * Génère l'URL d'une playlist dans l'extension YouTube ou Tubed.
 *
 * @param {string}  playlistId L'identifiant de la playlist YouTube.
 * @param {boolean} incognito  La marque indiquant s'il faut lire la playlist en
 *                             navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generatePlaylistUrl = async function (playlistId, incognito) {
    const addons = await kodi.addons.getAddons("video");
    // Si les deux extensions YouTube et Tubed sont présentes ou si aucune est
    // présente : envoyer les vidéos à YouTube ; sinon envoyer à l'extension
    // présente.
    if (
        addons.includes("plugin.video.tubed") &&
        !addons.includes("plugin.video.youtube")
    ) {
        return `${TUBED_PLUGIN_URL}&playlist_id=${playlistId}`;
    }

    const config = await browser.storage.local.get(["youtube-order"]);
    return (
        YOUTUBE_PLUGIN_URL +
        `?playlist_id=${playlistId}&order=${config["youtube-order"]}&play=1` +
        `&incognito=${incognito.toString()}`
    );
};

/**
 * Extrait le titre d'une vidéo ou d'une playlist YouTube.
 *
 * @param {URL} url L'URL utilisant le plugin de YouTube ou Tubed.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("video_id")) {
        return labeller.extractVideo(searchParams.get("video_id"));
    }
    if (searchParams.has("playlist_id")) {
        return labeller.extractPlaylist(searchParams.get("playlist_id"));
    }
    return undefined;
};
export const extract = matchPattern(
    action,
    "plugin://plugin.video.youtube/play/*",
    "plugin://plugin.video.tubed/*",
);
