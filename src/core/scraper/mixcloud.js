/**
 * @module
 * @license MIT
 * @see https://www.mixcloud.com/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as mixcloudPlugin from "../plugin/mixcloud.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Répartit une musique Mixcloud à un plugin de Kodi.
 *
 * @param {string} path Le chemin (artiste / musique) de la musique Mixcloud.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatch = async (path) => {
    const addons = await kodi.addons.getAddons("audio", "video");
    if (addons.some((a) => "plugin.audio.mixcloud" === a.addonid)) {
        return mixcloudPlugin.generateUrl(path);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.mixcloud.com${path}`),
        );
    }
    // Envoyer par défaut au plugin Mixcloud.
    return mixcloudPlugin.generateUrl(path);
};

/**
 * Extrait les informations nécessaires pour lire une musique sur Kodi.
 *
 * @param {URLMatch} url L'URL d'une musique Mixcloud.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = ({ pathname }) => {
    return pathname.startsWith("/discover/")
        ? Promise.resolve(undefined)
        : dispatch(pathname);
};
export const extract = matchURLPattern(action, "https://www.mixcloud.com/*/*/");
