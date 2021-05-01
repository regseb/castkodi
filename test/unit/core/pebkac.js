import assert from "node:assert";
import { PebkacError } from "../../../src/core/pebkac.js";

describe("core/pebkac.js", function () {
    describe("constructor()", function () {
        it("should accept one parameter", function () {
            const err = new PebkacError("unconfigured");
            assert.strictEqual(err.message,
                               "Address of Kodi Web server is missing in" +
                               " options.");
            assert.strictEqual(err.name, "PebkacError");
            assert.strictEqual(err.type, "unconfigured");
            assert.strictEqual(err.title, "No address");
        });

        it("should accept two parameters", function () {
            const err = new PebkacError("badAddress", "127.0.0.1");
            assert.strictEqual(err.message,
                              "Address of Kodi Web server 127.0.0.1 is" +
                              " invalid.");
            assert.strictEqual(err.name, "PebkacError");
            assert.strictEqual(err.type, "badAddress");
            assert.strictEqual(err.title, "Address invalid");
        });
    });
});
