export const browser = {
    "i18n": {
        "getMessage": function (key, substitutions = []) {
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
        "create": function () {
            // Ne rien faire.
        }
    },

    "storage": {
        "local": {
            "_data": {},
            "get":   function () {
                return Promise.resolve(browser.storage.local["_data"]);
            },
            "set":   function (values) {
                Object.assign(browser.storage.local["_data"], values);
            },
            "clear": function () {
                browser.storage.local["_data"] = {};
            }
        }
    }
};
