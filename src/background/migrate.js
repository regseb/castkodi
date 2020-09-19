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

// Utiliser un then() car addons-linter échoue à analyser les fichiers sans
// import / export et avec un await dans le scope global.
// https://github.com/mozilla/addons-linter/issues/4020
// eslint-disable-next-line unicorn/prefer-top-level-await
browser.storage.local.get().then(async (current) => {
    // Vider la configuration pour enlever les éventuelles propriétés obsolètes.
    // Et aussi pour forcer l'appel à l'écouteur browser.storage.onChanged sous
    // Chromium même si la méthode browser.storage.local.set() ne modifie pas la
    // configuration.
    await browser.storage.local.clear();

    if ("config-version" in current) {
        let config = current;
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
        if (2 === config["config-version"]) {
            const servers = config["server-list"].map((server) => ({
                address: server.host,
                name:    server.name,
            }));

            config["config-version"] = 3;
            config["server-list"]    = servers;
        }
        if (3 === config["config-version"]) {
            config["config-version"] = 4;
            config["youtube-order"]  = "";
        }

        await browser.storage.local.set(config);
    } else {
        const { name } = await browser.runtime.getBrowserInfo();

        await browser.storage.local.set({
            "config-version":   4,
            "server-mode":      "single",
            "server-list":      [{ address: "", name: "" }],
            "server-active":    0,
            "general-history":  false,
            "menu-actions":     ["send", "insert", "add", "subtitle"],
            "menu-contexts":    DEFAULT_MENU_CONTEXTS[name],
            "youtube-playlist": "playlist",
            "youtube-order":    "default",
        });
    }
});
