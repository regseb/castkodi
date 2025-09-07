/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { Kodi } from "./kodi.js"
 */

/**
 * @typedef {Object} AddonDetails
 * @prop {string} addonid L'identifiant de l'addon.
 * @prop {string} author  L'auteur de l'addon.
 * @prop {string} type    Le type de l'addon.
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom _Addons_ de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const Addons = class {
    /**
     * Le client pour contacter Kodi.
     *
     * @type {Kodi}
     */
    #kodi;

    /**
     * Crée un client JSON-RPC pour l'espace de nom _Addons_.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Retourne une liste d'addons gérant un type de contenu.
     *
     * @param {...string} contents Le type de contenu géré par les addons à
     *                             retourner (`"unknown"`, `"video"`, `"audio"`,
     *                             `"image"` ou `"executable"`).
     * @returns {Promise<AddonDetails[]>} Une promesse contenant les
     *                                    identifiants des addons.
     */
    async getAddons(...contents) {
        const addons = [];
        for (const content of contents) {
            const results = await this.#kodi.send("Addons.GetAddons", {
                content,
                enabled: true,
                properties: ["author"],
            });
            // Gérer le cas où la propriété "addons" n'est pas présente (quand
            // aucun addon n'est retourné).
            if (undefined !== results.addons) {
                addons.push(...results.addons);
            }
        }
        return addons;
    }
};
