/**
 * @module
 * @license MIT
 * @see https://www.youtube.com/
 * @author Sébastien Règne
 */

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
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchVideo = async (videoId, { incognito }) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.youtube" === a.addonid)) {
        return youtubePlugin.generateVideoUrl(videoId, incognito);
    }
    if (addons.some((a) => "plugin.video.tubed" === a.addonid)) {
        return tubedPlugin.generateVideoUrl(videoId);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
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
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchPlaylist = async (playlistId, { incognito }) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.youtube" === a.addonid)) {
        return await youtubePlugin.generatePlaylistUrl(playlistId, incognito);
    }
    if (addons.some((a) => "plugin.video.tubed" === a.addonid)) {
        return tubedPlugin.generatePlaylistUrl(playlistId);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.youtube.com/playlist?list=${playlistId}`),
        );
    }
    // Envoyer par défaut au plugin YouTube.
    return await youtubePlugin.generatePlaylistUrl(playlistId, incognito);
};

/**
 * Répartit un clip YouTube à un plugin de Kodi.
 *
 * @param {string}  clipId            L'identifiant du clip YouTube.
 * @param {Object}  context           Le contexte du clip.
 * @param {boolean} context.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatchClip = async (clipId, { incognito }) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.youtube" === a.addonid)) {
        return youtubePlugin.generateClipUrl(clipId, incognito);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.youtube.com/clip/${clipId}`),
        );
    }
    // Envoyer par défaut au plugin YouTube.
    return youtubePlugin.generateClipUrl(clipId, incognito);
};

/**
 * Extrait les informations nécessaires pour lire une vidéo / playlist sur Kodi.
 *
 * @param {URL}      url               L'URL d'une vidéo / playlist YouTube (ou
 *                                     Invidious).
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionVideo = async ({ searchParams }, _metadata, { incognito }) => {
    const config = await browser.storage.local.get(["youtube-playlist"]);
    if (
        searchParams.has("list") &&
        ("playlist" === config["youtube-playlist"] || !searchParams.has("v"))
    ) {
        return await dispatchPlaylist(searchParams.get("list"), { incognito });
    }
    if (searchParams.has("v")) {
        return await dispatchVideo(searchParams.get("v"), { incognito });
    }

    return undefined;
};
export const extractVideo = matchPattern(
    actionVideo,
    "*://*.youtube.com/watch*",
    "*://invidio.us/watch*",
);

/**
 * Extrait les informations nécessaires pour lire une playlist sur Kodi.
 *
 * @param {URL}      url               L'URL d'une playlist YouTube.
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionPlaylist = ({ searchParams }, _metadata, { incognito }) => {
    return searchParams.has("list")
        ? dispatchPlaylist(searchParams.get("list"), { incognito })
        : Promise.resolve(undefined);
};
export const extractPlaylist = matchPattern(
    actionPlaylist,
    "*://*.youtube.com/playlist*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo intégrée (un _short_
 * ou depuis une frontale alternative) sur Kodi.
 *
 * @param {URL}      url               L'URL d'une vidéo YouTube intégrée.
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionEmbed = ({ pathname }, _metadata, { incognito }) => {
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
    "*://dev.tube/video/*",
);

/**
 * Extrait les informations nécessaires pour lire un clip sur Kodi.
 *
 * @param {URL}      url               L'URL d'un clip YouTube.
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionClip = ({ pathname }, _metadata, { incognito }) => {
    return dispatchClip(pathname.slice(6), { incognito });
};
export const extractClip = matchPattern(
    actionClip,
    "*://www.youtube.com/clip/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url               L'URL minifiée d'une vidéo YouTube.
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionMinify = ({ pathname }, _metadata, { incognito }) => {
    return dispatchVideo(pathname.slice(1), { incognito });
};
export const extractMinify = matchPattern(actionMinify, "*://youtu.be/*");
