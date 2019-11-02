/**
 * @module
 */

import { PebkacError } from "./pebkac.js";

/**
 * La classe du client JSON-RPC pour contacter Kodi.
 *
 * @see {@link https://kodi.wiki/view/JSON-RPC_API}
 */
export const JSONRPC = class {

    /**
     * Teste la connexion à l'API de Kodi.
     *
     * @function check
     * @param {string} host L'URL du serveur JSON-RPC de Kodi.
     * @returns {Promise} Une promesse tenue si l'API est accessible ; sinon une
     *                    promesse rompue.
     */
    static check(host) {
        const jsonrpc = new JSONRPC(host);
        return jsonrpc.version().then(() => jsonrpc.close());
    }

    /**
     * Crée un client JSON-RPC.
     *
     * @param {string} host L'adresse IP (ou le nom de domaine) du serveur
     *                      hébergeant Kodi.
     */
    constructor(host) {
        this.host = host;
        this.id = 0;
        this.listeners = new Map();
        this.client = null;
        this.onChanged         = Function.prototype;
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

    /**
     * Écoute une notification de Kodi.
     *
     * @function onMessage
     * @param {object} event La notification envoyée par Kodi.
     */
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

    /**
     * Envoi une requête JSON-RPC à Kodi.
     *
     * @function request
     * @param {string} method      La méthode de l'API appelée.
     * @param {object} [params={}] Les paramètres de la méthode.
     * @returns {Promise} La réponse de Kodi.
     */
    request(method, params = {}) {
        if (null === this.client) {
            this.client = new Promise((resolve, reject) => {
                if ("" === this.host) {
                    throw new PebkacError("unconfigured");
                }
                let url;
                try {
                    url = new URL("ws://" + this.host + ":9090/jsonrpc");
                } catch {
                    throw new PebkacError("badHost", this.host);
                }
                // Si l'URL est incorrecte (car le nom de domaine a été corrigé
                // par le constructeur).
                if (url.hostname !== this.host.toLowerCase()) {
                    throw new PebkacError("badHost", this.host);
                }

                const ws = new WebSocket(url);
                ws.addEventListener("open", () => resolve(ws));
                ws.addEventListener("error", () => {
                    reject(new PebkacError("notFound", this.host));
                });
                ws.addEventListener("close", () => {
                    this.client = null;
                });

                ws.addEventListener("message", this.onMessage.bind(this));
            }).catch((err) => {
                this.client = null;
                throw err;
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
     * Ferme la connexion.
     *
     * @function close
     */
    close() {
        if (null !== this.client) {
            this.client.then((ws) => ws.close());
        }
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
     * Insère un média à la liste de lecture.
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
     * @function seek
     * @param {number} time La nouvelle position.
     * @returns {Promise} La réponse de Kodi.
     */
    seek(time) {
        return this.request("Player.Seek", {
            "playerid": 1,
            "value":    {
                "time": {
                    "hours":        Math.trunc(time / 3600),
                    "minutes":      Math.trunc(time / 60) % 60,
                    "seconds":      time % 60,
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

    /**
     * Affiche le menu contextuel.
     *
     * @function contextMenu
     * @returns {Promise} La réponse de Kodi.
     */
    contextMenu() {
        return this.request("Input.ContextMenu");
    }

    /**
     * Navigue vers le haut dans l'interface.
     *
     * @function up
     * @returns {Promise} La réponse de Kodi.
     */
    up() {
        return this.request("Input.Up");
    }

    /**
     * Affiche les informations.
     *
     * @function info
     * @returns {Promise} La réponse de Kodi.
     */
    info() {
        return this.request("Input.Info");
    }

    /**
     * Navigue vers la gauche dans l'interface.
     *
     * @function left
     * @returns {Promise} La réponse de Kodi.
     */
    left() {
        return this.request("Input.Left");
    }

    /**
     * Sélectionne l'élément courant.
     *
     * @function select
     * @returns {Promise} La réponse de Kodi.
     */
    select() {
        return this.request("Input.Select");
    }

    /**
     * Navigue vers la droite dans l'interface.
     *
     * @function right
     * @returns {Promise} La réponse de Kodi.
     */
    right() {
        return this.request("Input.Right");
    }

    /**
     * Retourne en arrière dans l'interface.
     *
     * @function back
     * @returns {Promise} La réponse de Kodi.
     */
    back() {
        return this.request("Input.Back");
    }

    /**
     * Navigue vers le bas dans l'interface.
     *
     * @function down
     * @returns {Promise} La réponse de Kodi.
     */
    down() {
        return this.request("Input.Down");
    }

    /**
     * Affiche le <em>menu à l'écran</em> (<em>On Screen Display</em>) du
     * lecteur courant.
     *
     * @function showOSD
     * @returns {Promise} La réponse de Kodi.
     */
    showOSD() {
        return this.request("Input.ShowOSD");
    }

    /**
     * Passe (ou quitte) en plein écran.
     *
     * @function setFullscreen
     * @returns {Promise} La réponse de Kodi.
     */
    setFullscreen() {
        return this.request("GUI.SetFullscreen", { "fullscreen": "toggle" });
    }

    /**
     * Récupère la version du protocol JSON-RPC.
     *
     * @function version
     * @returns {Promise} La version du protocol.
     */
    version() {
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
                // Regrouper les propriétés et convertir les durées.
                return Object.assign({}, application, player, {
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

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @type {object}
 */
export const jsonrpc = new JSONRPC("");

/**
 * Crée le client JSON-RPC pour contacter Kodi.
 *
 * @function change
 * @param {object} changes Les paramètres modifiés dans la configuration.
 */
const change = function (changes) {
    // Ignorer tous les changements sauf ceux liés au serveur.
    if (!Object.entries(changes).some(([k, v]) => k.startsWith("server-") &&
                                                  "newValue" in v)) {
        return;
    }

    browser.storage.local.get().then((config) => {
        jsonrpc.close();
        jsonrpc.host = config["server-list"][config["server-active"]].host;
        jsonrpc.onChanged();
    });
};

// Simuler un changement de configuration pour se connecter au bon serveur. Ce
// bidouillage est utile quand ce fichier est chargé depuis les options ou la
// popin (dans le background, cette migration qui change la configuration).
change({ "server-": { "newValue": null } });
browser.storage.onChanged.addListener(change);
