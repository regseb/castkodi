/**
 * @module
 */

/**
 * L'expression rationnelle pour extraire les données de la radio.
 *
 * @constant {RegExp}
 */
const URL_REGEXP = /^ *station: *(\{.+\}),$/mu;

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une radio sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une radio de Radio.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set([
    "*://*.radio.net/s/*",  "*://www.radio.de/s/*", "*://www.radio.at/s/*",
    "*://www.radio.fr/s/*", "*://www.radio.pt/s/*", "*://www.radio.es/s/*",
    "*://www.radio.dk/s/*", "*://www.radio.se/s/*", "*://www.radio.it/s/*",
    "*://www.radio.pl/s/*"
], async function ({ href }) {
    const response = await fetch(href);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = URL_REGEXP.exec(script.text);
        if (null === result) {
            continue;
        }
        return JSON.parse(result[1]).streamUrls[0].streamUrl;
    }
    return null;
});
