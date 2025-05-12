/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * La liste des contextes par défaut. Le contexte `"bookmark"` n'est pas activé
 * par défaut, car il nécessite la permission `"bookmarks"`.
 *
 * @type {string[]}
 * @see https://developer.mozilla.org/Add-ons/WebExtensions/API/menus/ContextType
 */
const DEFAULT_MENU_CONTEXTS = [
    "audio",
    "frame",
    "link",
    "page",
    "selection",
    "tab",
    "video",
];

/**
 * Initialise la configuration.
 */
export const initialize = async () => {
    // Si la modification des menus contextuels est supportée : enlever les
    // contextes non-disponibles dans certains navigateurs ("tab" dans Chromium).
    // Si la modification n'est pas supportée (comme dans Firefox Android) :
    // enlever tous les contextes. https://issues.chromium.org/40246822
    // https://bugzil.la/1595822
    const contextTypes = new Set(
        undefined === browser.contextMenus
            ? []
            : Object.values(browser.contextMenus.ContextType),
    );
    const menuContexts = DEFAULT_MENU_CONTEXTS.filter((c) =>
        contextTypes.has(c),
    );

    await browser.storage.local.set({
        "config-version": 6,
        "server-mode": "single",
        "server-list": [{ address: "", name: "" }],
        "server-active": 0,
        "general-history": false,
        "popup-clipboard": false,
        "popup-wheel": "normal",
        "menu-actions":
            // Si aucun context n'est disponible : ne pas activer les actions.
            0 === menuContexts.length ? [] : ["send", "insert", "add"],
        "menu-contexts": menuContexts,
        "youtube-playlist": "playlist",
        "youtube-order": "default",
    });
};

/**
 * Migre éventuellement la configuration vers une nouvelle version.
 */
export const migrate = async () => {
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
            "config-version": 2,
            "server-mode": "single",
            "server-list": [
                {
                    host: config["connection-host"],
                    name: "",
                },
            ],
            "server-active": 0,
            "general-history": config["general-history"],
            "menu-actions": actions,
            "menu-contexts": contexts,
            "youtube-playlist": config["youtube-playlist"],
        };
    }

    // Renommer les propriétés "host" en "address", car elles peuvent maintenant
    // contenir une adresse IP ou une adresse complète.
    if (2 === config["config-version"]) {
        const servers = config["server-list"].map((server) => ({
            address: server.host,
            name: server.name,
        }));

        config["config-version"] = 3;
        config["server-list"] = servers;
    }

    // Ajouter une propriété pour définir l'ordre des playlists YouTube.
    if (3 === config["config-version"]) {
        config["config-version"] = 4;
        config["youtube-order"] = "";
    }

    // Ajouter une propriété pour indiquer s'il faut lire dans le presse-papier.
    if (4 === config["config-version"]) {
        config["config-version"] = 5;
        config["general-clipboard"] = false;
    }

    // Renommer la propriété pour le presse-papier et ajouter une propriété pour
    // le contrôle du volume avec la molette.
    if (5 === config["config-version"]) {
        config["config-version"] = 6;
        config["popup-clipboard"] = config["general-clipboard"];
        delete config["general-clipboard"];
        config["popup-wheel"] = "reverse";
    }

    // Vider la configuration pour enlever les éventuelles propriétés obsolètes.
    await browser.storage.local.clear();
    await browser.storage.local.set(config);
};

/**
 * Actualise la configuration suite à la suppression de permissions
 * optionnelles.
 *
 * @param {string[]} permissions Les permissions supprimées.
 */
export const remove = async (permissions) => {
    if (permissions.includes("history")) {
        await browser.storage.local.set({ "general-history": false });
    }

    if (permissions.includes("clipboardRead")) {
        await browser.storage.local.set({ "popup-clipboard": false });
    }

    if (permissions.includes("bookmarks")) {
        const config = await browser.storage.local.get(["menu-contexts"]);
        const menuContexts = config["menu-contexts"];
        await browser.storage.local.set({
            "menu-contexts": menuContexts.filter((c) => "bookmark" !== c),
        });
    }
};
