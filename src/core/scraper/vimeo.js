/**
 * @module
 * @license MIT
 * @see https://vimeo.com/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as vimeoPlugin from "../plugin/vimeo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Répartit une vidéo Vimeo à un plugin de Kodi.
 *
 * @param {string}           videoId L'identifiant de la vidéo Vimeo.
 * @param {string|undefined} hash    L'éventuel _hash_ pour accéder à une vidéo
 *                                   non-listée.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatch = async (videoId, hash) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.vimeo" === a.addonid)) {
        return vimeoPlugin.generateUrl(videoId, hash);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(
                `https://vimeo.com/${videoId}` +
                    (undefined === hash ? "" : `/${hash}`),
            ),
        );
    }
    // Envoyer par défaut au plugin Vimeo.
    return vimeoPlugin.generateUrl(videoId, hash);
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi. Seules les
 * URLs des vidéos intégrées sont gérées, car pour les URLs vers les vidéos : le
 * scraper _opengraph_ va extrait l'URL de la vidéo intégrée depuis la
 * méta-donnée `og:video:secure_url`.
 *
 * @param {URL} url L'URL d'une vidéo Vimeo intégrée.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = ({ pathname, searchParams }) => {
    return dispatch(pathname.slice(7), searchParams.get("h") ?? undefined);
};
export const extract = matchPattern(action, "*://player.vimeo.com/video/*");
