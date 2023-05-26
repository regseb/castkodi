/**
 * @module
 * @license MIT
 * @see https://www.apple.com/apple-podcasts/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}      _url          L'URL d'un son Apple Podcasts.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const script = doc.querySelector("#shoebox-media-api-cache-amp-podcasts");
    if (null === script) {
        return undefined;
    }
    const json = JSON.parse(Object.values(JSON.parse(script.text))[0]);
    return json.d[0].attributes.assetUrl;
};
export const extract = matchPattern(
    action,
    "https://podcasts.apple.com/*/podcast/*/id*",
);
