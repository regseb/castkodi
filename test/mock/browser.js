"use strict";

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
        } // getMessage()
    },

    "notifications": {
        "create": function () {
            // Ne rien faire.
        }
    }
};

module.exports = browser;
