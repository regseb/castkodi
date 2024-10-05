/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { JSONRPC as JSONRPCClient } from "../tools/jsonrpc.js";
import { PebkacError } from "../tools/pebkac.js";
import { Addons } from "./addons.js";
import { Application } from "./application.js";
import { GUI } from "./gui.js";
import { Input } from "./input.js";
import { JSONRPC } from "./jsonrpc.js";
import { Player } from "./player.js";
import { Playlist } from "./playlist.js";
import { System } from "./system.js";

/**
 * @typedef {Object} KodiVersions Les versions de Kodi.
 * @prop {number} API_VERSION La version de l'API JSON-RPC.
 * @prop {number} VERSION     La version de Kodi.
 * @prop {string} NAME        Le nom de la version de Kodi.
 */

/**
 * La version minimale de l'API JSON-RPC de Kodi nécessaire ; et la version
 * (ainsi que son nom) de Kodi liée à la version de l'API.
 *
 * @type {KodiVersions}
 * @see https://kodi.wiki/view/JSON-RPC_API#API_versions
 */
const KODI_VERSIONS = {
    API_VERSION: 13,
    VERSION: 20,
    NAME: "Nexus",
};

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
     * @returns {Promise<string>} Une promesse contenant `"OK"` si Kodi est
     *                            accessible et a une version gérée ; sinon une
     *                            promesse rompue.
     */
    static async check(address) {
        try {
            const kodi = new Kodi(address);
            const version = await kodi.jsonrpc.version();
            kodi.close();
            if (KODI_VERSIONS.API_VERSION > version.major) {
                throw new PebkacError("notSupported", [
                    KODI_VERSIONS.VERSION.toString(),
                    KODI_VERSIONS.NAME,
                ]);
            }
            return "OK";
        } catch (err) {
            if ("notFound" === err.type) {
                const fix = await Kodi.fix(address);
                if (undefined !== fix) {
                    throw new PebkacError("notFound", address, {
                        cause: err,
                        details: { fix },
                    });
                }
            }
            throw err;
        }
    }

    /**
     * Essaie de se connecter à Kodi avec seulement l'adresse IP (ou le nom de
     * domaine) car plusieurs personnes ajoutent des éléments inutiles (le
     * protocole HTTP, un mauvais port...).
     *
     * @param {string} address L'adresse IP ou l'adresse complète du service de
     *                         Kodi.
     * @returns {Promise<string|undefined>} Une promesse contenant une adresse
     *                                      alternative valide ; ou `undefined`
     *                                      si aucune adresse alternative a été
     *                                      trouvée.
     */
    static async fix(address) {
        try {
            const hostname = new URL(address).hostname;
            const kodi = new Kodi(hostname);
            await kodi.jsonrpc.ping();
            kodi.close();
            return hostname;
        } catch {
            // Si une erreur se produit, indiquer que l'essai n'a pas trouvé
            // d'adresse alternative.
            return undefined;
        }
    }

    /**
     * Construit une URL vers le service de Kodi.
     *
     * @param {string} address L'adresse IP ou l'adresse complète du service de
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
            // Si la connexion avec l'adresse complète n'a pas fonctionné :
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
     * L'adresse IP ou l'adresse complète du service de Kodi ; ou `undefined`
     * pour récupérer l'adresse dans la configuration.
     *
     * @type {string|undefined}
     */
    #address;

    /**
     * L'URL du service de Kodi ; ou `undefined` si l'URL n'a pas encore été
     * déterminée.
     *
     * @type {URL|undefined}
     */
    #url;

    /**
     * Le client connecté au service de Kodi ; ou `undefined` si le client n'est
     * pas connecté.
     *
     * @type {JSONRPCClient|undefined}
     */
    #client;

    /**
     * Le client JSON-RPC pour contacter l'espace de nom _Addons_ de Kodi.
     *
     * @type {Addons}
     */
    #addons = new Addons(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom _Application_ de Kodi.
     *
     * @type {Application}
     */
    #application = new Application(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom _GUI_ de Kodi.
     *
     * @type {GUI}
     */
    #gui = new GUI(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom _Input_ de Kodi.
     *
     * @type {Input}
     */
    #input = new Input(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom _JSONRPC_ de Kodi.
     *
     * @type {JSONRPC}
     */
    #jsonrpc = new JSONRPC(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom _Player_ de Kodi.
     *
     * @type {Player}
     */
    #player = new Player(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom _Playlist_ de Kodi.
     *
     * @type {Playlist}
     */
    #playlist = new Playlist(this);

    /**
     * Le client JSON-RPC pour contacter l'espace de nom _System_ de Kodi.
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
     * Retourne l'URL du service de Kodi ; ou `undefined` si l'URL n'a pas
     * encore été déterminée.
     *
     * @returns {URL|undefined} L'URL du service de Kodi ; ou `undefined` si
     *                          l'URL n'a pas encore été déterminée.
     */
    get url() {
        return this.#url;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom _Addons_ de
     * Kodi.
     *
     * @returns {Addons} Le client JSON-RPC pour contacter l'espace de nom
     *                   _Addons_ de Kodi.
     */
    get addons() {
        return this.#addons;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom _Application_
     * de Kodi.
     *
     * @returns {Application} Le client JSON-RPC pour contacter l'espace de nom
     *                        _Application_ de Kodi.
     */
    get application() {
        return this.#application;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom _GUI_ de Kodi.
     *
     * @returns {GUI} Le client JSON-RPC pour contacter l'espace de nom _GUI_ de
     *                Kodi.
     */
    get gui() {
        return this.#gui;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom _Input_ de
     * Kodi.
     *
     * @returns {Input} Le client JSON-RPC pour contacter l'espace de nom
     *                  _Input_ de Kodi.
     */
    get input() {
        return this.#input;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom _JSONRPC_ de
     * Kodi.
     *
     * @returns {JSONRPC} Le client JSON-RPC pour contacter l'espace de nom
     *                    _JSONRPC_ de Kodi.
     */
    get jsonrpc() {
        return this.#jsonrpc;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom _Player_ de
     * Kodi.
     *
     * @returns {Player} Le client JSON-RPC pour contacter l'espace de nom
     *                   _Player_ de Kodi.
     */
    get player() {
        return this.#player;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom _Playlist_ de
     * Kodi.
     *
     * @returns {Playlist} Le client JSON-RPC pour contacter l'espace de nom
     *                     _Playlist_ de Kodi.
     */
    get playlist() {
        return this.#playlist;
    }

    /**
     * Retourne le client JSON-RPC pour contacter l'espace de nom _System_ de
     * Kodi.
     *
     * @returns {System} Le client JSON-RPC pour contacter l'espace de nom
     *                   _System_ de Kodi.
     */
    get system() {
        return this.#system;
    }

    /**
     * Ferme la connexion.
     */
    close() {
        if (undefined !== this.#client) {
            this.#client.close();
            this.#client = undefined;
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
        if (undefined === this.#client) {
            let address;
            // S'il faut récupérer l'adresse dans la configuration.
            if (undefined === this.#address) {
                const config = await browser.storage.local.get([
                    "server-list",
                    "server-active",
                ]);
                address =
                    config["server-list"][config["server-active"]].address;
            } else {
                address = this.#address;
            }
            this.#url = Kodi.build(address);

            try {
                this.#client = await JSONRPCClient.open(this.#url);
                this.#client.addEventListener("close", () => {
                    this.#client = undefined;
                });
                this.#client.addEventListener("notification", (event) => {
                    this.#application.handleNotification(event);
                    this.#input.handleNotification(event);
                    this.#player.handleNotification(event);
                    this.#playlist.handleNotification(event);
                });
            } catch {
                throw new PebkacError("notFound", address);
            }
        }

        return await this.#client.send(method, params);
    }
};

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @type {Kodi}
 */
export const kodi = new Kodi();
