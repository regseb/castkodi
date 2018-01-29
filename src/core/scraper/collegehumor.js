"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de CollegeHumor.
     */
    const PLUGIN_URL = "plugin://plugin.video.collegehumor/";

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo CollegeHumor.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules.set(["*://www.collegehumor.com/video/*/*"], function (url) {
        const RE = /^\/video\/([0-9]+)\//;
        const result = RE.exec(url.pathname);
        if (null === result) {
            return Promise.reject(new PebkacError("novideo", "CollegeHumor"));
        }
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL + "watch/" + result[1]
        });
    });

    return rules;
});
