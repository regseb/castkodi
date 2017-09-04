"use strict";

const requirejs = require("requirejs");

global.browser = require("../mock/browser");

requirejs.config({
    "baseUrl":     "src/core",
    "nodeRequire": require
});

describe("notify", function () {
    let notify;

    before(function (done) {
        requirejs(["notify"], function (module) {
            notify = module;
            done();
        });
    });

    it("should accept Error", function () {
        notify(new Error("Message."));
    });

    it("should accept PebkacError", function () {
        const error = {
            "name":    "PebkacError",
            "title":   "Titre",
            "message": "Message."
        };
        notify(error);
    });
});
