/**
 * @module
 */

/**
 * @typedef {import("./kodi.js").Kodi} Kodi
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>GUI</em> de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const GUI = class {

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>GUI/em>.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {

        /**
         * Le client pour contacter Kodi.
         *
         * @private
         * @type {Kodi}
         */
        this._kodi = kodi;
    }

    /**
     * Passe (ou quitte) en plein écran.
     *
     * @returns {Promise<boolean>} Une promesse contenant le nouvel état du
     *                             plein écran.
     */
    setFullscreen() {
        return this._kodi.send("GUI.SetFullscreen", { fullscreen: "toggle" });
    }
};
