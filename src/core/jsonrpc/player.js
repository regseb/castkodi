/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { NotificationListener } from "./notificationlistener.js";

/**
 * @import { NotificationEvent } from "../tools/notificationevent.js"
 * @import { Kodi } from "./kodi.js"
 */

/**
 * @typedef {Object} GlobalTime
 * @prop {number} hours        L'heure du temps.
 * @prop {number} minutes      La minute du temps.
 * @prop {number} seconds      La seconde du temps.
 * @prop {number} milliseconds La milliseconde du temps.
 * @see https://kodi.wiki/view/JSON-RPC_API/v13#Global.Time
 */

/**
 * Les valeurs par défaut des propriétés de l'espace de nom _Player_.
 *
 * @type {Record<string, any>}
 */
const DEFAULT_PROPERTIES = {
    active: false,
    position: -1,
    repeat: "off",
    shuffled: false,
    speed: 0,
    time: 0,
    totaltime: 0,
};

/**
 * Convertit un horodatage vers un temps au format objet.
 *
 * @param {number} timestamp L'horodatage en secondes.
 * @returns {GlobalTime} Le temps au format objet contenant l'heure,
 *                       les minutes, les secondes et les millisecondes.
 */
const toTime = (timestamp) => {
    return {
        hours: Math.trunc(timestamp / 3600),
        minutes: Math.trunc(timestamp / 60) % 60,
        seconds: timestamp % 60,
        milliseconds: 0,
    };
};

/**
 * Convertit un temps au format objet vers un horodatage.
 *
 * @param {GlobalTime} time Le temps au format objet contenant l'heure, les
 *                          minutes, les secondes et les millisecondes.
 * @returns {number} L'horodatage en secondes.
 */
const toTimestamp = (time) => {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
};

/**
 * Le client JSON-RPC pour contacter l'espace de nom _Player_ de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const Player = class {
    /**
     * Le client pour contacter Kodi.
     *
     * @type {Kodi}
     */
    #kodi;

    /**
     * Le gestionnaire des auditeurs pour les notifications de changement de
     * propriétés du lecteur.
     *
     * @type {NotificationListener}
     */
    onPropertyChanged = new NotificationListener();

    /**
     * Crée un client JSON-RPC pour l'espace de nom _Player_.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Ajoute des sous-titres.
     *
     * @param {string} subtitle Le lien des sous-titres.
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    addSubtitle(subtitle) {
        return this.#kodi.send("Player.AddSubtitle", { playerid: 1, subtitle });
    }

    /**
     * Récupère des propriétés de l'espace de nom _Player_ de Kodi.
     *
     * @param {string[]} properties Les noms des propriétés demandées.
     * @returns {Promise<Object>} Une promesse contenant les valeurs des
     *                            propriétés.
     */
    async getProperties(properties) {
        const players = await this.#kodi.send("Player.GetActivePlayers");
        // Ne pas demander les propriétés du lecteur vidéo quand :
        // - aucun lecteur n'est actif, car le changement des propriétés
        //   "shuffle" et "repeat" ne sont plus remontés ;
        // - un autre lecteur est actif, parce que la méthode échoue.
        // https://github.com/xbmc/xbmc/issues/17896
        // https://github.com/xbmc/xbmc/issues/17897
        if (players.some((p) => 1 === p.playerid)) {
            const results = await this.#kodi.send("Player.GetProperties", {
                playerid: 1,
                properties: properties.filter((p) => "active" !== p),
            });
            return Object.fromEntries(
                Object.entries({
                    ...(properties.includes("active") ? { active: true } : {}),
                    ...results,
                }).map(([key, value]) => {
                    return "time" === key || "totaltime" === key
                        ? [key, toTimestamp(value)]
                        : [key, value];
                }),
            );
        }

        return Object.fromEntries(
            properties.map((p) => [p, DEFAULT_PROPERTIES[p]]),
        );
    }

    /**
     * Récupère une propriété de l'espace de nom _Player_ de Kodi.
     *
     * @param {string} property Le nom de la propriété demandée.
     * @returns {Promise<any>} Une promesse contenant la valeur de la propriété.
     */
    async getProperty(property) {
        const result = await this.getProperties([property]);
        return result[property];
    }

    /**
     * Passe au prochain ou précédent élément dans la liste de lecture.
     *
     * @param {string} to `"next"` pour le prochain élément ; `"previous"` pour
     *                    le précédent.
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    goTo(to) {
        return this.#kodi.send("Player.GoTo", { playerid: 1, to });
    }

    /**
     * Démarre la lecture.
     *
     * @param {number} [position] La position dans la liste de lecture (ou par
     *                            défaut le premier élément).
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    open(position = 0) {
        return this.#kodi.send("Player.Open", {
            item: { playlistid: 1, position },
        });
    }

    /**
     * Lance ou met en pause la lecture.
     *
     * @returns {Promise<number>} Une promesse contenant la vitesse de lecture.
     */
    async playPause() {
        const result = await this.#kodi.send("Player.PlayPause", {
            playerid: 1,
        });
        return result.speed;
    }

    /**
     * Déplace le curseur de lecture.
     *
     * @param {number} time La nouvelle position en seconde.
     * @returns {Promise<number>} Une promesse contenant la nouvelle position en
     *                            seconde.
     */
    async seek(time) {
        const result = await this.#kodi.send("Player.Seek", {
            playerid: 1,
            value: { time: toTime(time) },
        });
        return toTimestamp(result.time);
    }

    /**
     * Répète la liste de lecture ou un élément de la liste.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    setRepeat() {
        return this.#kodi.send("Player.SetRepeat", {
            playerid: 1,
            repeat: "cycle",
        });
    }

    /**
     * Mélange (ou trie) la liste de lecture.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    setShuffle() {
        return this.#kodi.send("Player.SetShuffle", {
            playerid: 1,
            shuffle: "toggle",
        });
    }

    /**
     * Change la vitesse de lecture.
     *
     * @param {string} speed La variation de la vitesse : `"increment"` ou
     *                       `"decrement"`.
     * @returns {Promise<number>} Une promesse contenant la nouvelle vitesse de
     *                            lecture.
     */
    async setSpeed(speed) {
        const result = await this.#kodi.send("Player.SetSpeed", {
            playerid: 1,
            speed,
        });
        return result.speed;
    }

    /**
     * Arrête la lecture.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    stop() {
        return this.#kodi.send("Player.Stop", { playerid: 1 });
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom _Player_.
     *
     * @param {NotificationEvent} notification L'évènement d'une notification
     *                                         reçu de Kodi.
     */
    async handleNotification({ method, params: { data } }) {
        // Analyser seulement les notifications venant de l'espace Player, si
        // des auditeurs sont présents et si elles viennent du lecteur des
        // vidéos (ou d'un lecteur non-défini).
        if (
            !method.startsWith("Player.") ||
            0 === this.onPropertyChanged.length ||
            ("player" in data && 1 !== data.player.playerid)
        ) {
            return;
        }
        switch (method.slice(7)) {
            case "OnAVStart":
                this.onPropertyChanged.dispatch({
                    active: true,
                    speed: data.player.speed,
                    ...(await this.getProperties([
                        "position",
                        "repeat",
                        "shuffled",
                        "time",
                        "totaltime",
                    ])),
                });
                break;
            case "OnPause":
                this.onPropertyChanged.dispatch({ speed: data.player.speed });
                break;
            case "OnPropertyChanged":
                this.onPropertyChanged.dispatch(data.property);
                break;
            case "OnResume":
                this.onPropertyChanged.dispatch({ speed: data.player.speed });
                break;
            case "OnSeek":
                this.onPropertyChanged.dispatch({
                    time: toTimestamp(data.player.time),
                });
                break;
            case "OnSpeedChanged":
                this.onPropertyChanged.dispatch({ speed: data.player.speed });
                break;
            case "OnStop":
                this.onPropertyChanged.dispatch({
                    active: false,
                    position: -1,
                    speed: 0,
                    time: 0,
                    totaltime: 0,
                });
                break;
            default:
            // Ignorer les autres notifications.
        }
    }
};
