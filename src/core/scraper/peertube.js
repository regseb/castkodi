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
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une vidéo PeerTube.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set([
    "*://*/videos/watch/*", "*://*/videos/embed/*"
], function ({ href }) {
    const url = href.replace(/^http:/iu, "https:")
                    .replace("videos/watch", "api/v1/videos")
                    .replace("videos/embed", "api/v1/videos");
    return fetch(url).then((r) => r.json())
                     .then((data) => {
        return "files" in data ? data.files[0].fileUrl
                               : null;
    // Si le site n'est pas une instance PeerTube, l'appel à l'API échoue.
    }).catch(() => null);
});
