/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { PebkacError } from "../../../../src/core/tools/pebkac.js";

describe("core/tools/pebkac.js", function () {
    describe("constructor()", function () {
        it("should accept only key", function () {
            const err = new PebkacError("unconfigured");
            assert.equal(err.name, "PebkacError");
            assert.equal(
                err.message,
                "Address of Kodi Web server is missing in options.",
            );
            assert.equal(err.cause, undefined);
            assert.equal(err.type, "unconfigured");
            assert.equal(err.title, "No address");
            assert.deepEqual(err.details, {});
        });

        it("should accept one substitution", function () {
            const err = new PebkacError("badAddress", "127.0.0.1");
            assert.equal(err.name, "PebkacError");
            assert.equal(
                err.message,
                "Address of Kodi Web server 127.0.0.1 is invalid.",
            );
            assert.equal(err.cause, undefined);
            assert.equal(err.type, "badAddress");
            assert.equal(err.title, "Address invalid");
            assert.deepEqual(err.details, {});
        });

        it("should accept an array of substitutions", function () {
            const err = new PebkacError("notSupported", ["19", "Matrix"]);
            assert.equal(err.name, "PebkacError");
            assert.equal(err.message, "Kodi version 19 (Matrix) is required.");
            assert.equal(err.cause, undefined);
            assert.equal(err.type, "notSupported");
            assert.equal(err.title, "Kodi version not supported");
            assert.deepEqual(err.details, {});
        });

        it("should accept a cause", function () {
            const err = new PebkacError("unknown", [], { cause: "foo" });
            assert.equal(err.name, "PebkacError");
            assert.equal(err.message, "");
            assert.equal(err.cause, "foo");
            assert.equal(err.type, "unknown");
            assert.equal(err.title, "Unknown error");
            assert.deepEqual(err.details, {});
        });

        it("should accept details", function () {
            const err = new PebkacError("notFound", ["foo"], {
                details: { bar: "baz" },
            });
            assert.equal(err.name, "PebkacError");
            assert.equal(
                err.message,
                "Address of Kodi Web server foo is invalid or Kodi's remote control isn't enabled.",
            );
            assert.equal(err.cause, undefined);
            assert.equal(err.type, "notFound");
            assert.equal(err.title, "Kodi not found");
            assert.deepEqual(err.details, { bar: "baz" });
        });
    });
});
