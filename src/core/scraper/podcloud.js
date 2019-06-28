/**
 * @module core/scraper/podcloud
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un son de podCloud.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["*://podcloud.fr/podcast/*/episode/*"], function ({ pathname }) {
    const [, , podcast, , episode] = pathname.split("/");
    return Promise.resolve(`https://podcloud.fr/ext/${podcast}/${episode}` +
                           "/enclosure.mp3");
});
