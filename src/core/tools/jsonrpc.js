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
                                                 `${url.href} unestablished`)));
        });
    }

    /**
     * La WebSocket connectée au serveur.
     *
     * @type {WebSocket}
     */
    #ws;

    /**
     * L'identifiant de la précédente requête.
     *
     * @type {number}
     */
    #id = 0;

    /**
     * La liste des promesses en attente d'être réalisées.
     *
     * @type {Map<number, Object<string, Function>>}
     */
    #promises = new Map();

    /**
     * Crée un client JSON-RPC.
     *
     * @param {WebSocket} ws La WebSocket connectée au serveur.
     */
    constructor(ws) {
        super();
        this.#ws = ws;

        this.#ws.addEventListener("close", this.#handleClose.bind(this));
        this.#ws.addEventListener("message", this.#handleMessage.bind(this));
    }

    /**
     * Ferme la connexion.
     */
    close() {
        this.#ws.close();
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
            this.#promises.set(++this.#id, { resolve, reject });
            this.#ws.send(JSON.stringify({
                jsonrpc: "2.0",
                method,
                ...undefined === params ? {} : { params },
                id:      this.#id,
            }));
        });
    }

    /**
     * Transfère un évènement de fermeture.
     *
     * @param {CloseEvent} event L'évènement de fermeture reçu de la WebSocket.
     */
    #handleClose(event) {
        // Redéclarer un CloseEvent, sinon l'évènement n'est pas réparti dans
        // les écouteurs "close".
        this.dispatchEvent(new CloseEvent(event.type, event));
    }

    /**
     * Répartit un message à une promesse ou une notification.
     *
     * @param {MessageEvent} message Le message reçu du serveur.
     */
    #handleMessage({ data }) {
        const response = JSON.parse(data);
        if ("id" in response) {
            if ("error" in response) {
                this.#promises.get(response.id).reject(
                    new Error(response.error.message),
                );
            } else {
                this.#promises.get(response.id).resolve(response.result);
            }
            this.#promises.delete(response.id);
        } else {
            this.dispatchEvent(new NotificationEvent("notification", response));
        }
    }
};
