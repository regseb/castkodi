/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

if (undefined === import.meta.resolve) {
    /**
     * Résous un chemin relatif à partir du module.
     *
     * @param {string} specifier Le chemin relatif vers un fichier ou un
     *                           répertoire.
     * @returns {string} L'URL absolue vers le fichier ou le répertoire.
     * @see https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent
     */
    import.meta.resolve = (specifier) => {
        return new URL(specifier, import.meta.url).href;
    };
}

const MESSAGES = JSON.parse(
    await fs.readFile(
        fileURLToPath(import.meta.resolve("../../locales/en/messages.json")),
        "utf8",
    ),
);

/**
 * Les données pour la prothèse des APIs des WebExtensions.
 */
const data = {
    bookmarks: {
        /** @type {Object[]} */
        data: [],
        index: 0,
    },

    /** @type {Object[]} */
    contextMenus: [],

    /** @type {Object[]} */
    histories: [],

    permissions: {
        data: {
            origins: new Set(),
            permissions: new Set(),
        },

        /** @type {Function[]} */
        listeners: [],
    },

    runtime: {
        browserInfo: { name: "" },
    },

    storage: {
        local: {
            data: {},

            /** @type {Function[]} */
            listeners: [],
        },
    },
};

/**
 * La prothèse pour les APIs des WebExtensions.
 *
 * @see https://developer.mozilla.org/Add-ons/WebExtensions/API
 */
export const browser = {
    bookmarks: {
        /**
         * Crée un marque-page.
         *
         * @param {Object} options Les données du marque-page.
         * @returns {Object} Le marque-page créé.
         */
        create(options) {
            const bookmark = {
                id: (++data.bookmarks.index).toString(),
                ...options,
            };
            data.bookmarks.data.push(bookmark);
            return bookmark;
        },

        /**
         * Récupère des marque-pages.
         *
         * @param {string} id L'identifiant des marque-pages.
         * @returns {Object[]} Les marque-pages ayant l'identifiant.
         */
        get(id) {
            return data.bookmarks.data.filter((b) => id === b.id);
        },
    },

    contextMenus: {
        /**
         * Crée un élément dans le menu contextuel.
         *
         * @param {Object} item Les données de l'élément.
         */
        create(item) {
            data.contextMenus.push(item);
        },

        /**
         * Enlève tous les éléments du menu contextuel.
         */
        removeAll() {
            data.contextMenus.length = 0;
        },
    },

    extension: {
        /**
         * La marque indiquant si l'utilisateur est en navigation privée.
         *
         * @type {boolean}
         */
        inIncognitoContext: false,
    },

    history: {
        /**
         * Ajoute une page dans l'historique.
         *
         * @param {Object} details Les données de la page.
         */
        addUrl(details) {
            data.histories.push(details);
        },

        /**
         * Supprime toutes les pages de l'historique.
         */
        deleteAll() {
            data.histories.length = 0;
        },

        /**
         * Cherche des pages dans l'historique.
         *
         * @param {Object} query      Les filtres de la recherche.
         * @param {string} query.text Le texte cherché dans les URLs des pages.
         * @returns {Promise<Object[]>} Une promesse contenant les pages
         *                              respectant les filtres.
         */
        search({ text }) {
            return Promise.resolve(
                data.histories.filter((h) => h.url.includes(text)),
            );
        },
    },

    i18n: {
        /**
         * Récupère un message.
         *
         * @param {string}          key            La clé du message.
         * @param {string|string[]} [substitution] L'élément ou les éléments
         *                                         insérés dans le message.
         * @returns {string} Le message.
         */
        getMessage(key, substitution) {
            const substitutions = Array.isArray(substitution)
                ? substitution
                : [substitution];
            return Object.keys(MESSAGES[key]?.placeholders ?? {}).reduce(
                (message, placeholder, index) => {
                    return message.replace(
                        "$" + placeholder.toUpperCase() + "$",
                        substitutions[index],
                    );
                },
                MESSAGES[key]?.message ?? "",
            );
        },
    },

    notifications: {
        /**
         * Crée une notification.
         *
         * @param {string} _id      L'identifiant de la notification.
         * @param {Object} _options Les options de la notification.
         * @returns {Promise<string>} Une promesse contenant l'identifiant de
         *                            la notification.
         */
        create(_id, _options) {
            return Promise.reject(
                new Error(
                    "no polyfill for browser.notifications.create function",
                ),
            );
        },
    },

    permissions: {
        /**
         * Vérifie si l'extension a des permissions.
         *
         * @param {Object}   permissions               Les permissions
         *                                             vérifiées.
         * @param {string[]} [permissions.origins]     Les permissions de
         *                                             l'hôte.
         * @param {string[]} [permissions.permissions] Les permissions d'API.
         * @returns {Promise<boolean>} Une promesse contenant <code>true</code>
         *                             si l'extension a toutes les
         *                             permissions ; sinon <code>false</code>.
         */
        contains({ origins = [], permissions = [] }) {
            return Promise.resolve(
                origins.every((o) => data.permissions.data.origins.has(o)) &&
                    permissions.every((p) =>
                        data.permissions.data.permissions.has(p),
                    ),
            );
        },

        /**
         * Renonce à des permissions.
         *
         * @param {Object}   permissions               Les permissions
         *                                             renoncées.
         * @param {string[]} [permissions.origins]     Les permissions de
         *                                             l'hôte.
         * @param {string[]} [permissions.permissions] Les permissions d'API.
         * @returns {Promise<boolean>} Une promesse contenant <code>true</code>
         *                             si l'extension a renoncé à toutes les
         *                             permissions ; sinon <code>false</code>.
         */
        remove({ origins = [], permissions = [] }) {
            const changes = { origins: [], permissions: [] };
            for (const origin of origins) {
                const deleted = data.permissions.data.origins.delete(origin);
                if (deleted) {
                    changes.origins.push(origin);
                }
            }
            for (const permission of permissions) {
                const deleted =
                    data.permissions.data.permissions.delete(permission);
                if (deleted) {
                    changes.permissions.push(permission);
                }
            }
            if (
                0 !== changes.origins.length ||
                0 !== changes.permissions.length
            ) {
                data.permissions.listeners.forEach((l) => l(changes));
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        },

        /**
         * Demande des permissions.
         *
         * @param {Object}   permissions               Les permissions
         *                                             demandées.
         * @param {string[]} [permissions.origins]     Les permissions de
         *                                             l'hôte.
         * @param {string[]} [permissions.permissions] Les permissions d'API.
         * @returns {Promise<boolean>} Une promesse contenant
         *                             <code>true</code>0.
         */
        request({ origins = [], permissions = [] }) {
            for (const origin of origins) {
                data.permissions.data.origins.add(origin);
            }
            for (const permission of permissions) {
                data.permissions.data.permissions.add(permission);
            }
            return Promise.resolve(true);
        },

        onRemoved: {
            /**
             * Ajoute un auditeur sur les changements des permissions.
             *
             * @param {Function} listener L'auditeur ajouté.
             */
            addListener(listener) {
                data.permissions.listeners.push(listener);
            },
        },
    },

    runtime: {
        /**
         * Renvoie les informations sur le navigateur.
         *
         * @returns {Promise<Object>} Une promesse contenant les informations
         *                            sur le navigateur.
         */
        getBrowserInfo() {
            return Promise.resolve(data.runtime.browserInfo);
        },
    },

    storage: {
        local: {
            /**
             * Récupère des éléments de la zone de stockage.
             *
             * @param {string[]} [properties] Les clés des éléments récupérés.
             * @returns {Promise<Object>} Les éléments de la zone de stockage.
             */
            get(properties) {
                if (undefined === properties) {
                    return Promise.resolve(data.storage.local.data);
                }
                return Promise.resolve(
                    Object.fromEntries(
                        Object.entries(data.storage.local.data).filter(([k]) =>
                            properties.includes(k),
                        ),
                    ),
                );
            },

            /**
             * Modifie des éléments de la zone de stockage.
             *
             * @param {Object} values Les éléments modifiés.
             * @returns {Promise<void>} Une promesse vide.
             */
            set(values) {
                const changes = Object.fromEntries(
                    Object.entries(values).map(([key, value]) => {
                        // eslint-disable-next-line unicorn/no-keyword-prefix
                        const change = { newValue: value };
                        if (key in data.storage.local.data) {
                            change.oldValue = data.storage.local.data[key];
                        }
                        return [key, change];
                    }),
                );
                data.storage.local.listeners.forEach((l) => l(changes));
                data.storage.local.data = Object.fromEntries(
                    Object.entries({
                        ...data.storage.local.data,
                        ...values,
                    }).sort(([k1], [k2]) => k1.localeCompare(k2)),
                );
                return Promise.resolve();
            },

            /**
             * Supprime tous les éléments de la zone de stockage.
             *
             * @returns {Promise<void>} Une promesse vide.
             */
            clear() {
                data.storage.local.data = {};
                return Promise.resolve();
            },
        },

        onChanged: {
            /**
             * Ajoute un auditeur sur les changements de la zone de stockage.
             *
             * @param {Function} listener L'auditeur ajouté.
             */
            addListener(listener) {
                data.storage.local.listeners.push(listener);
            },
        },
    },
};

/**
 * Réinitialise les données de la prothèse des APIs des WebExtensions.
 */
export const clear = function () {
    data.bookmarks.data.length = 0;
    data.bookmarks.index = 0;
    data.contextMenus.length = 0;
    data.histories.length = 0;
    data.permissions.data.origins.clear();
    data.permissions.data.permissions.clear();
    data.permissions.listeners.length = 0;
    data.runtime.browserInfo = { name: "" };
    Object.keys(data.storage.local.data).forEach((property) => {
        delete data.storage.local.data[property];
    });
    data.storage.local.listeners.length = 0;

    browser.extension.inIncognitoContext = false;
};
