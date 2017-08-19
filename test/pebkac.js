"use strict";

const assert    = require("assert");
const requirejs = require("requirejs");

global.browser = require("./mock/browser");

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("pebkac", function () {
    let Module;

    before(function (done) {
        requirejs(["pebkac"], function (pebkac) {
            Module = pebkac;
            done();
        });
    });

    describe("constructor", function () {
        it("should accept one parameter", function () {
            const error = new Module("foo");
            assert.strictEqual(error.name, "PebkacError");
            assert.strictEqual(error.message, "notifications_foo_message");
            assert.strictEqual(error.title, "notifications_foo_title");
        });

        it("should accept two parameters", function () {
            const error = new Module("bar", "baz");
            assert.strictEqual(error.name, "PebkacError");
            assert.strictEqual(error.message, "notifications_bar_message: baz");
            assert.strictEqual(error.title, "notifications_bar_title");
        });
    });
});
