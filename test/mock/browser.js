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
            "_data": {},
            "get":   () => {
                return Promise.resolve(browser.storage.local["_data"]);
            },
            "set":   (values) => {
                Object.assign(browser.storage.local["_data"], values);
            },
            "clear": () => {
                browser.storage.local["_data"] = {};
            }
        }
    }
};
