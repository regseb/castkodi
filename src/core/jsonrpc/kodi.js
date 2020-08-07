/**
 * @module
 */

import { JSONRPC }     from "../../tools/jsonrpc.js";
import { PebkacError } from "../pebkac.js";
import { Application } from "./application.js";
import { GUI }         from "./gui.js";
import { Input }       from "./input.js";
import { Player }      from "./player.js";
import { Playlist }    from "./playlist.js";

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @see {@link https://kodi.wiki/view/JSON-RPC_API}
 */
export const Kodi = class {

    /**
     * Vérifie la connexion à Kodi.
     *
     * @param {string} address L'adresse IP ou l'adresse complète du service de
     *                         Kodi.
     * @returns {Promise.<object>} Une promesse tenue si Kodi est accessible ;
     *                             sinon une promesse rompue.
     */
    static async check(address) {
        const kodi = new Kodi(address);
        const result = await kodi.send("JSONRPC.Version");
        kodi.close();
        return result;
    }

    /**
     * Construit une URL vers le service de Kodi.
     *
     * @param {string} address L'adresse IP ou l'adresse complête du service de
     *                         Kodi.
     * @returns {URL} L'URL vers le service de Kodi.
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
                url = new URL("ws://" + address + ":9090/jsonrpc");
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
     * @param {?string} [address=null] L'adresse IP ou l'adresse complète du
     *                                 service de Kodi ; ou <code>null</code>
     *                                 pour récupérer l'adresse dans la
     *                                 configuration.
     */
    constructor(address = null) {
        this.address = address;
        this.jsonrpc = null;

        this.application = new Application(this);
        this.gui         = new GUI(this);
        this.input       = new Input(this);
        this.player      = new Player(this);
        this.playlist    = new Playlist(this);
    }

    /**
     * Ferme la connexion.
     */
    close() {
        if (null !== this.jsonrpc) {
            this.jsonrpc.close();
            this.jsonrpc = null;
        }
    }

    /**
     * Envoi une requête JSON-RPC à Kodi.
     *
     * @param {string} method   La méthode appelée.
     * @param {*}      [params] Les éventuels paramètres de la méthode.
     * @returns {Promise.<*>} Une promesse contenant le résultat de Kodi.
     */
    async send(method, params) {
        if (null === this.jsonrpc) {
            let address;
            if (null === this.address) {
                const config = await browser.storage.local.get([
                    "server-list",
                    "server-active",
                ]);
                address = config["server-list"][config["server-active"]]
                                                                       .address;
            } else {
                address = this.address;
            }
            const url = Kodi.build(address);

            try {
                this.jsonrpc = await JSONRPC.open(url);
                this.jsonrpc.addEventListener("close", () => {
                    this.jsonrpc = null;
                });
                this.jsonrpc.addEventListener("notification", (event) => {
                    this.application.handleNotification(event);
                    this.player.handleNotification(event);
                    this.playlist.handleNotification(event);
                });
            } catch {
                throw new PebkacError("notFound", address);
            }
        }

        return this.jsonrpc.send(method, params);
    }
};
