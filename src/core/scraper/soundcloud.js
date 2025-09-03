/**
 * @module
 * @license MIT
 * @see https://soundcloud.com/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as soundcloudPlugin from "../plugin/soundcloud.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Répartit une musique SoundCloud à un plugin de Kodi.
 *
 * @param {URL} url L'URL de la musique SoundCloud.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatch = async (url) => {
    const addons = await kodi.addons.getAddons("audio", "video");
    if (addons.some((a) => "plugin.audio.soundcloud" === a.addonid)) {
        return soundcloudPlugin.generateUrl(url);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(url);
    }
    // Envoyer par défaut au plugin SoundCloud.
    return soundcloudPlugin.generateUrl(url);
};

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un son SoundCloud.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = ({ href }) => {
    return dispatch(new URL(href.replace("://mobi.", "://")));
};
export const extract = matchURLPattern(
    action,
    "https://soundcloud.com/*",
    "https://mobi.soundcloud.com/*",
);
