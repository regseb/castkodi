/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";

if (undefined === import.meta.resolve) {
    /**
     * Résous un chemin relatif à partir du module.
     *
     * @param {string} specifier Le chemin relatif vers un fichier.
     * @returns {Promise<string>} Une promesse contenant le chemin absolu vers
     *                            le fichier.
     * @see https://nodejs.org/docs/latest/api/esm.html#importmeta
     */
    import.meta.resolve = (specifier) => {
        return Promise.resolve(new URL(specifier, import.meta.url).pathname);
    };
}

const MESSAGES = JSON.parse(
    await fs.readFile(
        await import.meta.resolve("../../locales/en/messages.json"),
        "utf8",
    ),
);

/**
 * Les données pour la prothèse des APIs des WebExtensions.
 */
const data = {
    bookmarks: {
        data: [],
        index: 0,
    },
    contextMenus: [],
    histories: [],
    permissions: {
        data: {
            origins: new Set(),
            permissions: new Set(),
        },
        listeners: [],
    },
    runtime: {
        browserInfo: { name: "" },
    },
    storage: {
        local: {
            data: {},
            listeners: [],
        },
    },
    tabs: [],
};

/**
 * La prothèse pour les APIs des WebExtensions.
 *
 * @type {browser}
 * @see https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API
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
         * @returns {Object[]} Les pages respectant les filtres.
         */
        search({ text }) {
            return data.histories.filter((h) => h.url.includes(text));
        },
    },

    i18n: {
        /**
         * Récupère un message.
         *
         * @param {string}          key          La clé du message.
         * @param {string|string[]} substitution L'éléméent ou les éléments
         *                                       insérés dans le message.
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
         * @throws {Error} Si la méthode n'est pas implémentée.
         */
        create(_id, _options) {
            throw new Error(
                "no polyfill for browser.notifications.create function",
            );
        },
    },

    permissions: {
        contains({ origins = [], permissions = [] }) {
            return Promise.resolve(
                origins.every((o) => data.permissions.data.origins.has(o)) &&
                    permissions.every((p) =>
                        data.permissions.data.permissions.has(p),
                    ),
            );
        },
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
            addListener(listener) {
                data.permissions.listeners.push(listener);
            },
        },
    },

    runtime: {
        getBrowserInfo() {
            return Promise.resolve(data.runtime.browserInfo);
        },
    },

    storage: {
        local: {
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
            },
            clear() {
                data.storage.local.data = {};
            },
        },
        onChanged: {
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
    data.tabs.length = 0;

    browser.extension.inIncognitoContext = false;
};
