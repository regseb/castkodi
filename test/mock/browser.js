const data = {
    "storage": {
        "local": {
            "data":      {
                "config-version":   2,
                "server-mode":      "single",
                "server-list":      [{ "host": "", "name": "" }],
                "server-active":    0,
                "general-history":  false,
                "menu-actions":     ["send", "insert", "add"],
                "menu-contexts":    [
                    "audio", "frame", "link", "page", "selection", "tab",
                    "video"
                ],
                "youtube-playlist": "playlist"
            },
            "listeners": []
        }
    }
};

export const browser = {
    "bookmarks": {
        "get": (id) => {
            switch (id) {
                case "1":
                    return Promise.resolve([{ "url": "https://www.foo.com/" }]);
                case "2":
                    return Promise.resolve([
                        { "url": "http://www.bar.fr/" },
                        { "url": "http://www.baz.org/" }
                    ]);
                default:
                    return Promise.resolve([{ "type": "folder" }]);
            }
        }
    },
    "i18n": {
        "getMessage": (key, substitutions = []) => {
            if (Array.isArray(substitutions)) {
                if (0 === substitutions.length) {
                    return key;
                }
                return key + ": " + substitutions.join(", ");
            }
            return key + ": " + substitutions;
        }
    },

    "notifications": {
        "create": () => {
            // Ne rien faire.
        }
    },

    "storage": {
        "local": {
            "get":   () => {
                return Promise.resolve(data.storage.local.data);
            },
            "set":   (values) => {
                Object.assign(data.storage.local.data, values);
            },
            "clear": () => {
                data.storage.local.data = {};
            }
        },
        "onChanged": {
            "addListener": (listener) => {
                data.storage.local.listeners.push(listener);
            }
        }
    }
};
