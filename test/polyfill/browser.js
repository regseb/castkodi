import fs   from "fs";
import path from "path";

const I18NS = fs.readFileSync(path.join(__dirname,
                                        "../../locales/en/messages.json"));

const data = {
    "bookmarks": {},
    "storage":   {
        "local": {
            "data":      {},
            "listeners": []
        }
    }
};

export const browser = {
    "bookmarks": {
        "get": (id) => {
            return id in data.bookmarks
                              ? Promise.resolve([data.bookmarks[id]])
                              : Promise.reject(new Error("Bookmark not found"));
        }
    },
    "i18n": {
        "getMessage": (key, substitutions) => {
            if (!(key in I18NS)) {
                return "";
            }
            if (!("placeholders" in I18NS[key])) {
                return I18NS[key];
            }
            return Object.keys(I18NS[key].placeholders)
                         .reduce((message, placeholder, index) => {
                return message.replace("$" + placeholder + "$",
                                       substitutions[index]);
            }, I18NS[key].message);
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
