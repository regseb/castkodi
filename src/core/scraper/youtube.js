/**
 * @module
 * @license MIT
 * @see https://www.youtube.com/
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as tubedPlugin from "../plugin/tubed.js";
import * as youtubePlugin from "../plugin/youtube.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Répartit une vidéo YouTube à un plugin de Kodi.
 *
 * @param {string}  videoId           L'identifiant de la vidéo YouTube.
 * @param {Object}  context           Le contexte de la vidéo.
 * @param {boolean} context.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatchVideo = async function (videoId, { incognito }) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.youtube")) {
        return youtubePlugin.generateVideoUrl(videoId, incognito);
    }
    if (addons.has("plugin.video.tubed")) {
        return tubedPlugin.generateVideoUrl(videoId);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.youtube.com/watch?v=${videoId}`),
        );
    }
    // Envoyer par défaut au plugin YouTube.
    return youtubePlugin.generateVideoUrl(videoId, incognito);
};

/**
 * Répartit une playlist YouTube à un plugin de Kodi.
 *
 * @param {string}  playlistId        L'identifiant de la playlist YouTube.
 * @param {Object}  context           Le contexte de la playlist.
 * @param {boolean} context.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatchPlaylist = async function (playlistId, { incognito }) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.youtube")) {
        return youtubePlugin.generatePlaylistUrl(playlistId, incognito);
    }
    if (addons.has("plugin.video.tubed")) {
        return tubedPlugin.generatePlaylistUrl(playlistId);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.youtube.com/playlist?list=${playlistId}`),
        );
    }
    // Envoyer par défaut au plugin YouTube.
    return youtubePlugin.generatePlaylistUrl(playlistId, incognito);
};

/**
 * Extrait les informations nécessaire pour lire une vidéo / playlist sur Kodi.
 *
 * @param {URL}     url               L'URL d'une vidéo / playlist YouTube (ou
 *                                    Invidious / HookTube).
 * @param {Object}  _content          Le contenu de l'URL.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionVideo = async function ({ searchParams }, _content, { incognito }) {
    const config = await browser.storage.local.get(["youtube-playlist"]);
    if (
        searchParams.has("list") &&
        ("playlist" === config["youtube-playlist"] || !searchParams.has("v"))
    ) {
        return dispatchPlaylist(searchParams.get("list"), { incognito });
    }
    if (searchParams.has("v")) {
        return dispatchVideo(searchParams.get("v"), { incognito });
    }

    return undefined;
};
export const extractVideo = matchPattern(
    actionVideo,
    "*://*.youtube.com/watch*",
    "*://invidio.us/watch*",
    "*://hooktube.com/watch*",
);

/**
 * Extrait les informations nécessaire pour lire une playlist sur Kodi.
 *
 * @param {URL}     url               L'URL d'une playlist YouTube.
 * @param {Object}  _content          Le contenu de l'URL.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionPlaylist = async function (
    { searchParams },
    _content,
    { incognito },
) {
    return searchParams.has("list")
        ? dispatchPlaylist(searchParams.get("list"), { incognito })
        : undefined;
};
export const extractPlaylist = matchPattern(
    actionPlaylist,
    "*://*.youtube.com/playlist*",
);

/**
 * Extrait les informations nécessaire pour lire une vidéo intégrée (un
 * <em>short</em> ou depuis un frontale alternatif) sur Kodi.
 *
 * @param {URL}     url               L'URL d'une vidéo YouTube intégrée.
 * @param {Object}  _content          Le contenu de l'URL.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionEmbed = async function ({ pathname }, _content, { incognito }) {
    return dispatchVideo(pathname.slice(pathname.indexOf("/", 1) + 1), {
        incognito,
    });
};
export const extractEmbed = matchPattern(
    actionEmbed,
    "*://www.youtube.com/embed/*",
    "*://www.youtube-nocookie.com/embed/*",
    "*://*.youtube.com/shorts/*",
    "*://youtube.com/shorts/*",
    "*://invidio.us/embed/*",
    "*://hooktube.com/embed/*",
    "*://dev.tube/video/*",
);

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}     url               L'URL minifiée d'une vidéo YouTube.
 * @param {Object}  _content          Le contenu de l'URL.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMinify = async function ({ pathname }, _content, { incognito }) {
    return dispatchVideo(pathname.slice(1), { incognito });
};
export const extractMinify = matchPattern(actionMinify, "*://youtu.be/*");
