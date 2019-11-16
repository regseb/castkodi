/**
 * @module
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL du <em>live</em> de KCAA Radio.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em>.
 */
rules.set(["http://live.kcaastreaming.com/"], async function ({ href }) {
    const response = await fetch(href);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");

    return doc.querySelector("#show a").href;
});
