/**
 * @module
 */

import { NotificationListener } from "./notificationlistener.js";

/**
 * Convertit un horodatage vers un temps au format objet.
 *
 * @param {number} timestamp L'horadatage.
 * @returns {object} Le temps au format objet contenant l'heure, les minutes,
 *                   les secondes et les millisecondes.
 */
const toTime = function (timestamp) {
    return {
        hours:        Math.trunc(timestamp / 3600),
        minutes:      Math.trunc(timestamp / 60) % 60,
        seconds:      timestamp % 60,
        milliseconds: 0,
    };
};

/**
 * Convertit un temps au format objet vers un horodatage.
 *
 * @param {object} time              Le temps au format objet contenant l'heure,
 *                                   les minutes, les secondes et les
 *                                   millisecondes.
 * @param {number} time.hours        L'heure du temps.
 * @param {number} time.minutes      La minute du temps.
 * @param {number} time.seconds      La seconde du temps.
 * @param {number} time.milliseconds La milliseconde du temps.
 * @returns {number} L'horadatage.
 */
const toTimestamp = function (time) {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
};

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>Player</em> de Kodi.
 *
 * @see {@link https://kodi.wiki/view/JSON-RPC_API}
 */
export const Player = class {

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>Player</em>.
     *
     * @param {object}   kodi      Le client pour contacter Kodi.
     * @param {Function} kodi.send La méthode pour envoyer une requête.
     */
    constructor(kodi) {
        this.kodi = kodi;

        this.onAVStart         = new NotificationListener();
        this.onPause           = new NotificationListener();
        this.onPlay            = new NotificationListener();
        this.onPropertyChanged = new NotificationListener();
        this.onResume          = new NotificationListener();
        this.onSeek            = new NotificationListener();
        this.onSpeedChanged    = new NotificationListener();
        this.onStop            = new NotificationListener();
    }

    /**
     * Récupère des propriétés de l'espace de nom <em>Player</em> de Kodi.
     *
     * @param {Array.<string>} properties Les noms des propriétés demandées.
     * @returns {Promise.<object>} Une promesse contenant les valeurs des
     *                             propriétés.
     */
    async getProperties(properties) {
        const results = await this.kodi.send("Player.GetProperties", {
            playerid:   1,
            properties: properties.map((property) => {
                return "timestamp" === property || "totaltimestamp" === property
                                                         ? property.slice(0, -5)
                                                         : property;
            }),
        });
        return Object.fromEntries(Object.entries(results)
            .map(([key, value]) => {
                return "time" === key || "totaltime" === key
                                           ? [key + "stamp", toTimestamp(value)]
                                           : [key, value];
            }));
    }

    /**
     * Récupère une propriété de l'espace de nom <em>Player</em> de Kodi.
     *
     * @param {string} property Le nom de la propriété demandée.
     * @returns {Promise.<*>} Une promesse contenant la valeur de la propriété.
     */
    async getProperty(property) {
        const result = await this.getProperties([property]);
        return result[property];
    }

    /**
     * Passe au prochain élément dans la liste de lecture.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    next() {
        return this.kodi.send("Player.GoTo", { playerid: 1, to: "next" });
    }

    /**
     * Démarre la lecture.
     *
     * @param {number} position La position dans la liste de lecture.
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    open(position) {
        return this.kodi.send("Player.Open", {
            item: { playlistid: 1, position },
        });
    }

    /**
     * Lance ou mets en pause la lecture.
     *
     * @returns {Promise.<number>} Une promesse contenant la vitesse de lecture.
     */
    async playPause() {
        const result = await this.kodi.send("Player.PlayPause", {
            playerid: 1,
        });
        return result.speed;
    }

    /**
     * Passe au précédent élément dans la liste de lecture.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    previous() {
        return this.kodi.send("Player.GoTo", { playerid: 1, to: "previous" });
    }

    /**
     * Déplace le curseur de lecture.
     *
     * @param {number} timestamp La nouvelle position en seconde.
     * @returns {Promise.<number>} Une promesse contenant la nouvelle position
     *                             en seconde.
     */
    async seek(timestamp) {
        const result = await this.kodi.send("Player.Seek", {
            playerid: 1,
            value:    {
                time: toTime(timestamp),
            },
        });
        return toTimestamp(result.time);
    }

    /**
     * Répète la liste de lecture.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    setRepeat() {
        return this.kodi.send("Player.SetRepeat", {
            playerid: 1,
            repeat:   "cycle",
        });
    }

    /**
     * Mélange la liste de lecture.
     *
     * @param {boolean} shuffle <code>true</<code> pour mélanger la liste de
     *                          lecture ; sinon <code>false</code>.
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    setShuffle(shuffle) {
        return this.kodi.send("Player.SetShuffle", { playerid: 1, shuffle });
    }

    /**
     * Change la vitesse de lecture.
     *
     * @param {string} speed La variation de la vitesse :
     *                       <code>"increment"</code> ou
     *                       <code>"decrement"</code>.
     * @returns {Promise.<number>} Une promesse contenant la nouvelle vitesse de
     *                             lecture.
     */
    async setSpeed(speed) {
        const result = await this.kodi.send("Player.SetSpeed", {
            playerid: 1,
            speed,
        });
        return result.speed;
    }

    /**
     * Arrête la lecture.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    stop() {
        return this.kodi.send("Player.Stop", { playerid: 1 });
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom
     * <em>Player</em>.
     *
     * @param {object} notification             La notification reçu de Kodi.
     * @param {string} notification.method      La méthode de la notification.
     * @param {object} notification.params      Les paramètres de la méthode.
     * @param {*}      notification.params.data Les données des paramètres.
     */
    handleNotification({ method, params: { data } }) {
        // Garder seulement les notifications du lecteur de vidéo.
        if (!method.startsWith("Player.") ||
                "player" in data && 1 !== data.player.playerid) {
            return;
        }
        switch (method) {
            case "Player.OnAVStart":
                // La position de l'élément joué n'est pas fournit.
                this.onAVStart.dispatch(data.player.speed);
                break;
            case "Player.OnPause":
                this.onPause.dispatch(data.player.speed);
                break;
            case "Player.OnPlay":
                // La position de l'élément joué n'est pas fournit.
                this.onPlay.dispatch(data.player.speed);
                break;
            case "Player.OnPropertyChanged":
                this.onPropertyChanged.dispatch(data.property);
                break;
            case "Player.OnResume":
                this.onResume.dispatch(data.player.speed);
                break;
            case "Player.OnSeek":
                this.onSeek.dispatch(toTimestamp(data.player.time));
                break;
            case "Player.OnSpeedChanged":
                this.onSpeedChanged.dispatch(data.player.speed);
                break;
            case "Player.OnStop":
                this.onStop.dispatch(null);
                break;
            default:
                // Ignorer les autres notifications.
        }
    }
};
