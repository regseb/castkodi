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
        data:  [],
        index: 0,
    },
    contextMenus: [],
    histories:    [],
    permissions:  {
        data:      new Set(),
        listeners: [],
    },
    runtime: {
        browserInfo: { name: "" },
    },
    storage: {
        local: {
            data:      {},
            listeners: [],
        },
    },
    tabs: [],
};

/**
 * La prothèse pour les APIs des WebExtensions.
 *
 * @type {browser}
 */
export const browser = {
    _clear() {
        data.bookmarks.data.length = 0;
        data.bookmarks.index = 0;
        data.contextMenus.length = 0;
        data.histories.length = 0;
        data.permissions.data.clear();
        data.permissions.listeners.length = 0;
        data.runtime.browserInfo = { name: "" };
        Object.keys(data.storage.local.data).forEach((property) => {
            delete data.storage.local.data[property];
        });
        data.storage.local.listeners.length = 0;
        data.tabs.length = 0;

        browser.extension.inIncognitoContext = false;
    },

    bookmarks: {
        create(options) {
            const bookmark = {
                id: (++data.bookmarks.index).toString(),
                ...options,
            };
            data.bookmarks.data.push(bookmark);
            return bookmark;
        },
        get(id) {
            return data.bookmarks.data.filter((b) => id === b.id);
        },
    },

    contextMenus: {
        _getAll() {
            return data.contextMenus;
        },
        create(item) {
            if ("parentId" in item) {
                const parent = data.contextMenus.find((i) => i.id ===
                                                                 item.parentId);
                parent.children = [
                    ...parent.children ?? [],
                    item,
                ];
            } else {
                data.contextMenus.push(item);
            }
        },
        removeAll() {
            data.contextMenus.length = 0;
        },
    },

    extension: {
        inIncognitoContext: false,
    },

    history: {
        addUrl(details) {
            data.histories.push(details);
        },
        deleteAll() {
            data.histories.length = 0;
        },
        search({ text }) {
            return data.histories.filter((h) => h.url.includes(text));
        },
    },

    i18n: {
        getMessage(key, ...substitutions) {
            return Object.keys(MESSAGES[key]?.placeholders ?? {})
                         .reduce((message, placeholder, index) => {
                return message.replace("$" + placeholder.toUpperCase() + "$",
                                       substitutions[index]);
            }, MESSAGES[key]?.message ?? "");
        },
    },

    notifications: {
        create(_id, _options) {
            throw new Error("no polyfill for this function");
        },
    },

    permissions: {
        remove({ permissions }) {
            const changes = { permissions: [] };
            for (const permission of permissions) {
                const deleted = data.permissions.data.delete(permission);
                if (deleted) {
                    changes.permissions.push(permission);
                }
            }
            if (0 !== changes.permissions.length) {
                data.permissions.listeners.forEach((l) => l(changes));
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        },
        request({ permissions }) {
            for (const permission of permissions) {
                data.permissions.data.add(permission);
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

        _setBrowserInfo(browserInfo) {
            data.runtime.browserInfo = browserInfo;
        },
    },

    storage: {
        local: {
            get(properties) {
                if (undefined === properties) {
                    return Promise.resolve(data.storage.local.data);
                }
                return Promise.resolve(Object.fromEntries(
                    Object.entries(data.storage.local.data)
                          .filter(([k]) => properties.includes(k)),
                ));
            },
            set(values) {
                const changes = Object.fromEntries(Object.entries(values)
                    .map(([key, value]) => {
                        // eslint-disable-next-line unicorn/no-keyword-prefix
                        const change = { newValue: value };
                        if (key in data.storage.local.data) {
                            change.oldValue = data.storage.local.data[key];
                        }
                        return [key, change];
                    }));
                data.storage.local.listeners.forEach((l) => l(changes));
                data.storage.local.data = Object.fromEntries(Object.entries({
                    ...data.storage.local.data,
                    ...values,
                }).sort(([k1], [k2]) => k1.localeCompare(k2)));
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

    tabs: {

        /**
         * Simule la création d'un nouvel onglet.
         *
         * @param {Object} createProperties     Les propriétés du nouvel onglet.
         * @param {string} createProperties._id L'identifiant du nouvel onglet.
         * @param {string} createProperties.url L'adresse du nouvel onglet.
         * @returns {Promise<Object>} Une promesse contenant le nouvel onglet.
         */
        create(createProperties) {
            const tab = {
                // eslint-disable-next-line no-underscore-dangle
                id:  createProperties._id,
                url: createProperties.url,
            };
            data.tabs.push(tab);
            return Promise.resolve(tab);
        },

        /**
         * Ne simule pas l'injection de code dans une page.
         *
         * @returns {Promise<void>} Une promesse rejetée.
         */
        executeScript() {
            return Promise.reject(new Error("no polyfill for this function"));
        },

        /**
         * Simule l'obtention d'onglets.
         *
         * @param {Object} queryObj     Les filtres.
         * @param {string} queryObj.url Le filtre sur l'adresse des onglets.
         * @returns {Promise<Object[]>} Une promesse contenant les onglets
         *                              respectant les filtres.
         */
        query(queryObj) {
            return Promise.resolve(data.tabs.filter((t) => queryObj.url ===
                                                                        t.url));
        },

        /**
         * Simule la suppression d'un onglet.
         *
         * @param {number} tabId L'identifiant de l'onglet à fermer.
         * @returns {Promise<void>} Une promesse sans argument.
         */
        remove(tabId) {
            data.tabs.splice(data.tabs.findIndex((t) => tabId === t.id));
            return Promise.resolve();
        },
    },
};
