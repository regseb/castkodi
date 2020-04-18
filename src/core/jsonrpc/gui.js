/**
 * @module
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>GUI</em> de Kodi.
 *
 * @see {@link https://kodi.wiki/view/JSON-RPC_API}
 */
export const GUI = class {

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>GUI/em>.
     *
     * @param {object}   kodi      Le client pour contacter Kodi.
     * @param {Function} kodi.send La méthode pour envoyer une requête.
     */
    constructor(kodi) {
        this.kodi = kodi;
    }

    /**
     * Passe (ou quitte) en plein écran.
     *
     * @returns {Promise.<boolean>} Une promesse contenant le nouvel état du
     *                              plein écran.
     */
    setFullscreen() {
        return this.kodi.send("GUI.SetFullscreen", { fullscreen: "toggle" });
    }
};
