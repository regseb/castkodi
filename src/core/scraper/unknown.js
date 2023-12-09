/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as plugin from "../plugin/sendtokodi.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Envoi l'URL à un éventuel plugin de Kodi pour qu'il essaie d'en extraire une
 * vidéo ou une musique.
 *
 * @param {URL}      url               L'URL d'une page quelconque.
 * @param {Object}   _metadata         Les métadonnées de l'URL.
 * @param {Function} _metadata.html    La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>undefined</code>.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (url, _metadata, context) {
    // Si on analyse une sous-page : retourner undefined pour indiquer que rien
    // n'a été trouvé sans faire croire qu'une vidéo ou une musique ait été
    // trouvée.
    if (context.depth) {
        return undefined;
    }

    // Si le plugin SendToKodi est installé dans Kodi : lui envoyer l'URL pour
    // qu'il essaie d'en extraire une vidéo ou une musique.
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.sendtokodi")) {
        return await plugin.generateUrl(url);
    }

    return undefined;
};
export const extract = matchPattern(action, "*://*/*");
