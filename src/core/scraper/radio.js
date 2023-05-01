/**
 * @module
 * @license MIT
 * @see https://www.radio.net/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une radio sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une radio de Radio.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function (_url, content) {
    const doc = await content.html();
    const script = doc.querySelector("script#__NEXT_DATA__");
    const json = JSON.parse(script.text);
    return json.props.pageProps.data.broadcast?.streams[0].url;
};
export const extract = matchPattern(
    action,
    // Liste des noms de domaines récupérés sur la page
    // https://www.radio.net/country-selector.
    "*://*.radio.net/s/*",
    "*://www.radio.dk/s/*",
    "*://www.radio.de/s/*",
    "*://www.radio.es/s/*",
    "*://www.radio.fr/s/*",
    "*://www.radio.it/s/*",
    "*://www.radio.pl/s/*",
    "*://www.radio.pt/s/*",
    "*://www.radio.se/s/*",
    "*://www.radio.at/s/*",
);
