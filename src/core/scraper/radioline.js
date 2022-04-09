/**
 * @module
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Radioline pour obtenir l'URL de la musique.
 *
 * @type {string}
 */
const API_URL = "https://www.radioline.co/Pillow";

/**
 * Extrait les informations nécessaire pour lire une musique sur Kodi.
 *
 * @param {URL} url L'URL d'une musique Radioline.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ hash }) {
    // Si l'URL n'a pas de hash.
    if ("" === hash)  {
        return undefined;
    }

    const key = hash.slice(1).replaceAll("-", "_");
    const response = await fetch(`${API_URL}/${key}/play`);
    const json = await response.json();
    return "error" === json.body.type ? undefined
                                      : json.body.content.streams[0].url;
};
export const extract = matchPattern(action, "*://*.radioline.co/*");
