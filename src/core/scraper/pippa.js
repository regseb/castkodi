/**
 * @module
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<string, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'un son Pippa.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set("*://shows.pippa.io/*/*", function ({ href }) {
    return fetch(href).then((r) => r.text())
                      .then((data) => {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const meta = doc.head.querySelector(`meta[property="og:audio"]`);
        return null === meta ? null
                             : meta.content;
    });
});
