"use strict";

require(["jsonrpc", "scrapers"], function (jsonrpc, scrapers) {

    /**
     * Notifie l'utilisateur d'un message d'erreur.
     *
     * @param {Object} error L'erreur affichée dans la notification.
     */
    const notify = function (error) {
        browser.notifications.create(null, {
            "type":    "basic",
            "iconUrl": "img/icon.svg",
            "title":   "PebkacError" === error.name
                       ? error.title
                       : browser.i18n.getMessage("notifications_unknown_title"),
            "message": error.message
        });
    }; // notify()

    /**
     * Lit un média.
     *
     * @param {number} playlistid <code>0</code> pour la liste de lecture des
     *                            musiques ; <code>1</code> pour les vidéos.
     * @param {string} file       L'URL envoyé à Kodi.
     * @return {Promise} La réponse de Kodi.
     */
    const play = function (playlistid, file) {
        // Vider la liste de lecture, ajouter le nouveau média et lancer la
        // lecture.
        return jsonrpc("Playlist.Clear", { playlistid }).then(function () {
            return jsonrpc("Playlist.Add", { playlistid, "item": { file } });
        }).then(function () {
            return jsonrpc("Player.Open", { "item": { playlistid } });
        });
    }; // play()

    /**
     * Ajoute un média à la liste de lecture.
     *
     * @param {number} playlistid <code>0</code> pour la liste de lecture des
     *                            musiques ; <code>1</code> pour les vidéos.
     * @param {string} file       L'URL envoyé à Kodi.
     * @return {Promise} La réponse de Kodi.
     */
    const add = function (playlistid, file) {
        return jsonrpc("Playlist.Add", { playlistid, "item": { file } });
    }; // add()

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
            return info.menuItemId.startsWith("play") ? play(playlistid, file)
                                                      : add(playlistid, file);
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
