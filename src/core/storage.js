/**
 * @module
 */

/**
 * La liste des contextes par défaut pour chaque navigateur. Sous Chrome, les
 * contextes <code>bookmark</code> et <code>tab</code> n'existent pas. Et dans
 * Firefox le contexte <code>bookmark</code> n'est pas activé par défaut car il
 * nécessite la permission <code>bookmarks</code>. https://crbug.com/825443
 *
 * @constant {object<string, string[]>}
 */
const DEFAULT_MENU_CONTEXTS = {
    Chrome:  ["audio", "frame", "link", "page", "selection", "video"],
    Firefox: ["audio", "frame", "link", "page", "selection", "tab", "video"],
};

/**
 * Initialise la configuration.
 */
export const initialize = async function () {
    const { name } = await browser.runtime.getBrowserInfo();

    await browser.storage.local.set({
        "config-version":    5,
        "server-mode":       "single",
        "server-list":       [{ address: "", name: "" }],
        "server-active":     0,
        "general-history":   false,
        "general-clipboard": false,
        "menu-actions":      ["send", "insert", "add"],
        "menu-contexts":     DEFAULT_MENU_CONTEXTS[name],
        "youtube-playlist":  "playlist",
        "youtube-order":     "default",
    });
};

/**
 * Migre éventuellement la configuration vers une nouvelle version.
 */
export const migrate = async function () {
    let config = await browser.storage.local.get();

    // Regrouper les propriétés des menus et des contextes dans deux
    // propriétés ; et permettre la configuration de plusieurs serveurs.
    if (1 === config["config-version"]) {
        const actions = Object.entries(config)
                            .filter(([k, v]) => k.startsWith("menus-") && v)
                            .map(([k]) => k.slice(6))
                            .reverse();
        const contexts = Object.entries(config)
                         .filter(([k, v]) => k.startsWith("contexts-") && v)
                         .map(([k]) => k.slice(9));

        config = {
            "config-version":   2,
            "server-mode":      "single",
            "server-list":      [{
                host: config["connection-host"],
                name: "",
            }],
            "server-active":    0,
            "general-history":  config["general-history"],
            "menu-actions":     actions,
            "menu-contexts":    contexts,
            "youtube-playlist": config["youtube-playlist"],
        };
    }

    // Renommer les propriétés "host" en "address" car elles peuvent maintenant
    // contenir une adresse IP ou une adresse complête.
    if (2 === config["config-version"]) {
        const servers = config["server-list"].map((server) => ({
            address: server.host,
            name:    server.name,
        }));

        config["config-version"] = 3;
        config["server-list"]    = servers;
    }

    // Ajouter une propriété pour définir l'ordre des playlists YouTube.
    if (3 === config["config-version"]) {
        config["config-version"] = 4;
        config["youtube-order"]  = "";
    }

    // Ajouter une propriété pour indiquer s'il faut lire dans le presse-papier.
    if (4 === config["config-version"]) {
        config["config-version"]    = 5;
        config["general-clipboard"] = false;
    }

    // Vider la configuration pour enlever les éventuelles propriétés obsolètes.
    // Et aussi pour forcer l'appel à l'écouteur browser.storage.onChanged sous
    // Chromium même si la méthode browser.storage.local.set() ne modifie pas la
    // configuration.
    await browser.storage.local.clear();
    await browser.storage.local.set(config);
};

/**
 * Actualise la configuration suite à la suppression de permissions
 * optionnelles.
 *
 * @param {string[]} permissions Les permissions supprimées.
 */
export const remove = async function (permissions) {
    if (permissions.includes("history")) {
        await browser.storage.local.set({ "general-history": false });
    }

    if (permissions.includes("clipboardRead")) {
        await browser.storage.local.set({ "general-clipboard": false });
    }

    if (permissions.includes("bookmarks")) {
        const config = await browser.storage.local.get(["menu-contexts"]);
        const contexts = config["menu-contexts"];
        await browser.storage.local.set({
            "menu-contexts": contexts.filter((c) => "bookmark" !== c),
        });
    }
};
