/**
 * @module
 */

import { NotificationEvent } from "./notificationevent.js";

/**
 * Le client pour se connecter à un serveur JSON-RPC.
 *
 * @see https://www.jsonrpc.org/
 */
export const JSONRPC = class extends EventTarget {

    /**
     * Ouvre une connexion avec un serveur JSON-RPC.
     *
     * @param {URL} url L'URL du serveur.
     * @returns {Promise<JSONRPC>} Une promesse contenant le client JSON-RPC.
     */
    static open(url) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url.href);
            ws.addEventListener("open", () => resolve(new JSONRPC(ws)));
            ws.addEventListener("error",
                () => reject(new Error("Connection to the server at " +
                                       url.href + " unestablished")));
        });
    }

    /**
     * Crée un client JSON-RPC.
     *
     * @private
     * @param {WebSocket} ws La WebSocket connectée au serveur.
     */
    constructor(ws) {
        super();

        /**
         * La WebSocket connectée au serveur.
         *
         * @private
         * @type {WebSocket}
         */
        this._ws = ws;

        /**
         * L'identifiant de la précédente requête.
         *
         * @private
         * @type {number}
         */
        this._id = 0;

        /**
         * La liste des promesses en attente d'être réalisées.
         *
         * @private
         * @type {Map<number, Object<string, Function>>}
         */
        this._promises = new Map();

        this._ws.addEventListener("close", this._handleClose.bind(this));
        this._ws.addEventListener("message", this._handleMessage.bind(this));
    }

    /**
     * Ferme la connexion.
     */
    close() {
        this._ws.close();
    }

    /**
     * Envoie une requête au serveur.
     *
     * @param {string} method   La méthode appelée.
     * @param {any}    [params] Les éventuels paramètres de la méthode.
     * @returns {Promise<any>} Une promesse contenant le résultat du serveur.
     */
    send(method, params) {
        return new Promise((resolve, reject) => {
            this._promises.set(++this._id, { resolve, reject });
            this._ws.send(JSON.stringify({
                jsonrpc: "2.0",
                method,
                ...undefined === params ? {} : { params },
                id:      this._id,
            }));
        });
    }

    /**
     * Transfère un évènement de fermeture.
     *
     * @private
     * @param {CloseEvent} event L'évènement de fermeture reçu de la WebSocket.
     */
    _handleClose(event) {
        // Redéclarer un CloseEvent, sinon l'évènement n'est pas réparti dans
        // les écouteurs "close".
        this.dispatchEvent(new CloseEvent(event.type, event));
    }

    /**
     * Répartit un message à une promesse ou une notification.
     *
     * @private
     * @param {MessageEvent} message Le message reçu du serveur.
     */
    _handleMessage({ data }) {
        const response = JSON.parse(data);
        if ("id" in response) {
            if ("error" in response) {
                this._promises.get(response.id).reject(
                    new Error(response.error.message),
                );
            } else {
                this._promises.get(response.id).resolve(response.result);
            }
            this._promises.delete(response.id);
        } else {
            this.dispatchEvent(new NotificationEvent("notification", response));
        }
    }
};
