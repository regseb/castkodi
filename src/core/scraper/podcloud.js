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
 * @param {URL}    url          L'URL d'un son podCloud.
 * @param {string} url.pathname Le chemin de l'URL.
 * @returns {string} Le lien du <em>fichier</em>.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em>.
 */
rules.set([
    "*://podcloud.fr/podcast/*/episode/*"
], async function ({ pathname }) {
    const parts = pathname.split("/");
    const podcast = parts[2];
    const episode = parts[4];
    return `https://podcloud.fr/ext/${podcast}/${episode}/enclosure.mp3`;
});
