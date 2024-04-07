/**
 * @module
 * @license MIT
 * @see https://www.primevideo.com/
 * @author Sébastien Règne
 */

import * as primevideoPlugin from "../plugin/primevideo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo Prime Video (Amazon).
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const script = doc.querySelector('#a-page > script[type="text/template"]');
    if (null === script) {
        return undefined;
    }
    const json = JSON.parse(script.text);
    const id = json.props.body[0].args.titleID;
    const title = json.props.metadata.pageTitle.slice(13);
    return primevideoPlugin.generateUrl(id, title);
};
export const extract = matchPattern(
    action,
    "https://www.primevideo.com/detail/*",
    "https://www.primevideo.com/region/*/detail/*",
);
