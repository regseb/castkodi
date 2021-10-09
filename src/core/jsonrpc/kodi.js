/**
 * @module
 */

import { JSONRPC } from "../tools/jsonrpc.js";
import { PebkacError } from "../tools/pebkac.js";
import { Addons } from "./addons.js";
import { Application } from "./application.js";
import { GUI } from "./gui.js";
import { Input } from "./input.js";
import { Player } from "./player.js";
import { Playlist } from "./playlist.js";

/**
 * La version minimale de l'API JSON-RPC de Kodi nécessaire.
 *
 * @type {number}
 */
const KODI_JSONRPC_API_VERSION = 12;

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const Kodi = class {

    /**
     * Vérifie la connexion et la version de Kodi.
     *
     * @param {string} address L'adresse IP ou l'adresse complète du service de
     *                         Kodi.
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code> si
     *                            Kodi est accessible et a une version
     *                            supportée ;
     */
    static async check(address) {
        const kodi = new Kodi(address);
        const result = await kodi.send("JSONRPC.Version");
        kodi.close();
        if (KODI_JSONRPC_API_VERSION > result.version.major) {
            throw new PebkacError("notSupported");
        }
        return "OK";
    }

    /**
     * Construit une URL vers le service de Kodi.
     *
     * @param {string} address L'adresse IP ou l'adresse complête du service de
     *                         Kodi.
     * @returns {URL} L'URL vers le service de Kodi.
     * @throws {PebkacError} Si l'adresse du service de Kodi est invalide.
     */
    static build(address) {
        if ("" === address) {
            throw new PebkacError("unconfigured");
        }
        let url;
        try {
            url = new URL(address);
        } catch {
            // Si la connexion avec l'adresse complète n'a pas fonctionnée :
            // essayer avec l'adresse IP (en y ajoutant le protocol, le port et
            // le chemin).
            try {
                url = new URL(`ws://${address}:9090/jsonrpc`);
            } catch {
                throw new PebkacError("badAddress", address);
            }
            // Si l'URL est incorrecte (car l'adresse IP a été corrigée par le
            // constructeur).
            if (url.hostname !== address.toLowerCase()) {
                throw new PebkacError("badAddress", address);
            }
        }
        return url;
    }

    /**
     * Crée un client JSON-RPC pour contacter Kodi.
     *
     * @param {?string} [address] L'adresse IP ou l'adresse complète du service
     *                            de Kodi ; ou <code>null</code> pour récupérer
     *                            l'adresse dans la configuration.
     */
    constructor(address = null) {

        /**
         * L'adresse IP ou l'adresse complète du service de Kodi ; ou
         * <code>null</code> pour récupérer l'adresse dans la configuration.
         *
         * @private
         * @type {?string}
         */
        this._address = address;

        /**
         * L'URL du service de Kodi ; ou <code>null</code> si l'URL n'a pas
         * encore été déterminée.
         *
         * @private
         * @type {?URL}
         */
        this._url = null;

        /**
         * Le client connecté au service de Kodi ; ou <code>null</code> si le
         * n'est pas connecté.
         *
         * @private
         * @type {?JSONRPC}
         */
        this._jsonrpc = null;

        /**
         * Le client JSON-RPC pour contacter l'espace de nom <em>Addons</em> de
         * Kodi.
         *
         * @private
         * @type {Addons}
         */
        this._addons = new Addons(this);

        /**
         * Le client JSON-RPC pour contacter l'espace de nom
         * <em>Application</em> de Kodi.
         *
         * @private
         * @type {Application}
         */
        this._application = new Application(this);

        /**
         * Le client JSON-RPC pour contacter l'espace de nom <em>GUI</em> de
         * Kodi.
         *
         * @private
         * @type {GUI}
         */
        this._gui = new GUI(this);

        /**
         * Le client JSON-RPC pour contacter l'espace de nom <em>Input</em> de
         * Kodi.
         *
         * @private
         * @type {Input}
         */
        this._input = new Input(this);

        /**
         * Le client JSON-RPC pour contacter l'espace de nom <em>Player</em> de
         * Kodi.
         *
         * @private
         * @type {Player}
         */
        this._player = new Player(this);

        /**
         * Le client JSON-RPC pour contacter l'espace de nom <em>Playlist</em>
         * de Kodi.
         *
         * @private
         * @type {Playlist}
         */
        this._playlist = new Playlist(this);
    }

    /**
     * Retourne l'URL du service de Kodi ; ou <code>null</code> si l'URL n'a pas
     * encore été déterminée.
     *
     * @returns {?URL} L'URL du service de Kodi ; ou <code>null</code> si l'URL
     *                 n'a pas encore été déterminée.
     */
    get url() {
        return this._url;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>Addons</em> de Kodi.
     *
     * @returns {Addons} Le client JSON-RPC pour contacter l'espace de nom
     *                   <em>Addons</em> de Kodi.
     */
    get addons() {
        return this._addons;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>Application</em> de Kodi.
     *
     * @returns {Application} Le client JSON-RPC pour contacter l'espace de nom
     *                        <em>Application</em> de Kodi.
     */
    get application() {
        return this._application;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom <em>GUI</em>
     * de Kodi.
     *
     * @returns {GUI} Le client JSON-RPC pour contacter l'espace de nom
     *                <em>GUI</em> de Kodi.
     */
    get gui() {
        return this._gui;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom <em>Input</em>
     * de Kodi.
     *
     * @returns {Input} Le client JSON-RPC pour contacter l'espace de nom
     *                  <em>Input</em> de Kodi.
     */
    get input() {
        return this._input;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>Player</em> de Kodi.
     *
     * @returns {Player} Le client JSON-RPC pour contacter l'espace de nom
     *                   <em>Player</em> de Kodi.
     */
    get player() {
        return this._player;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>Playlist</em> de Kodi.
     *
     * @returns {Playlist} Le client JSON-RPC pour contacter l'espace de nom
     *                     <em>Playlist</em> de Kodi.
     */
    get playlist() {
        return this._playlist;
    }

    /**
     * Ferme la connexion.
     */
    close() {
        if (null !== this._jsonrpc) {
            this._jsonrpc.close();
            this._jsonrpc = null;
        }
    }

    /**
     * Envoi une requête JSON-RPC à Kodi.
     *
     * @param {string} method   La méthode appelée.
     * @param {any}    [params] Les éventuels paramètres de la méthode.
     * @returns {Promise<any>} Une promesse contenant le résultat de Kodi.
     */
    async send(method, params) {
        if (null === this._jsonrpc) {
            let address;
            // S'il faut récupérer l'adresse dans la configuration.
            if (null === this._address) {
                const config = await browser.storage.local.get([
                    "server-list",
                    "server-active",
                ]);
                address = config["server-list"][config["server-active"]]
                                                                       .address;
            } else {
                address = this._address;
            }
            this._url = Kodi.build(address);

            try {
                this._jsonrpc = await JSONRPC.open(this._url);
                this._jsonrpc.addEventListener("close", () => {
                    this._jsonrpc = null;
                });
                this._jsonrpc.addEventListener("notification", (event) => {
                    this._application.handleNotification(event);
                    this._input.handleNotification(event);
                    this._player.handleNotification(event);
                    this._playlist.handleNotification(event);
                });
            } catch {
                throw new PebkacError("notFound", address);
            }
        }

        return this._jsonrpc.send(method, params);
    }
};
