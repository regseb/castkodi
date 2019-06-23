/**
 * @module core/scraper/peertube
 */

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une vidéo PeerTube.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://*/videos/watch/*", "*://*/videos/embed/*"
], function ({ href }) {
    const url = href.replace(/^http:/iu, "https:")
                    .replace("videos/watch", "api/v1/videos")
                    .replace("videos/embed", "api/v1/videos");
    return fetch(url).then(function (response) {
        return response.json();
    }).then(function (response) {
        return "files" in response ? response.files[0].fileUrl
                                   : null;
    }).catch(function () {
        return null;
    });
});
