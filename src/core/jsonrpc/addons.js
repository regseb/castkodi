/**
 * @module
 */

/**
 * @typedef {import("./kodi.js").Kodi} Kodi
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>Addons</em> de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const Addons = class {

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>Addons</em>.
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
     * Retourne une liste d'addons gérant un type de contenu.
     *
     * @param {string} content Le type de contenu géré par les addons à
     *                         retourner (<code>"unknown"</code>,
     *                         <code>"video"</code>, <code>"audio"</code>,
     *                         <code>"image"</code> ou
     *                         <code>"executable"</code>).
     * @returns {Promise<string[]>} Une promesse contenant les identifiants des
     *                              addons.
     */
    async getAddons(content) {
        const results = await this._kodi.send("Addons.GetAddons", {
            content,
            enabled: true,
        });
        // Gérer le cas où la propriété "addons" n'est pas présente (quand aucun
        // addon est retourné).
        return results.addons?.map((a) => a.addonid) ?? [];
    }
};
