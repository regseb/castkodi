export const browser = {
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
