/**
 * @module
 */

browser.storage.local.get().then((current) => {
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

        // Nettoyer la configuration pour garder seulement les propriétés
        // nécessaire.
        browser.storage.local.clear();
        browser.storage.local.set(config);
    } else {
        browser.storage.local.clear();
        browser.storage.local.set({
            "config-version":   4,
            "server-mode":      "single",
            "server-list":      [{ address: "", name: "" }],
            "server-active":    0,
            "general-history":  false,
            "menu-actions":     ["send", "insert", "add"],
            "menu-contexts":    [
                "audio", "frame", "link", "page", "selection", "tab", "video",
            ],
            "youtube-playlist": "playlist",
            "youtube-order":    "",
        });
    }
});
