"use strict";

const storage = {};

const browser = {
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
            "get": function () {
                return Promise.resolve(storage);
            },
            "set": function (values) {
                Object.assign(storage, values);
            }
        }
    }
};

module.exports = browser;
