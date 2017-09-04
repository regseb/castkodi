"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo Facebook.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du fichier.
     */
    rules.set(["https://www.facebook.com/*/videos/*/*"], function (url) {
        return fetch(url.toString()).then(function (response) {
            return response.text();
        }).then(function (response) {
            const RE = /hd_src_no_ratelimit:"([^"]+)/;
            const result = RE.exec(response);
            if (null === result) {
                throw new PebkacError("novideo", "Facebook");
            }
            return {
                "playlistid": PLAYLIST_ID,
                "file":       result[1]
            };
        });
    });

    return rules;
});
