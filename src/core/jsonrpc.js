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
    }; // request()

    /**
     * Teste la connexion à Kodi.
     *
     * @param {Event} event L'évènement du clic.
     * @return {Promise} La réponse de Kodi.
     */
    const check = function () {
        return request("JSONRPC.Version");
    }; // check()

    /**
     * Ajoute un média à la liste de lecture.
     *
     * @param {number} playlistid <code>0</code> pour la liste de lecture des
     *                            musiques ; <code>1</code> pour les vidéos.
     * @param {string} file       L'URL envoyé à Kodi.
     * @return {Promise} La réponse de Kodi.
     */
    const add = function (playlistid, file) {
        return request("Playlist.Add", { playlistid, "item": { file } });
    }; // add()

    /**
     * Envoi un média.
     *
     * @param {number} playlistid <code>0</code> pour la liste de lecture des
     *                            musiques ; <code>1</code> pour les vidéos.
     * @param {string} file       L'URL envoyé à Kodi.
     * @return {Promise} La réponse de Kodi.
     */
    const send = function (playlistid, file) {
        // Vider la liste de lecture, ajouter le nouveau média et lancer la
        // lecture.
        return request("Playlist.Clear", { playlistid }).then(function () {
            return add(playlistid, file);
        }).then(function () {
            return request("Player.Open", { "item": { playlistid } });
        });
    }; // send()

    /**
     * Passe au précédent média dans la liste de lecture.
     *
     * @param {number} playerid <code>0</code> pour la liste de lecture des
     *                          musiques ; <code>1</code> pour les vidéos.
     * @return {Promise} La réponse de Kodi.
     */
    const previous = function (playerid) {
        return request("Player.GoTo", { playerid, "to": "previous" });
    }; // previous()

    /**
     * Arrête la lecture.
     *
     * @param {number} playerid <code>0</code> pour la liste de lecture des
     *                          musiques ; <code>1</code> pour les vidéos.
     * @return {Promise} La réponse de Kodi.
     */
    const stop = function (playerid) {
        return request("Player.Stop", { playerid });
    }; // stop()

    /**
     * Lance ou mets en pause la lecture.
     *
     * @param {number} playerid <code>0</code> pour la liste de lecture des
     *                          musiques ; <code>1</code> pour les vidéos.
     * @return {Promise} La réponse de Kodi.
     */
    const playPause = function (playerid) {
        return request("Player.PlayPause", { playerid });
    }; // playPause()

    /**
     * Passe au prochain média dans la liste de lecture.
     *
     * @param {number} playerid <code>0</code> pour la liste de lecture des
     *                          musiques ; <code>1</code> pour les vidéos.
     * @return {Promise} La réponse de Kodi.
     */
    const next = function (playerid) {
        return request("Player.GoTo", { playerid, "to": "next" });
    }; // next()

    /**
     * Change la vitesse de lecture.
     *
     * @param {number} playerid <code>0</code> pour la liste de lecture des
     *                          musiques ; <code>1</code> pour les vidéos.
     * @param {number} speed    La nouvelle vitesse.
     * @return {Promise} La réponse de Kodi.
     */
    const setSpeed = function (playerid, speed) {
        return request("Player.SetSpeed", { playerid, speed });
    }; // setSpeed()

    /**
     * Coupe ou remets le son.
     *
     * @param {boolean} mute <code>true</code> pour couper le son ; sinon
     *                       <code>false</code>.
     * @return {Promise} La réponse de Kodi.
     */
    const setMute = function (mute) {
        return request("Application.SetMute", { mute });
    }; // setMute()

    /**
     * Change la volume.
     *
     * @param {number} volume Le nouveau volume (entre <code>0</code> et
                              <code>100</code>).
     * @return {Promise} La réponse de Kodi.
     */
    const setVolume = function (volume) {
        return request("Application.SetVolume", { volume });
    }; // setVolume()

    /**
     * Répète la liste de lecture.
     *
     * @param {number} playerid <code>0</code> pour la liste de lecture des
     *                          musiques ; <code>1</code> pour les vidéos.
     * @return {Promise} La réponse de Kodi.
     */
    const setRepeat = function (playerid) {
        return request("Player.SetRepeat", { playerid, "repeat": "cycle" });
    }; // setRepeat()

    /**
     * Mélange la liste de lecture.
     *
     * @param {number} playerid <code>0</code> pour la liste de lecture des
     *                          musiques ; <code>1</code> pour les vidéos.
     * @param {boolean} shuffle <code>true</<code> pour mélanger la liste de
     *                          lecture ; sinon <code>false</code>.
     * @return {Promise} La réponse de Kodi.
     */
    const setShuffle = function (playerid, shuffle) {
        return request("Player.SetShuffle", { playerid, shuffle });
    }; // setShuffle()

    /**
     * Vide la liste de lecture.
     *
     * @param {number} playlistid <code>0</code> pour la liste de lecture des
     *                            musiques ; <code>1</code> pour les vidéos.
     * @return {Promise} La réponse de Kodi.
     */
    const clear = function (playlistid) {
        return request("Playlist.Clear", { playlistid });
    }; // clear()

    /**
     * Récupère les propriétés de Kodi.
     *
     * @return {Promise} La réponse de Kodi.
     */
    const getProperties = function () {
        return request("Player.GetActivePlayers").then(function (playerids) {
            const promises = [];
            promises.push(request("Application.GetProperties", {
                "properties": ["muted", "volume"]
            }));

            if (0 !== playerids.length) {
                promises.push(request("Player.GetProperties", {
                    "playerid":   playerids[0].playerid,
                    "properties": ["playlistid", "speed", "repeat", "shuffled"]
                }));
            }

            return Promise.all(promises).then(function (results) {
                const properties = {
                    "muted":    results[0].muted,
                    "volume":   results[0].volume,
                    "playerid": null,
                    "speed":    0,
                    "repeat":   "off",
                    "shuffled": false
                };
                if (2 === results.length) {
                    properties.playerid = results[1].playlistid;
                    properties.speed    = results[1].speed;
                    properties.repeat   = results[1].repeat;
                    properties.shuffled = results[1].shuffled;
                }
                return properties;
            });
        });
    }; // getProperties()

    return {
        check,
        add,
        send,
        previous,
        stop,
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
