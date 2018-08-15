import nodeFetch from "node-fetch";

export const fetch = function (input, init = {}) {
    if (input.startsWith("http://localhost")) {
        switch (input.substring(17, input.indexOf(":", 17))) {
            case "status.notFound":
                return Promise.resolve({ "status": 400 });
            case "status.unauthorized":
                return Promise.resolve({ "status": 401 });
            case "statusText.badHost":
                return Promise.resolve({
                    "statusText": "X is not a valid URL."
                });
            case "statusText.notFound":
                return Promise.resolve({
                    "statusText": "NetworkError when attempting to fetch" +
                                  " resource."
                });
            case "response.error":
                return Promise.resolve({
                    "ok":   true,
                    "json": () => ({ "error": { "message": "response.error" } })
                });
            case "response.properties.noPlayer":
                if (init.body.includes("Application.GetProperties")) {
                    return Promise.resolve({
                        "ok":   true,
                        "json": function () {
                            return {
                                "result": { "muted": false, "volume": 51 }
                            };
                        }
                    });
                }
                if (init.body.includes("Player.GetActivePlayers")) {
                    return Promise.resolve({
                        "ok":   true,
                        "json": () => ({ "result": [] })
                    });
                }
                return Promise.reject(init.body);
            case "response.properties.otherPlayer":
                if (init.body.includes("Application.GetProperties")) {
                    return Promise.resolve({
                        "ok":   true,
                        "json": function () {
                            return {
                                "result": { "muted": true, "volume": 0 }
                            };
                        }
                    });
                }
                if (init.body.includes("Player.GetActivePlayers")) {
                    return Promise.resolve({
                        "ok":   true,
                        "json": () => ({ "result": [{ "playerid": 2 }] })
                    });
                }
                return Promise.reject(init.body);
            case "response.properties.videoPlayer":
                if (init.body.includes("Application.GetProperties")) {
                    return Promise.resolve({
                        "ok":   true,
                        "json": function () {
                            return {
                                "result": { "muted": false, "volume": 100 }
                            };
                        }
                    });
                }
                if (init.body.includes("Player.GetActivePlayers")) {
                    return Promise.resolve({
                        "ok":   true,
                        "json": () => ({ "result": [{ "playerid": 1 }] })
                    });
                }
                if (init.body.includes("Player.GetProperties")) {
                    return Promise.resolve({
                        "ok":   true,
                        "json": function () {
                            return {
                                "result": {
                                    "speed":    1,
                                    "repeat":   "one",
                                    "shuffled": true
                                }
                            };
                        }
                    });
                }
                return Promise.reject(init.body);
            default:
                return Promise.resolve({
                    "ok":   true,
                    "json": () => ({ "result": { input, init } })
                });
        }
    }

    return nodeFetch(input, init);
};
