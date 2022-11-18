import assert from "node:assert/strict";
import { PebkacError } from "../../../../src/core/tools/pebkac.js";

describe("core/tools/pebkac.js", function () {
    describe("constructor()", function () {
        it("should accept one parameter", function () {
            const err = new PebkacError("unconfigured");
            assert.equal(err.message,
                         "Address of Kodi Web server is missing in options.");
            assert.equal(err.name, "PebkacError");
            assert.equal(err.type, "unconfigured");
            assert.equal(err.title, "No address");
        });

        it("should accept two parameters", function () {
            const err = new PebkacError("badAddress", "127.0.0.1");
            assert.equal(err.message,
                         "Address of Kodi Web server 127.0.0.1 is invalid.");
            assert.equal(err.name, "PebkacError");
            assert.equal(err.type, "badAddress");
            assert.equal(err.title, "Address invalid");
        });
    });
});
