export const WebSocket = class {
    constructor(url) {
        this.hostname  = url.hostname.split(".");
        this.onopen    = Function.prototype;
        this.onerror   = Function.prototype;
        this.onclose   = Function.prototype;
        this.onmessage = Function.prototype;

        switch (this.hostname[0]) {
            case "notfound":
                setTimeout(() => {
                    this.onerror();
                }, 1);
                break;
            default:
                setTimeout(() => {
                    this.onopen();
                }, 1);
        }
    }

    send(message) {
        const data = JSON.parse(message);
        let result;
        switch (this.hostname[0]) {
            case "properties":
                switch (this.hostname[1]) {
                    case "noplayer":
                        switch (data.method) {
                            case "Application.GetProperties":
                                result = { "muted": false, "volume": 51 };
                                break;
                            case "Player.GetActivePlayers":
                                result = [];
                                break;
                            default:
                                result = {
                                    "method": data.method,
                                    "params": data.params
                                };
                        }
                        break;
                    case "otherplayer":
                        switch (data.method) {
                            case "Application.GetProperties":
                                result = { "muted": true, "volume": 0 };
                                break;
                            case "Player.GetActivePlayers":
                                result = [{ "playerid": 2 }];
                                break;
                            default:
                                result = {
                                    "method": data.method,
                                    "params": data.params
                                };
                        }
                        break;
                    case "videoplayer":
                        switch (data.method) {
                            case "Application.GetProperties":
                                result = { "muted": false, "volume": 100 };
                                break;
                            case "Player.GetActivePlayers":
                                result = [{ "playerid": 1 }];
                                break;
                            case "Player.GetProperties":
                                result = {
                                    "speed":     1,
                                    "repeat":    "one",
                                    "shuffled":  true,
                                    "time":      {
                                        "hours":   0,
                                        "minutes": 1,
                                        "seconds": 2
                                    },
                                    "totaltime": {
                                        "hours":   1,
                                        "minutes": 2,
                                        "seconds": 3
                                    }
                                };
                                break;
                            default:
                                result = {
                                    "method": data.method,
                                    "params": data.params
                                };
                        }
                        break;
                }
                this.onmessage({
                    "data": JSON.stringify({ "id": data.id, result })
                });
                break;

            case "error":
                this.onmessage({
                    "data": JSON.stringify({
                        "id":    data.id,
                        "error": { "message": "Error message!" }
                    })
                });
                break;

            case "event":
                switch (this.hostname[1]) {
                    case "onvolumechanged":
                        result = {
                            "method": "Application.OnVolumeChanged",
                            "params": { "data": false }
                        };
                        break;
                    case "onavstart":
                        result = {
                            "method": "Player.OnAVStart",
                            "params": { "data": false }
                        };
                        break;
                    case "onpause":
                        result = {
                            "method": "Player.OnPause",
                            "params": { "data": false }
                        };
                        break;
                    case "onplay":
                        result = {
                            "method": "Player.OnPlay",
                            "params": { "data": false }
                        };
                        break;
                    case "onpropertychanged":
                        result = {
                            "method": "Player.OnPropertyChanged",
                            "params": { "data": false }
                        };
                        break;
                    case "onresume":
                        result = {
                            "method": "Player.OnResume",
                            "params": { "data": false }
                        };
                        break;
                    case "onseek":
                        result = {
                            "method": "Player.OnSeek",
                            "params": {
                                "data": {
                                    "item":   "Video name.",
                                    "player": {
                                        "playerid": 1,
                                        "speed":    2,
                                        "time":     {
                                            "hours":   1,
                                            "minutes": 2,
                                            "seconds": 3
                                        }
                                    }
                                }
                            }
                        };
                        break;
                    case "onspeedchanged":
                        result = {
                            "method": "Player.OnSpeedChanged",
                            "params": { "data": false }
                        };
                        break;
                    case "onstop":
                        result = {
                            "method": "Player.OnStop",
                            "params": { "data": false }
                        };
                        break;
                    case "onquit":
                        result = {
                            "method": "Player.OnQuit",
                            "params": { "data": false }
                        };
                        break;
                    default:
                        result = {
                            "method": data.method,
                            "params": data.params
                        };
                }
                this.onmessage({ "data": JSON.stringify(result) });
                break;

            default:
                this.onmessage({
                    "data": JSON.stringify({
                        "id":     data.id,
                        "result": {
                            "method": data.method,
                            "params": data.params
                        }
                    })
                });
        }
    }

    close() {
        this.onclose();
    }
};
