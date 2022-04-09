/**
 * @module
 */
/* eslint-disable require-await */

import * as plugin from "../plugin/youtube.js";
import { matchPattern } from "../tools/matchpattern.js";

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
    if (searchParams.has("list") &&
            ("playlist" === config["youtube-playlist"] ||
             !searchParams.has("v"))) {
        return plugin.generatePlaylistUrl(searchParams.get("list"), incognito);
    }
    if (searchParams.has("v")) {
        return plugin.generateVideoUrl(searchParams.get("v"), incognito);
    }

    return undefined;
};
export const extractVideo = matchPattern(actionVideo,
    "*://*.youtube.com/watch*",
    "*://invidio.us/watch*",
    "*://hooktube.com/watch*");

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
const actionPlaylist = async function ({ searchParams },
                                       _content,
                                       { incognito }) {
    return searchParams.has("list")
               ? plugin.generatePlaylistUrl(searchParams.get("list"), incognito)
               : undefined;
};
export const extractPlaylist = matchPattern(actionPlaylist,
    "*://*.youtube.com/playlist*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}     url               L'URL d'une vidéo YouTube intégrée (ou
 *                                    Invidious / HookTube).
 * @param {Object}  _content          Le contenu de l'URL.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionEmbed = async function ({ pathname }, _content, { incognito }) {
    return plugin.generateVideoUrl(pathname.slice(7), incognito);
};
export const extractEmbed = matchPattern(actionEmbed,
    "*://www.youtube.com/embed/*",
    "*://www.youtube-nocookie.com/embed/*",
    "*://invidio.us/embed/*",
    "*://hooktube.com/embed/*");

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
    return plugin.generateVideoUrl(pathname.slice(1), incognito);
};
export const extractMinify = matchPattern(actionMinify, "*://youtu.be/*");
