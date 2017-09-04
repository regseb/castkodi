"use strict";

require.config({
    "baseUrl": "core"
});

require(["notify", "scrapers", "jsonrpc"],
        function (notify, scrapers, jsonrpc) {

    /**
     * Diffuse un média sur Kodi.
     *
     * @param {Object} info Les informations fournies par le menu contextuel.
     */
    const cast = function (info) {
        const urls = [info.selectionText, info.linkUrl, info.srcUrl,
                      info.pageUrl];
        const url = new URL(urls.find((u) => undefined !== u && "" !== u));
        scrapers.extract(url).then(function ({ playlistid, file }) {
            return info.menuItemId.startsWith("play")
                                                ? jsonrpc.send(playlistid, file)
                                                : jsonrpc.add(playlistid, file);
        }).catch(notify);
    }; // cast()

    // Ajouter des options dans le menu contextuel des liens, éléments audio et
    // video.
    browser.contextMenus.create({
        "contexts":          ["audio", "link", "video"],
        "id":                "parent_target",
        "targetUrlPatterns": scrapers.patterns,
        "title":             browser.i18n.getMessage("contextMenus_parent")
    });
    browser.contextMenus.create({
        "contexts":          ["audio", "link", "video"],
        "id":                "play_target",
        "onclick":           cast,
        "parentId":          "parent_target",
        "targetUrlPatterns": scrapers.patterns,
        "title":             browser.i18n.getMessage("contextMenus_play")
    });
    browser.contextMenus.create({
        "contexts":          ["audio", "link", "video"],
        "id":                "add_target",
        "onclick":           cast,
        "parentId":          "parent_target",
        "targetUrlPatterns": scrapers.patterns,
        "title":             browser.i18n.getMessage("contextMenus_add")
    });

    // Ajouter des options dans le menu contextuel des pages.
    browser.contextMenus.create({
        "contexts":            ["page"],
        "id":                  "parent_document",
        "documentUrlPatterns": scrapers.patterns,
        "title":               browser.i18n.getMessage("contextMenus_parent")
    });
    browser.contextMenus.create({
        "contexts":            ["page"],
        "id":                  "play_document",
        "onclick":             cast,
        "parentId":            "parent_document",
        "documentUrlPatterns": scrapers.patterns,
        "title":               browser.i18n.getMessage("contextMenus_play")
    });
    browser.contextMenus.create({
        "contexts":            ["page"],
        "id":                  "add_document",
        "onclick":             cast,
        "parentId":            "parent_document",
        "documentUrlPatterns": scrapers.patterns,
        "title":               browser.i18n.getMessage("contextMenus_add")
    });

    // Ajouter des options dans le menu contextuel des textes sélectionnés.
    browser.contextMenus.create({
        "contexts": ["selection"],
        "id":       "parent_selection",
        "title":    browser.i18n.getMessage("contextMenus_parent")
    });
    browser.contextMenus.create({
        "contexts": ["selection"],
        "id":       "play_selection",
        "onclick":  cast,
        "parentId": "parent_selection",
        "title":    browser.i18n.getMessage("contextMenus_play")
    });
    browser.contextMenus.create({
        "contexts": ["selection"],
        "id":       "add_selection",
        "onclick":  cast,
        "parentId": "parent_selection",
        "title":    browser.i18n.getMessage("contextMenus_add")
    });
});
