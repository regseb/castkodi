/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Kodi } from "./kodi.js"
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom _GUI_ de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const GUI = class {
    /**
     * Le client pour contacter Kodi.
     *
     * @type {Kodi}
     */
    #kodi;

    /**
     * Crée un client JSON-RPC pour l'espace de nom _GUI_.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Passe (ou quitte) en plein écran.
     *
     * @returns {Promise<boolean>} Une promesse contenant le nouvel état du
     *                             plein écran.
     */
    setFullscreen() {
        return this.#kodi.send("GUI.SetFullscreen", { fullscreen: "toggle" });
    }
};
