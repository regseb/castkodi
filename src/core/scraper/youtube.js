/**
 * @module
 * @license MIT
 * @see https://www.youtube.com/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as invidiousPlugin from "../plugin/invidious.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as tubedPlugin from "../plugin/tubed.js";
import * as youtubePlugin from "../plugin/youtube.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

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
    if (
        addons.some(
            (a) =>
                "plugin.video.invidious" === a.addonid && "lekma" === a.author,
        )
    ) {
        return invidiousPlugin.generateUrl(videoId);
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
 * @param {URLMatch} url               L'URL d'une vidéo / playlist YouTube.
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
export const extractVideo = matchURLPattern(
    actionVideo,
    "https://*.youtube.com/watch",
    "https://youtube.com/watch",
    "https://www.youtubekids.com/watch",
);

/**
 * Extrait les informations nécessaires pour lire une playlist sur Kodi.
 *
 * @param {URLMatch} url               L'URL d'une playlist YouTube.
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
export const extractPlaylist = matchURLPattern(
    actionPlaylist,
    "https://*.youtube.com/playlist",
    "https://youtube.com/playlist",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo intégrée, un
 * _short_, une URL minifiée ou depuis une frontale alternative sur Kodi.
 *
 * @param {URLMatch} urlMatch          L'URL d'une vidéo YouTube avec
 *                                     l'identifiant de la vidéo.
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionEmbed = ({ videoId }, _metadata, { incognito }) => {
    return dispatchVideo(videoId, { incognito });
};
export const extractEmbed = matchURLPattern(
    actionEmbed,
    "https://www.youtube.com/embed/:videoId",
    "https://www.youtube-nocookie.com/embed/:videoId",
    "https://*.youtube.com/shorts/:videoId",
    "https://youtube.com/shorts/:videoId",
    "https://youtu.be/:videoId",
    "https://dev.tube/video/:videoId",
);

/**
 * Extrait les informations nécessaires pour lire un clip sur Kodi.
 *
 * @param {URLMatch} urlMatch          L'URL d'un clip YouTube avec
 *                                     l'identifiant du clip.
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionClip = ({ clipId }, _metadata, { incognito }) => {
    return dispatchClip(clipId, { incognito });
};
export const extractClip = matchURLPattern(
    actionClip,
    "https://www.youtube.com/clip/:clipId",
);
