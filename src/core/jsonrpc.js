"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * Le message d'erreur si la connexion a échouée.
     */
    const NETWORK_ERROR = "NetworkError when attempting to fetch resource.";

    /**
     * Envoie une requête à Kodi en utilisant le protocol JSON-RPC.
     *
     * @param {string} method La méthode envoyée à Kodi.
     * @param {Object} params Les paramètres de la méthode.
     * @return {Promise} La réponse de Kodi.
     */
    const request = function (method, params = {}) {
        const keys = [
            "connection-port", "connection-username", "connection-password",
            "connection-host"
        ];
        return browser.storage.local.get(keys).then(function (config) {
            if (!("connection-host" in config && "connection-port" in config)) {
                throw new PebkacError("unconfigured");
            }

            const url = "http://" + config["connection-host"] +
                              ":" + config["connection-port"] + "/jsonrpc";
            const init = {
                "method":  "POST",
                "headers": { "Content-Type": "application/json" },
                "body":    JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  method,
                    "params":  params
                })
            };
            if ("connection-username" in config) {
                init.headers.Authorization =
                       "Basic " + btoa(config["connection-username"] + ":" +
                                       config["connection-password"]);
            }
            return fetch(url, init);
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }

            if (400 === response.status) {
                throw new PebkacError("notfound");
            }
            if (401 === response.status) {
                throw new PebkacError("unauthorized");
            }
            throw new Error(response.statusText);
        }).then(function (response) {
            if ("error" in response) {
                throw new Error(response.error.message);
            }
            return response.result;
        }).catch(function (error) {
            if (error.message.endsWith(" is not a valid URL.")) {
                throw new PebkacError("badhost");
            }
            if (NETWORK_ERROR === error.message) {
                throw new PebkacError("notfound");
            }
            throw error;
        });
    };

    /**
     * Teste la connexion à Kodi.
     *
     * @param {Event} event L'évènement du clic.
     * @return {Promise} La réponse de Kodi.
     */
    const check = function () {
        return request("JSONRPC.Version");
    };

    /**
     * Ajoute un média à la liste de lecture.
     *
     * @param {string} file L'URL envoyé à Kodi.
     * @return {Promise} La réponse de Kodi.
     */
    const add = function (file) {
        return request("Playlist.Add", { "playlistid": 1, "item": { file } });
    };

    /**
     * Envoi un média.
     *
     * @param {string} file L'URL envoyé à Kodi.
     * @return {Promise} La réponse de Kodi.
     */
    const send = function (file) {
        // Vider la liste de lecture, ajouter le nouveau média et lancer la
        // lecture.
        return request("Playlist.Clear", { "playlistid": 1 }).then(function () {
            return add(file);
        }).then(function () {
            return request("Player.Open", { "item": { "playlistid": 1 } });
        });
    };

    /**
     * Ajoute un média à la liste de lecture.
     *
     * @param {string} file L'URL envoyé à Kodi.
     * @return {Promise} La réponse de Kodi.
     */
    const insert = function (file) {
        return request("Player.GetProperties",
                       { "playerid": 1, "properties": ["position"] }).then(
                                                         function (properties) {
            return request("Playlist.Insert",
                           { "playlistid": 1,
                             "position":   properties.position + 1,
                             "item":       { file } });
        });
    };

    /**
     * Passe au précédent média dans la liste de lecture.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const previous = function () {
        return request("Player.GoTo", { "playerid": 1, "to": "previous" });
    };

    /**
     * Arrête la lecture.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const stop = function () {
        return request("Player.Stop", { "playerid": 1 });
    };

    /**
     * Démarre la lecture.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const open = function () {
        return request("Player.Open", { "item": { "playlistid": 1 } });
    };

    /**
     * Lance ou mets en pause la lecture.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const playPause = function () {
        return request("Player.PlayPause", { "playerid": 1 });
    };

    /**
     * Passe au prochain média dans la liste de lecture.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const next = function () {
        return request("Player.GoTo", { "playerid": 1, "to": "next" });
    };

    /**
     * Change la vitesse de lecture.
     *
     * @param {number} speed La nouvelle vitesse.
     * @return {Promise} La réponse de Kodi.
     */
    const setSpeed = function (speed) {
        return request("Player.SetSpeed", { "playerid": 1, speed });
    };

    /**
     * Coupe ou remets le son.
     *
     * @param {boolean} mute <code>true</code> pour couper le son ; sinon
     *                       <code>false</code>.
     * @return {Promise} La réponse de Kodi.
     */
    const setMute = function (mute) {
        return request("Application.SetMute", { mute });
    };

    /**
     * Change la volume.
     *
     * @param {number} volume Le nouveau volume (entre <code>0</code> et
                              <code>100</code>).
     * @return {Promise} La réponse de Kodi.
     */
    const setVolume = function (volume) {
        return request("Application.SetVolume", { volume });
    };

    /**
     * Répète la liste de lecture.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const setRepeat = function () {
        return request("Player.SetRepeat",
                       { "playerid": 1, "repeat": "cycle" });
    };

    /**
     * Mélange la liste de lecture.
     *
     * @param {boolean} shuffle <code>true</<code> pour mélanger la liste de
     *                          lecture ; sinon <code>false</code>.
     * @return {Promise} La réponse de Kodi.
     */
    const setShuffle = function (shuffle) {
        return request("Player.SetShuffle", { "playerid": 1, shuffle });
    };

    /**
     * Vide la liste de lecture.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const clear = function () {
        return request("Playlist.Clear", { "playlistid": 1 });
    };

    /**
     * Récupère les propriétés de Kodi.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const getProperties = function () {
        return request("Application.GetProperties",
                       { "properties": ["muted", "volume"] })
                                                  .then(function (application) {
            return request("Player.GetActivePlayers")
                                                    .then(function (playerids) {
                if (0 === playerids.length || 1 !== playerids[0].playerid) {
                    return {
                        "speed":    null,
                        "repeat":   "off",
                        "shuffled": false
                    };
                }
                return request("Player.GetProperties", {
                    "playerid":   1,
                    "properties": ["speed", "repeat", "shuffled"]
                });
            }).then(function (player) {
                return Object.assign(application, player);
            });
        });
    };

    return {
        check,
        add,
        send,
        insert,
        previous,
        stop,
        open,
        playPause,
        next,
        setSpeed,
        setMute,
        setVolume,
        setRepeat,
        setShuffle,
        clear,
        getProperties
    };
});
