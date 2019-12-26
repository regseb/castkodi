const data = {
    "bookmarks": {},
    "i18n":      {},
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
            return id in data.bookmarks ? Promise.resolve(data.bookmarks[id])
                                        : Promise.reject(new Error());
        }
    },
    "i18n": {
        "getMessage": (key) => {
            return data.i18n[key];
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
