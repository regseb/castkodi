/**
 * @module
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une vidéo AlloCiné.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code>.
 */
rules.set(["http://www.allocine.fr/*"], function ({ href }) {
    return fetch(href).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const figure = doc.querySelector("figure[data-model]");
        if (null === figure) {
            return null;
        }

        const model = JSON.parse(figure.dataset.model);
        const source = Object.values(model.videos[0].sources).pop();
        return new URL(source, href).href;
    });
});
