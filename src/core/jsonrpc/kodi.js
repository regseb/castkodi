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
import { System } from "./system.js";

/**
 * La version minimale de l'API JSON-RPC de Kodi nécessaire. Le numéro de
 * de l'API est différent du numéro de version de Kodi.
 *
 * @type {number}
 * @see https://kodi.wiki/view/JSON-RPC_API#API_versions
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
     *                            Kodi est accessible et a une version gérée ;
     *                            sinon une promesse rompue.
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
            // essayer avec l'adresse IP (en y ajoutant le protocole, le port et
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
     * L'adresse IP ou l'adresse complète du service de Kodi ; ou
     * <code>undefined</code> pour récupérer l'adresse dans la configuration.
     *
     * @type {string|undefined}
     */
    #address;

    /**
     * L'URL du service de Kodi ; ou <code>undefined</code> si l'URL n'a pas
     * encore été déterminée.
     *
     * @type {URL|undefined}
     */
    #url;

    /**
     * Le client connecté au service de Kodi ; ou <code>undefined</code> si le
     * client n'est pas connecté.
     *
     * @type {JSONRPC|undefined}
     */
    #jsonrpc;

    /**
     * Le client JSON-RPC pour contacter l'espace de nom <em>Addons</em> de
     * Kodi.
     *
     * @type {Addons}
     */
    #addons = new Addons(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom <em>Application</em> de
     * Kodi.
     *
     * @type {Application}
     */
    #application = new Application(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom <em>GUI</em> de Kodi.
     *
     * @type {GUI}
     */
    #gui = new GUI(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom <em>Input</em> de Kodi.
     *
     * @type {Input}
     */
    #input = new Input(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom <em>Player</em> de
     * Kodi.
     *
     * @type {Player}
     */
    #player = new Player(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom <em>Playlist</em> de
     * Kodi.
     *
     * @type {Playlist}
     */
    #playlist = new Playlist(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom <em>System</em> de
     * Kodi.
     *
     * @type {System}
     */
    #system = new System(this);

    /**
     * Crée un client JSON-RPC pour contacter Kodi.
     *
     * @param {string} [address] L'adresse IP ou l'adresse complète du service
     *                           de Kodi ; ou si elle n'est pas fournie :
     *                           récupérer l'adresse dans la configuration.
     */
    constructor(address) {
        this.#address = address;
    }

    /**
     * Retourne l'URL du service de Kodi ; ou <code>undefined</code> si l'URL
     * n'a pas encore été déterminée.
     *
     * @returns {URL|undefined} L'URL du service de Kodi ; ou
     *                          <code>undefined</code> si l'URL n'a pas encore
     *                          été déterminée.
     */
    get url() {
        return this.#url;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>Addons</em> de Kodi.
     *
     * @returns {Addons} Le client JSON-RPC pour contacter l'espace de nom
     *                   <em>Addons</em> de Kodi.
     */
    get addons() {
        return this.#addons;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>Application</em> de Kodi.
     *
     * @returns {Application} Le client JSON-RPC pour contacter l'espace de nom
     *                        <em>Application</em> de Kodi.
     */
    get application() {
        return this.#application;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom <em>GUI</em>
     * de Kodi.
     *
     * @returns {GUI} Le client JSON-RPC pour contacter l'espace de nom
     *                <em>GUI</em> de Kodi.
     */
    get gui() {
        return this.#gui;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom <em>Input</em>
     * de Kodi.
     *
     * @returns {Input} Le client JSON-RPC pour contacter l'espace de nom
     *                  <em>Input</em> de Kodi.
     */
    get input() {
        return this.#input;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>Player</em> de Kodi.
     *
     * @returns {Player} Le client JSON-RPC pour contacter l'espace de nom
     *                   <em>Player</em> de Kodi.
     */
    get player() {
        return this.#player;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>Playlist</em> de Kodi.
     *
     * @returns {Playlist} Le client JSON-RPC pour contacter l'espace de nom
     *                     <em>Playlist</em> de Kodi.
     */
    get playlist() {
        return this.#playlist;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom
     * <em>System</em> de Kodi.
     *
     * @returns {System} Le client JSON-RPC pour contacter l'espace de nom
     *                   <em>System</em> de Kodi.
     */
    get system() {
        return this.#system;
    }

    /**
     * Ferme la connexion.
     */
    close() {
        if (undefined !== this.#jsonrpc) {
            this.#jsonrpc.close();
            this.#jsonrpc = undefined;
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
        if (undefined === this.#jsonrpc) {
            let address;
            // S'il faut récupérer l'adresse dans la configuration.
            if (undefined === this.#address) {
                const config = await browser.storage.local.get([
                    "server-list",
                    "server-active",
                ]);
                address = config["server-list"][config["server-active"]]
                                                                       .address;
            } else {
                address = this.#address;
            }
            this.#url = Kodi.build(address);

            try {
                this.#jsonrpc = await JSONRPC.open(this.#url);
                this.#jsonrpc.addEventListener("close", () => {
                    this.#jsonrpc = undefined;
                });
                this.#jsonrpc.addEventListener("notification", (event) => {
                    this.#application.handleNotification(event);
                    this.#input.handleNotification(event);
                    this.#player.handleNotification(event);
                    this.#playlist.handleNotification(event);
                });
            } catch {
                throw new PebkacError("notFound", address);
            }
        }

        return this.#jsonrpc.send(method, params);
    }
};

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @type {Kodi}
 */
export const kodi = new Kodi();
