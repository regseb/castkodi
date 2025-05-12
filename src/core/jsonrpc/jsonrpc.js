/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Kodi } from "./kodi.js"
 */

/**
 * @typedef {Object} Version
 * @prop {number} major Le numéro majeur de la version.
 * @prop {number} minor Le numéro mineur de la version.
 * @prop {number} patch Le numéro du patch de la version.
 * @see https://kodi.wiki/view/JSON-RPC_API/v13#JSONRPC.Version
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom _JSONRPC_ de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const JSONRPC = class {
    /**
     * Le client pour contacter Kodi.
     *
     * @type {Kodi}
     */
    #kodi;

    /**
     * Crée un client JSON-RPC pour l'espace de nom _JSONRPC_.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Ping l'API de Kodi.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"` si l'API de Kodi
     *                            répond.
     */
    ping() {
        return this.#kodi.send("JSONRPC.Ping");
    }

    /**
     * Récupère la version de l'API de Kodi.
     *
     * @returns {Promise<Version>} Une promesse contenant les éléments de la
     *                             version (`major`, `minor` et `patch`).
     */
    async version() {
        const result = await this.#kodi.send("JSONRPC.Version");
        return result.version;
    }
};
