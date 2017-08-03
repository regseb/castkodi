"use strict";

define(function () {

    return function (method, params = {}) {
        const keys = ["port", "username", "password", "host"];
        return browser.storage.local.get(keys).then(function (config) {
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
            return response.json();
        }).then(function (response) {
            if ("error" in response) {
                throw new Error(response.error);
            }
            return response.result;
        });
    };
});
