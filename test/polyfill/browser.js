import fs from "node:fs/promises";
import path from "node:path";

const DIRNAME = path.dirname(new URL(import.meta.url).pathname);

const I18NS = JSON.parse(
    await fs.readFile(path.join(DIRNAME, "../../locales/en/messages.json"),
                      "utf8"),
);

const data = {
    bookmarks:   {},
    histories:   [],
    permissions: {
        data:      new Set(),
        listeners: [],
    },
    storage:     {
        local: {
            data:      {},
            listeners: [],
        },
    },
};

/**
 * La prothèse pour les APIs des WebExtensions.
 *
 * @type {browser}
 */
export const browser = {
    bookmarks: {
        get: (id) => {
            return id in data.bookmarks
                              ? Promise.resolve([data.bookmarks[id]])
                              : Promise.reject(new Error("Bookmark not found"));
        },
    },
    extension: {
        inIncognitoContext: false,
    },
    history: {
        addUrl: (details) => {
            data.histories.push(details);
        },
        deleteAll: () => {
            data.histories.length = 0;
        },
        search: ({ text }) => {
            return data.histories.filter((h) => h.url.includes(text));
        },
    },
    i18n: {
        getMessage: (key, ...substitutions) => {
            return Object.keys(I18NS[key]?.placeholders ?? {})
                         .reduce((message, placeholder, index) => {
                return message.replace("$" + placeholder.toUpperCase() + "$",
                                       substitutions[index]);
            }, I18NS[key]?.message ?? "");
        },
    },

    notifications: {
        create: (_id, _options) => {
            throw new Error("no polyfill for this function");
        },
    },

    permissions: {
        remove: ({ permissions }) => {
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
        request: ({ permissions }) => {
            for (const permission of permissions) {
                data.permissions.data.add(permission);
            }
            return Promise.resolve(true);
        },
        onRemoved: {
            addListener: (listener) => {
                data.permissions.listeners.push(listener);
            },
        },
    },

    storage: {
        local: {
            get:   (properties = null) => {
                if (null === properties) {
                    return Promise.resolve(data.storage.local.data);
                }
                return Promise.resolve(properties.reduce((result, property) => {
                    if (property in data.storage.local.data) {
                        return {
                            ...result,
                            ...{
                                [property]: data.storage.local.data[property],
                            },
                        };
                    }
                    return result;
                }, {}));
            },
            set:   (values) => {
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
                Object.assign(data.storage.local.data, values);
            },
            clear: () => {
                data.storage.local.data = {};
            },
        },
        onChanged: {
            addListener: (listener) => {
                data.storage.local.listeners.push(listener);
            },
        },
    },
};
