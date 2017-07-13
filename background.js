"use strict";

const notify = function (title, message) {
    browser.notifications.create(null, {
        "type":    "basic",
        "iconUrl": "img/icon.svg",
        "title":   title,
        "message": message
    });
}; // notify()

const configure = function () {
    const keys = ["port", "username", "password", "host"];
    return browser.storage.local.get(keys).then(function (results) {
        if (!("host" in results)) {
            throw {
                "title":   "Adresse IP non-renseigné",
                "message": "L'adresse IP n'a pas été renseigné dans les" +
                           " préférences l'extension"
            };
        }
        if (!("port" in results)) {
            throw {
                "title":   "Port non-renseigné",
                "message": "Le port n'a pas été renseigné dans les" +
                           " préférences l'extension"
            };
        }
        return results;
    });
}; // configure()

const extract = function (url) {
    if ("www.youtube.com" === url.hostname && "/watch" === url.pathname &&
            url.searchParams.has("v")) {
        return "plugin://plugin.video.youtube/?action=play_video" +
                                       "&videoid=" + url.searchParams.get("v");
    }
    if ("youtu.be" === url.hostname) {
        return "plugin://plugin.video.youtube/?action=play_video" +
                                                     "&videoid=" + url.pathname;
    }
    if ("www.dailymotion.com" === url.hostname &&
            url.pathname.startWith("/video/")) {
        return "plugin://plugin.video.dailymotion_com/?mode=playVideo" +
                                               "&url=" + url.pathname.substr(7);
    }
    throw {
        "title":   "Lien non-suppporté.",
        "message": "Le lien <em>" + url.href + "</em> n'est pas supporté."
    };
}; // extract()

const cast = function ({ menuItemId, linkUrl }) {
    configure().then(function (config) {
        const file = extract(new URL(linkUrl));

        const request = {
            "jsonrpc": "2.0",
            "id":      "1"
        };
        if ("play" === menuItemId) {
            request.method = "Player.Open";
            request.params = { "item": { file } };
        } else {
            request.method = "Playlist.Add";
            request.params = { "playlistid": 1, "item": { file } };
        }

        const url = "http://" + config.host + ":" + config.port + "/jsonrpc";
        const init = {
            "method":  "POST",
            "headers": { "Content-Type": "application/json" },
            "body":    JSON.stringify(request)
        };
        if ("username" in config) {
            init.headers.Authorization = "Basic " + btoa(config.username + ":" +
                                                         config.password);
        }
        return fetch(url, init).then(function (response) {
            return response.json();
        }).then(function (response) {
            if ("error" in response) {
                throw response.error;
            }
            return response.result;
        });
    }).catch(function (error) {
        notify(error.title, error.message);
    });
}; // cast()

browser.contextMenus.create({
    "contexts":          ["link"],
    "id":                "parent",
    "targetUrlPatterns": [
        "https://www.youtube.com/watch*", "https://youtu.be/*",
        "http://www.dailymotion.com/video/"
    ],
    "title":             "Diffuser sur Kodi"
});
browser.contextMenus.create({
    "contexts":          ["link"],
    "id":                "play",
    "onclick":           cast,
    "parentId":          "parent",
    "targetUrlPatterns": [
        "https://www.youtube.com/watch*", "https://youtu.be/*",
        "http://www.dailymotion.com/video/*"
    ],
    "title":             "Lire"
});
browser.contextMenus.create({
    "contexts":          ["link"],
    "id":                "add",
    "onclick":           cast,
    "parentId":          "parent",
    "targetUrlPatterns": [
        "https://www.youtube.com/watch*", "https://youtu.be/*",
        "http://www.dailymotion.com/video/*"
    ],
    "title":             "Placer en file d'attente"
});
