/**
 * @module
 * @license MIT
 * @see https://www.vrt.be/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as vrtnuPlugin from "../plugin/vrtnu.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Répartit une vidéo VRT NU à un plugin de Kodi.
 *
 * @param {URL} url L'URL de la vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatch = async (url) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.vrt.nu" === a.addonid)) {
        return vrtnuPlugin.generateUrl(url);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(url);
    }
    // Envoyer par défaut au plugin VRT NU.
    return vrtnuPlugin.generateUrl(url);
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url L'URL d'une vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = (url) => {
    return dispatch(url);
};
export const extract = matchURLPattern(
    action,
    "https://www.vrt.be/vrtnu/a-z/*",
    "https://vrt.be/vrtnu/a-z/*",
    "https://vrtnu.page.link/*",
);
