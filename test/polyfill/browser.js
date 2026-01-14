/**
 * @license MIT
 * @author Sébastien Règne
 */

import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

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
        /** @type {browser.bookmarks.BookmarkTreeNode[]} */
        data: [],
        index: 0,
    },

    /** @type {browser.contextMenus._CreateCreateProperties[]} */
    contextMenus: [],

    histories: {
        /** @type {browser.history.HistoryItem[]} */
        data: [],
        index: 0,
    },

    permissions: {
        data: {
            origins: new Set(),
            permissions: new Set(),
        },

        /** @type {Function[]} */
        listeners: [],
    },

    runtime: {
        browserInfo: {
            name: "",
            vendor: "",
            version: "",
            buildID: "",
        },
    },

    storage: {
        local: {
            /** @type {Record<string, any>} */
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
         * @returns {browser.bookmarks.BookmarkTreeNode} Le marque-page créé.
         */
        create(options) {
            const bookmark =
                /** @type {browser.bookmarks.BookmarkTreeNode} */ ({
                    id: (++data.bookmarks.index).toString(),
                    ...options,
                });
            data.bookmarks.data.push(bookmark);
            return bookmark;
        },

        /**
         * Récupère des marque-pages.
         *
         * @param {string} id L'identifiant des marque-pages.
         * @returns {Promise<browser.bookmarks.BookmarkTreeNode[]>} Les
         *                                                          marque-pages
         *                                                          ayant
         *                                                          l'identifiant.
         */
        get(id) {
            return Promise.resolve(
                data.bookmarks.data.filter((b) => id === b.id),
            );
        },
    },

    contextMenus: {
        /**
         * Crée un élément dans le menu contextuel.
         *
         * @param {browser.contextMenus._CreateCreateProperties} item Les
         *                                                            données de
         *                                                            l'élément.
         * @returns {number|string} L'identifiant de l'élément.
         */
        create(item) {
            data.contextMenus.push(item);
            return item.id;
        },

        /**
         * Enlève tous les éléments du menu contextuel.
         *
         * @returns {Promise<void>} Une promesse vide.
         */
        removeAll() {
            data.contextMenus.length = 0;
            return Promise.resolve();
        },

        /**
         * La liste des types de contextes.
         */
        ContextType: {
            ACTION: "action",
            ALL: "all",
            AUDIO: "audio",
            // Ce contexte n'est pas disponible dans Chromium.
            // https://issues.chromium.org/41378677
            BOOKMARK: "bookmark",
            EDITABLE: "editable",
            FRAME: "frame",
            IMAGE: "image",
            LAUNCHER: "launcher",
            LINK: "link",
            PAGE: "page",
            PASSWORD: "password",
            SELECTION: "selection",
            // Ce contexte n'est pas disponible dans Chromium.
            // https://issues.chromium.org/40246822
            TAB: "tab",
            TOOLS_MENU: "tools_menu",
            VIDEO: "video",
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
         * @param {browser.history._AddUrlDetails} details Les données de la
         *                                                 page.
         * @returns {Promise<void>} Une promesse vide.
         */
        addUrl(details) {
            data.histories.data.push({
                id: (++data.histories.index).toString(),
                ...details,
            });
            return Promise.resolve();
        },

        /**
         * Cherche des pages dans l'historique.
         *
         * @param {browser.history._SearchQuery} query Les filtres de la
         *                                             recherche.
         * @returns {Promise<browser.history.HistoryItem[]>} Une promesse
         *                                                   contenant les pages
         *                                                   respectant les
         *                                                   filtres.
         */
        search({ text }) {
            return Promise.resolve(
                data.histories.data.filter((h) => h.url.includes(text)),
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
                        `$${placeholder.toUpperCase()}$`,
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
         * @param {string} [_id]    L'éventuel identifiant de la notification.
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
         * @param {browser.permissions.AnyPermissions} permissions Les
         *                                                         permissions
         *                                                         vérifiées.
         * @returns {Promise<boolean>} Une promesse contenant `true` si
         *                             l'extension a toutes les permissions ;
         *                             sinon `false`.
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
         * @param {browser.permissions.Permissions} permissions Les permissions
         *                                                      renoncées.
         * @returns {Promise<boolean>} Une promesse contenant `true` si
         *                             l'extension a renoncé à toutes les
         *                             permissions ; sinon `false`.
         */
        remove({ origins = [], permissions = [] }) {
            const changes = {
                origins: /** @type {string[]} */ ([]),
                permissions: /** @type {string[]} */ ([]),
            };
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
         * @param {browser.permissions.Permissions} permissions Les permissions
         *                                                      demandées.
         * @returns {Promise<boolean>} Une promesse contenant `true`.
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
         * @returns {Promise<browser.runtime.BrowserInfo>} Une promesse
         *                                                 contenant les
         *                                                 informations sur le
         *                                                 navigateur.
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
             * @returns {Promise<Record<string, any>>} Les éléments de la zone
             *                                         de stockage.
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
             * @param {Record<string, any>} values Les éléments modifiés.
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
                    }).toSorted(([k1], [k2]) => k1.localeCompare(k2)),
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
export const restoreAll = () => {
    data.bookmarks.data.length = 0;
    data.bookmarks.index = 0;
    data.contextMenus.length = 0;
    data.histories.data.length = 0;
    data.histories.index = 0;
    data.permissions.data.origins.clear();
    data.permissions.data.permissions.clear();
    data.permissions.listeners.length = 0;
    data.runtime.browserInfo = {
        name: "",
        vendor: "",
        version: "",
        buildID: "",
    };
    Object.keys(data.storage.local.data).forEach((property) => {
        delete data.storage.local.data[property];
    });
    data.storage.local.listeners.length = 0;

    browser.extension.inIncognitoContext = false;
};
