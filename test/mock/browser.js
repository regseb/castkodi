"use strict";

const browser = {
    "gimmick": {
        "menus": {
            "items":     [],
            "listeners": []
        },
        "storage": {}
    },

    "menus": {
        "removeAll": function () {
            browser.gimmick.menus.items.length = 0;
            return Promise.resolve();
        },
        "create": function (item) {
            browser.gimmick.menus.items.push(item);
        },
        "onClicked": {
            "addListener": function (listener) {
                browser.gimmick.menus.listeners.push(listener);
            },
            "hasListener": function (listener) {
                return browser.gimmick.menus.listeners.includes(listener);
            }
        }
    },

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
                return Promise.resolve(browser.gimmick.storage);
            },
            "set": function (values) {
                Object.assign(browser.gimmick.storage, values);
            }
        }
    }
};

module.exports = browser;
