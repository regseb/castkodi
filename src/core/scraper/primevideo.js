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
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    const script = doc.querySelector('#a-page > script[type="text/template"]');
    if (null === script) {
        return undefined;
    }
    const json = JSON.parse(script.text);
    const body = json.props.body[0];
    const details = body.props.atf.state.detail.headerDetail[body.args.titleID];
    return primevideoPlugin.generateUrl(details.catalogId, details.title);
};
export const extract = matchPattern(
    action,
    "https://www.primevideo.com/detail/*",
    "https://www.primevideo.com/region/*/detail/*",
    "https://www.amazon.com/gp/video/detail/*",
    "https://www.amazon.co.uk/gp/video/detail/*",
    "https://www.amazon.de/gp/video/detail/*",
    "https://www.amazon.de/-/*/gp/video/detail/*",
    "https://www.amazon.co.jp/gp/video/detail/*",
    "https://www.amazon.co.jp/-/*/gp/video/detail/*",
);
