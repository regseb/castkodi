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
     * @param {string} host L'adresse IP (ou le nom de domaine) du serveur
     *                      hébergeant Kodi.
     * @returns {Promise.<object>} Une promesse tenue si Kodi est accessible ;
     *                             sinon une promesse rompue.
     */
    static async check(host) {
        const kodi = new Kodi(host);
        const result = await kodi.send("JSONRPC.Version");
        kodi.close();
        return result;
    }

    /**
     * Get the current player Id. Need in order to support mixed music/video playlists
     *
     * @returns {Promise.<object>} Player id. Sometimes in Kodi docs it referenced as Playlist ID.
     */
    async getCurrentPlayerId(){
        let results;
        results = await this.send("Player.GetActivePlayers");
        return results[0].playerid;
    }


    /**
     * Crée un client JSON-RPC pour contactter Kodi.
     *
     * @param {?string} [host=null] L'adresse IP (ou le nom de domaine) du
     *                              serveur hébergeant Kodi ; ou
     *                              <code>null</code> pour récupérer l'adresse
     *                              dans la configuration.
     */
    constructor(host = null) {
        this.host = host;
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
            let host;
            if (null === this.host) {
                const config = await browser.storage.local.get([
                    "server-list",
                    "server-active",
                ]);
                host = config["server-list"][config["server-active"]].host;
            } else {
                host = this.host;
            }
            if ("" === host) {
                throw new PebkacError("unconfigured");
            }
            let url;
            try {
                url = new URL("ws://" + host + ":9090/jsonrpc");
            } catch {
                throw new PebkacError("badHost", host);
            }
            // Si l'URL est incorrecte (car le nom de domaine a été corrigé
            // par le constructeur).
            if (url.hostname !== host.toLowerCase()) {
                throw new PebkacError("badHost", host);
            }

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
                throw new PebkacError("notFound", host);
            }
        }

        return this.jsonrpc.send(method, params);
    }
};
