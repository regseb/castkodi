/**
 * @module
 */

/**
 * La liste des types pouvant contenir des URLs de son ou de vidéo.
 *
 * @constant {Array<string>}
 */
const TYPES = ["AudioObject", "MusicVideoObject", "VideoObject"];

/**
 * Le sélecteur retournant les scripts contenant des microdonnées.
 *
 * @constant {string}
 */
const SELECTOR = `script[type="application/ld+json"]`;

/**
 * Extrait récursivement les propriétés de type objet d'un objet JSON.
 *
 * @param {object} root Un objet JSON.
 * @returns {Array<object>} La liste des objets extraits.
 */
const walk = function (root) {
    return [root, ...Object.values(root)
                           .filter((p) => null !== p &&
                                          "object" === typeof p &&
                                          !Array.isArray(p))
                           .map(walk)
                           .flat()];
};

/**
 * Extrait les informations nécessaire pour lire un média sur Kodi.
 *
 * @function action
 * @param {HTMLDocument} doc Le contenu HTML d'une page quelconque.
 * @returns {?string} L'URL du <em>fichier</em> ou <code>null</code>.
 */
export const action = function (doc) {
    for (const script of doc.querySelectorAll(SELECTOR)) {
        try {
            for (const property of walk(JSON.parse(script.text))) {
                if (TYPES.includes(property["@type"]) &&
                        "contentUrl" in property) {
                    return property.contentUrl;
                }
            }
        } catch {
            // Ignorer les microdonnées ayant un JSON invalide.
        }
    }
    return null;
};
