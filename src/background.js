"use strict";

const SCRAPERS = [
    "dailymotion", "soundcloud", "twitch", "vimeo", "youtube", "video", "audio"
].map((s) => "scraper/" + s);

require(["jsonrpc", ...SCRAPERS], function (jsonrpc, ...scrapers) {

    const PATTERNS = scrapers.reduce(function (patterns, scraper) {
        return patterns.concat(scraper.patterns);
    }, []);

    const notify = function (message) {
        browser.notifications.create(null, {
            "type":    "basic",
            "iconUrl": "img/icon.svg",
            "title":   browser.i18n.getMessage("notifications_error"),
            "message": message
        });
    }; // notify()

    const extract = function (urls) {
        const url = new URL(urls.find((u) => undefined !== u && "" !== u));
        return scrapers.reduce(function (previous, next) {
            return previous.then(function (data) {
                return null === data ? next.extract(url)
                                     : data;
            });
        }, Promise.resolve(null));
    }; // extract()

    const play = function (playlistid, file) {
        console.log(file);
        // Vider la liste de lecture, ajouter le nouveau média et lancer la
        // lecture.
        return jsonrpc("Playlist.Clear", { playlistid }).then(function () {
            return jsonrpc("Playlist.Add", { playlistid, "item": { file } });
        }).then(function () {
            return jsonrpc("Player.Open", { "item": { playlistid } });
        });
    }; // play()

    const add = function (playlistid, file) {
        return jsonrpc("Playlist.Add", { playlistid, "item": { file } });
    }; // add()

    const cast = function (info) {
        const urls = [info.selectionText, info.linkUrl, info.srcUrl,
                      info.pageUrl];
        extract(urls).then(function (data) {
            if (null === data) {
                throw new Error("Link not supported.");
            }
            return info.menuItemId.startsWith("play")
                                              ? play(data.playlistid, data.file)
                                              : add(data.playlistid, data.file);
        }).catch(function (error) {
            notify(error.message);
        });
    }; // cast()

    // Ajouter des options dans le menu contextuel des liens, éléments audio et
    // video.
    browser.contextMenus.create({
        "contexts":          ["audio", "link", "video"],
        "id":                "parent_target",
        "targetUrlPatterns": PATTERNS,
        "title":             browser.i18n.getMessage("contextMenus_parent")
    });
    browser.contextMenus.create({
        "contexts":          ["audio", "link", "video"],
        "id":                "play_target",
        "onclick":           cast,
        "parentId":          "parent_target",
        "targetUrlPatterns": PATTERNS,
        "title":             browser.i18n.getMessage("contextMenus_play")
    });
    browser.contextMenus.create({
        "contexts":          ["audio", "link", "video"],
        "id":                "add_target",
        "onclick":           cast,
        "parentId":          "parent_target",
        "targetUrlPatterns": PATTERNS,
        "title":             browser.i18n.getMessage("contextMenus_add")
    });

    // Ajouter des options dans le menu contextuel des pages.
    browser.contextMenus.create({
        "contexts":            ["page"],
        "id":                  "parent_document",
        "documentUrlPatterns": PATTERNS,
        "title":               browser.i18n.getMessage("contextMenus_parent")
    });
    browser.contextMenus.create({
        "contexts":            ["page"],
        "id":                  "play_document",
        "onclick":             cast,
        "parentId":            "parent_document",
        "documentUrlPatterns": PATTERNS,
        "title":               browser.i18n.getMessage("contextMenus_play")
    });
    browser.contextMenus.create({
        "contexts":            ["page"],
        "id":                  "add_document",
        "onclick":             cast,
        "parentId":            "parent_document",
        "documentUrlPatterns": PATTERNS,
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
