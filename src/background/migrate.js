/**
 * @module
 */

browser.storage.local.get().then((config) => {
    if (!("config-version" in config)) {
        browser.storage.local.clear();
        browser.storage.local.set({
            "config-version":   2,
            "server-mode":      "single",
            "server-list":      [{ host: "", name: "" }],
            "server-active":    0,
            "general-history":  false,
            "menu-actions":     ["send", "insert", "add"],
            "menu-contexts":    [
                "audio", "frame", "link", "page", "selection", "tab", "video",
            ],
            "youtube-playlist": "playlist",
            "youtube-playlist-order": "default",
        });
    } else if (1 === config["config-version"]) {
        const actions = Object.entries(config)
                              .filter(([k, v]) => k.startsWith("menus-") && v)
                              .map(([k]) => k.slice(6))
                              .reverse();
        const contexts = Object.entries(config)
                             .filter(([k, v]) => k.startsWith("contexts-") && v)
                             .map(([k]) => k.slice(9));

        browser.storage.local.clear();
        browser.storage.local.set({
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
            "youtube-playlist-order": config["youtube-playlist-order"],
        });
    } else {
        // Nettoyer la configuration en gardant seulement les propriétés
        // nécessaire.
        browser.storage.local.clear();
        browser.storage.local.set({
            "config-version":   config["config-version"],
            "server-mode":      config["server-mode"],
            "server-list":      config["server-list"],
            "server-active":    config["server-active"],
            "general-history":  config["general-history"],
            "menu-actions":     config["menu-actions"],
            "menu-contexts":    config["menu-contexts"],
            "youtube-playlist": config["youtube-playlist"],
            "youtube-playlist-order": config["youtube-playlist-order"],
        });
    }
});
