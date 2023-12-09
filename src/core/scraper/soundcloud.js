/**
 * @module
 * @license MIT
 * @see https://soundcloud.com/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as soundcloudPlugin from "../plugin/soundcloud.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL} url L'URL d'un son SoundCloud.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
/**
 * Répartit une musique SoundCloud à un plugin de Kodi.
 *
 * @param {URL} url L'URL de la musique SoundCloud.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatch = async function (url) {
    const addons = new Set(await kodi.addons.getAddons("audio", "video"));
    if (addons.has("plugin.audio.soundcloud")) {
        return await soundcloudPlugin.generateUrl(url);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return await sendtokodiPlugin.generateUrl(url);
    }
    // Envoyer par défaut au plugin SoundCloud.
    return await soundcloudPlugin.generateUrl(url);
};

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL} url L'URL d'un son SoundCloud.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = function ({ href }) {
    return dispatch(new URL(href.replace("://mobi.", "://")));
};
export const extract = matchPattern(
    action,
    "*://soundcloud.com/*",
    "*://mobi.soundcloud.com/*",
);
