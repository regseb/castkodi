/**
 * @module core/jsonrpc
 */

import { PebkacError } from "./pebkac.js";

/**
 * La classe du client JSON-RPC pour contacter Kodi.
 */
export const JSONRPC = class {

    static check(host) {
        return new JSONRPC(host).getVersion();
    }

    /**
     * Crée un client JSON-RPC.
     *
     * @param {string} host L'URL du serveur JSON-RPC de Kodi.
     */
    constructor(host) {
        this.host = host;
        this.id = 0;
        this.listeners = new Map();
        this.client = null;
        this.onVolumeChanged   = Function.prototype;
        this.onAVStart         = Function.prototype;
        this.onPause           = Function.prototype;
        this.onPlay            = Function.prototype;
        this.onPropertyChanged = Function.prototype;
        this.onResume          = Function.prototype;
        this.onSeek            = Function.prototype;
        this.onSpeedChanged    = Function.prototype;
        this.onStop            = Function.prototype;
    }

    onMessage(event) {
        const msg = JSON.parse(event.data);
        if ("id" in msg) {
            if ("error" in msg) {
                this.listeners.get(msg.id).reject(new Error(msg.error.message));
            } else {
                this.listeners.get(msg.id).resolve(msg.result);
            }
            this.listeners.delete(msg.id);
        } else {
            const data = msg.params.data;
            switch (msg.method) {
                case "Application.OnVolumeChanged":
                    this.onVolumeChanged(data);
                    break;
                case "Player.OnAVStart":
                    this.onAVStart(data);
                    break;
                case "Player.OnPause":
                    this.onPause(data);
                    break;
                case "Player.OnPlay":
                    this.onPlay(data);
                    break;
                case "Player.OnPropertyChanged":
                    this.onPropertyChanged(data);
                    break;
                case "Player.OnResume":
                    this.onResume(data);
                    break;
                case "Player.OnSeek":
                    this.onSeek({
                        "item":   data.item,
                        "player": {
                            "playerid": data.player.playerid,
                            "speed":    data.player.speed,
                            "time":     data.player.time.hours * 3600 +
                                        data.player.time.minutes * 60 +
                                        data.player.time.seconds
                        }
                    });
                    break;
                case "Player.OnSpeedChanged":
                    this.onSpeedChanged(data);
                    break;
                case "Player.OnStop":
                    this.onStop(data);
                    break;
                default:
                    // Ignorer cette notification.
            }
        }
    }

    request(method, params = {}) {
        if (null === this.client) {
            this.client = new Promise((resolve, reject) => {
                if ("" === this.host) {
                    reject(new PebkacError("unconfigured"));
                    return;
                }
                let url;
                try {
                    url = new URL("ws://" + this.host + ":9090/jsonrpc");
                } catch {
                    reject(new PebkacError("badHost", this.host));
                    return;
                }
                // Si l'URL est incorrecte (car le nom de domaine a été corrigé
                // par le constructeur).
                if (url.hostname !== this.host.toLowerCase()) {
                    reject(new PebkacError("badHost", this.host));
                    return;
                }

                const ws = new WebSocket(url);
                ws.onopen  = () => resolve(ws);
                ws.onerror = () => {
                    this.client = null;
                    reject(new PebkacError("notFound", this.host));
                };
                ws.onclose = () => {
                    this.client = null;
                };

                ws.onmessage = this.onMessage.bind(this);
            });
        }

        return this.client.then((ws) => {
            return new Promise((resolve, reject) => {
                this.listeners.set(++this.id, { resolve, reject });
                ws.send(JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      this.id,
                    "method":  method,
                    "params":  params
                }));
            });
        });
    }

    /**
     * Ajoute un média à la liste de lecture.
     *
     * @function add
     * @param {string} file L'URL envoyée à Kodi.
     * @returns {Promise} La réponse de Kodi.
     */
    add(file) {
        return this.request("Playlist.Add", {
            "playlistid": 1,
            "item":       { file }
        });
    }

    /**
     * Envoi un média.
     *
     * @function send
     * @param {string} file L'URL envoyée à Kodi.
     * @returns {Promise} La réponse de Kodi.
     */
    send(file) {
        // Vider la liste de lecture, ajouter le nouveau média et lancer la
        // lecture.
        return this.clear().then(() => {
            return this.add(file);
        }).then(() => {
            return this.request("Player.Open", { "item": { "playlistid": 1 } });
        });
    }

    /**
     * Ajoute un média à la liste de lecture.
     *
     * @function insert
     * @param {string} file L'URL envoyée à Kodi.
     * @returns {Promise} La réponse de Kodi.
     */
    insert(file) {
        return this.request("Player.GetProperties", {
            "playerid":   1,
            "properties": ["position"]
        }).then((properties) => {
            return this.request("Playlist.Insert", {
                "playlistid": 1,
                "position":   properties.position + 1,
                "item":       { file }
            });
        });
    }

    /**
     * Passe au précédent média dans la liste de lecture.
     *
     * @function previous
     * @returns {Promise} La réponse de Kodi.
     */
    previous() {
        return this.request("Player.GoTo", { "playerid": 1, "to": "previous" });
    }

    /**
     * Arrête la lecture.
     *
     * @function stop
     * @returns {Promise} La réponse de Kodi.
     */
    stop() {
        return this.request("Player.Stop", { "playerid": 1 });
    }

    /**
     * Démarre la lecture.
     *
     * @function open
     * @returns {Promise} La réponse de Kodi.
     */
    open() {
        return this.request("Player.Open", { "item": { "playlistid": 1 } });
    }

    /**
     * Lance ou mets en pause la lecture.
     *
     * @function playPause
     * @returns {Promise} La réponse de Kodi.
     */
    playPause() {
        return this.request("Player.PlayPause", { "playerid": 1 });
    }

    /**
     * Déplace le curseur de lecture.
     *
     * @function playPause
     * @param {number} value La nouvelle position.
     * @returns {Promise} La réponse de Kodi.
     */
    seek(value) {
        return this.request("Player.Seek", {
            "playerid": 1,
            "value":    {
                "time": {
                    "hours":        Math.trunc(value / 3600),
                    "minutes":      Math.trunc(value / 60 % 60),
                    "seconds":      value % 60,
                    "milliseconds": 0
                }
            }
        });
    }

    /**
     * Passe au prochain média dans la liste de lecture.
     *
     * @function next
     * @returns {Promise} La réponse de Kodi.
     */
    next() {
        return this.request("Player.GoTo", { "playerid": 1, "to": "next" });
    }

    /**
     * Change la vitesse de lecture.
     *
     * @function setSpeed
     * @param {number} speed La nouvelle vitesse.
     * @returns {Promise} La réponse de Kodi.
     */
    setSpeed(speed) {
        return this.request("Player.SetSpeed", { "playerid": 1, speed });
    }

    /**
     * Coupe ou remets le son.
     *
     * @function setMute
     * @param {boolean} mute <code>true</code> pour couper le son ; sinon
     *                       <code>false</code>.
     * @returns {Promise} La réponse de Kodi.
     */
    setMute(mute) {
        return this.request("Application.SetMute", { mute });
    }

    /**
     * Change le volume et remettre le son.
     *
     * @function setVolume
     * @param {number} volume Le nouveau volume (entre <code>0</code> et
     *                        <code>100</code>).
     * @returns {Promise} La réponse de Kodi.
     */
    setVolume(volume) {
        return Promise.all([
            this.setMute(false),
            this.request("Application.SetVolume", { volume })
        ]);
    }

    /**
     * Répète la liste de lecture.
     *
     * @function setRepeat
     * @returns {Promise} La réponse de Kodi.
     */
    setRepeat() {
        return this.request("Player.SetRepeat", {
            "playerid": 1,
            "repeat":   "cycle"
        });
    }

    /**
     * Mélange la liste de lecture.
     *
     * @function setShuffle
     * @param {boolean} shuffle <code>true</<code> pour mélanger la liste de
     *                          lecture ; sinon <code>false</code>.
     * @returns {Promise} La réponse de Kodi.
     */
    setShuffle(shuffle) {
        return this.request("Player.SetShuffle", { "playerid": 1, shuffle });
    }

    /**
     * Vide la liste de lecture.
     *
     * @function clear
     * @returns {Promise} La réponse de Kodi.
     */
    clear() {
        return this.request("Playlist.Clear", { "playlistid": 1 });
    }

    getVersion() {
        return this.request("JSONRPC.Version");
    }

    /**
     * Récupère les propriétés de Kodi.
     *
     * @function getProperties
     * @returns {Promise} Les valeurs des propriétés.
     */
    getProperties() {
        return this.request("Application.GetProperties", {
            "properties": ["muted", "volume"]
        }).then((application) => {
            return this.request("Player.GetActivePlayers").then((playerids) => {
                if (0 === playerids.length || 1 !== playerids[0].playerid) {
                    return {
                        "live":      false,
                        "repeat":    "off",
                        "shuffled":  false,
                        "speed":     null,
                        "time":      { "hours": 0, "minutes": 0, "seconds": 0 },
                        "totaltime": { "hours": 0, "minutes": 0, "seconds": 0 }
                    };
                }
                return this.request("Player.GetProperties", {
                    "playerid":   1,
                    "properties": [
                        "repeat", "shuffled", "speed", "time", "totaltime"
                    ]
                });
            }).then((player) => {
                return Object.assign({}, application, {
                    "repeat":    player.repeat,
                    "shuffled":  player.shuffled,
                    "speed":     player.speed,
                    "time":      player.time.hours * 3600 +
                                 player.time.minutes * 60 +
                                 player.time.seconds,
                    "totaltime": player.totaltime.hours * 3600 +
                                 player.totaltime.minutes * 60 +
                                 player.totaltime.seconds
                });
            });
        });
    }
};
