/**
 * @module
 * @license MIT
 * @see https://www.vrt.be/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as vrtnuPlugin from "../plugin/vrtnu.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Répartit une vidéo VRT NU à un plugin de Kodi.
 *
 * @param {URL} url L'URL de la vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatch = async function (url) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.vrt.nu")) {
        return await vrtnuPlugin.generateUrl(url);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return await sendtokodiPlugin.generateUrl(url);
    }
    // Envoyer par défaut au plugin VRT NU.
    return await vrtnuPlugin.generateUrl(url);
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = function (url) {
    return dispatch(url);
};
export const extract = matchPattern(
    action,
    "*://www.vrt.be/vrtnu/a-z/*",
    "*://vrt.be/vrtnu/a-z/*",
    "*://vrtnu.page.link/*",
);
