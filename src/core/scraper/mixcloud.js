/**
 * @module
 * @license MIT
 * @see https://www.mixcloud.com/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as mixcloudPlugin from "../plugin/mixcloud.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Répartit une musique Mixcloud à un plugin de Kodi.
 *
 * @param {string} path Le chemin (artiste / musique) de la musique Mixcloud.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatch = async function (path) {
    const addons = new Set(await kodi.addons.getAddons("audio", "video"));
    if (addons.has("plugin.audio.mixcloud")) {
        return await mixcloudPlugin.generateUrl(path);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return await sendtokodiPlugin.generateUrl(
            new URL(`https://www.mixcloud.com${path}`),
        );
    }
    // Envoyer par défaut au plugin Mixcloud.
    return await mixcloudPlugin.generateUrl(path);
};

/**
 * Extrait les informations nécessaires pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'une musique Mixcloud.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = function ({ pathname }) {
    return pathname.startsWith("/discover/")
        ? Promise.resolve(undefined)
        : dispatch(pathname);
};
export const extract = matchPattern(action, "*://www.mixcloud.com/*/*/");
