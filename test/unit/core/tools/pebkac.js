import assert from "node:assert/strict";
import { PebkacError } from "../../../../src/core/tools/pebkac.js";

describe("core/tools/pebkac.js", function () {
    describe("constructor()", function () {
        it("should accept only key", function () {
            const err = new PebkacError("unconfigured");
            assert.equal(err.name, "PebkacError");
            assert.equal(err.message,
                         "Address of Kodi Web server is missing in options.");
            assert.equal(err.type, "unconfigured");
            assert.equal(err.title, "No address");
        });

        it("should accept one substitution", function () {
            const err = new PebkacError("badAddress", "127.0.0.1");
            assert.equal(err.name, "PebkacError");
            assert.equal(err.message,
                         "Address of Kodi Web server 127.0.0.1 is invalid.");
            assert.equal(err.type, "badAddress");
            assert.equal(err.title, "Address invalid");
        });

        it("should accept an array of substitutions", function () {
            const err = new PebkacError("notSupported", ["19", "Matrix"]);
            assert.equal(err.name, "PebkacError");
            assert.equal(err.message,
                         "Kodi version 19 (Matrix) is required.");
            assert.equal(err.type, "notSupported");
            assert.equal(err.title, "Kodi version not supported");
        });
    });
});
