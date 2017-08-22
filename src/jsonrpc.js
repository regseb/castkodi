"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * Le message d'erreur si la connexion a échouée.
     */
    const NETWORK_ERROR = "NetworkError when attempting to fetch resource.";

    /**
     * Envoie une requête à Kodi en utilisant le protocol JSON-RPC.
     *
     * @param {string} method La méthode envoyée à Kodi.
     * @param {Object} params Les paramètres de la méthode.
     * @return {Promise} La réponse de Kodi.
     */
    const jsonrpc = function (method, params = {}) {
        const keys = ["port", "username", "password", "host"];
        return browser.storage.local.get(keys).then(function (config) {
            if (!("host" in config && "port" in config)) {
                throw new PebkacError("unconfigured");
            }

            const url = "http://" + config.host +
                              ":" + config.port + "/jsonrpc";
            const init = {
                "method":  "POST",
                "headers": { "Content-Type": "application/json" },
                "body":    JSON.stringify({
                    "jsonrpc": "2.0",
                    "id":      "1",
                    "method":  method,
                    "params":  params
                })
            };
            if ("username" in config) {
                init.headers.Authorization =
                       "Basic " + btoa(config.username + ":" + config.password);
            }
            return fetch(url, init);
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }

            if (400 === response.status) {
                throw new PebkacError("notfound");
            }
            if (401 === response.status) {
                throw new PebkacError("unauthorized");
            }
            throw new Error(response.statusText);
        }).then(function (response) {
            if ("error" in response) {
                throw new Error(response.error.message);
            }
            return response.result;
        }).catch(function (error) {
            if (error.message.endsWith(" is not a valid URL.")) {
                throw new PebkacError("badhost");
            }
            if (NETWORK_ERROR === error.message) {
                throw new PebkacError("notfound");
            }
            throw error;
        });
    }; // jsonrpc()

    return jsonrpc;
});
