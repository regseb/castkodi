/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Kodi } from "./kodi.js"
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>JSONRPC</em> de Kodi.
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
     * Crée un client JSON-RPC pour l'espace de nom <em>JSONRPC</em>.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Ping l'API de Kodi.
     *
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code> si
     *                            l'API de Kodi répond.
     */
    ping() {
        return this.#kodi.send("JSONRPC.Ping");
    }

    /**
     * Récupère la version de l'API de Kodi.
     *
     * @returns {Promise<Object>} Une promesse contenant les éléments de la
     *                            version (<code>major</code>,
     *                            <code>minor</code> et <code>patch</code>).
     */
    async version() {
        const result = await this.#kodi.send("JSONRPC.Version");
        return result.version;
    }
};
