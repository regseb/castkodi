/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Kodi } from "./kodi.js"
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom _System_ de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const System = class {
    /**
     * Le client pour contacter Kodi.
     *
     * @type {Kodi}
     */
    #kodi;

    /**
     * Crée un client JSON-RPC pour l'espace de nom _System_.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Récupère des propriétés de l'espace de nom _System_ de Kodi.
     *
     * @param {string[]} properties Les noms des propriétés demandées.
     * @returns {Promise<Object>} Une promesse contenant les valeurs des
     *                            propriétés.
     */
    getProperties(properties) {
        return this.#kodi.send("System.GetProperties", { properties });
    }

    /**
     * Met en veille le système.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    hibernate() {
        return this.#kodi.send("System.Hibernate");
    }

    /**
     * Redémarre le système.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    reboot() {
        return this.#kodi.send("System.Reboot");
    }

    /**
     * Éteint le système.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    shutdown() {
        return this.#kodi.send("System.Shutdown");
    }

    /**
     * Suspend le système.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    suspend() {
        return this.#kodi.send("System.Suspend");
    }
};
