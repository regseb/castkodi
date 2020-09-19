/**
 * @module
 */

import { NotificationListener } from "./notificationlistener.js";

/**
 * Convertit un horodatage vers un temps au format objet.
 *
 * @param {number} timestamp L'horodatage en secondes.
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
 * @returns {number} L'horodatage en secondes.
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

        this.onPropertyChanged = new NotificationListener();
    }

    /**
     * Récupère des propriétés de l'espace de nom <em>Player</em> de Kodi.
     *
     * @param {Array.<string>} properties Les noms des propriétés demandées.
     * @returns {Promise.<object>} Une promesse contenant les valeurs des
     *                             propriétés.
     */
    async getProperties(properties) {
        const players = await this.kodi.send("Player.GetActivePlayers");
        // Ne pas demander les propriétés du lecteur vidéo quand un autre
        // lecteur est actif. https://github.com/xbmc/xbmc/issues/17897
        if (players.some((p) => 1 === p.playerid)) {
            const results = await this.kodi.send("Player.GetProperties", {
                playerid: 1,
                properties,
            });
            return Object.fromEntries(Object.entries(results)
                .map(([key, value]) => {
                    return "time" === key || "totaltime" === key
                                                     ? [key, toTimestamp(value)]
                                                     : [key, value];
                }));
        }

        return {
            position:  -1,
            repeat:    "off",
            shuffled:  false,
            speed:     0,
            time:      0,
            totaltime: 0,
        };
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
     * Passe au prochain ou précédent élément dans la liste de lecture.
     *
     * @param {string} to <code>"next"</code> pour le prochain élément ;
     *                    <code>"previous"</code> pour le précédent.
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    goTo(to) {
        return this.kodi.send("Player.GoTo", { playerid: 1, to });
    }

    /**
     * Démarre la lecture.
     *
     * @param {number} [position] La position dans la liste de lecture (ou par
     *                            défaut le premier élément).
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    open(position = 0) {
        return this.kodi.send("Player.Open", {
            item: { playlistid: 1, position },
        });
    }

    /**
     * Lance ou met en pause la lecture.
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
     * Déplace le curseur de lecture.
     *
     * @param {number} time La nouvelle position en seconde.
     * @returns {Promise.<number>} Une promesse contenant la nouvelle position
     *                             en seconde.
     */
    async seek(time) {
        // Attention ! Kodi n'accepte pas des positions supérieures à 24h.
        // https://github.com/xbmc/xbmc/issues/17907
        const result = await this.kodi.send("Player.Seek", {
            playerid: 1,
            value:    { time: toTime(time) },
        });
        return toTimestamp(result.time);
    }

    /**
     * Répète la liste de lecture ou un élément de la liste.
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
     * Mélange (ou trie) la liste de lecture.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    setShuffle() {
        return this.kodi.send("Player.SetShuffle", {
            playerid: 1,
            shuffle:  "toggle",
        });
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
     * Add subtitle to player
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    addSubtitle(subtitle) {
        return this.kodi.send("Player.AddSubtitle", {
            playerid: 1,
            subtitle:  subtitle,
        });
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
    async handleNotification({ method, params: { data } }) {
        // Garder seulement les notifications du lecteur de vidéo et si des
        // auditeurs sont présents.
        if (!method.startsWith("Player.") ||
                "player" in data && 1 !== data.player.playerid ||
                0 === this.onPropertyChanged.length) {
            return;
        }
        switch (method) {
            case "Player.OnAVStart":
                this.onPropertyChanged.dispatch({
                    ...await this.getProperties([
                        "position", "time", "totaltime",
                    ]),
                    speed: data.player.speed,
                });
                break;
            case "Player.OnPause":
                this.onPropertyChanged.dispatch({ speed: data.player.speed });
                break;
            case "Player.OnPropertyChanged":
                this.onPropertyChanged.dispatch(data.property);
                break;
            case "Player.OnResume":
                this.onPropertyChanged.dispatch({ speed: data.player.speed });
                break;
            case "Player.OnSeek":
                this.onPropertyChanged.dispatch({
                    time: toTimestamp(data.player.time),
                });
                break;
            case "Player.OnSpeedChanged":
                this.onPropertyChanged.dispatch({ speed: data.player.speed });
                break;
            case "Player.OnStop":
                this.onPropertyChanged.dispatch({
                    position:  -1,
                    speed:     0,
                    time:      0,
                    totaltime: 0,
                });
                break;
            default:
                // Ignorer les autres notifications.
        }
    }
};
