"use strict";

define([], function () {

    /**
     * L'identifiant de la file d'attente des musiques.
     */
    const PLAYLIST_ID = 0;

    /**
     * L'URL du répertoire où sont les sons de Arte Radio.
     */
    const BASE_URL = "https://download.www.arte.tv/permanent/arteradio/sites" +
                                                         "/default/files/sons/";

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire un son sur Kodi.
     *
     * @param {String} url L'URL d'un son de Arte Radio.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du fichier.
     */
    rules.set(["https://www.arteradio.com/son/*"], function (url) {
        return fetch(url.toString()).then(function (response) {
            return response.text();
        }).then(function (data) {
            const doc = new DOMParser().parseFromString(data, "text/html");

            const file = BASE_URL + doc.querySelector(".player-main-playlist" +
                                                      " a[data-sound-href]")
                                       .getAttribute("data-sound-href");
            return {
                "playlistid": PLAYLIST_ID,
                "file":       file
            };
        });
    });

    return rules;
});
