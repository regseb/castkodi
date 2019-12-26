import assert          from "assert";
import { PebkacError } from "../../../src/core/pebkac.js";

describe("core/pebkac.js", function () {
    describe("constructor()", function () {
        it("should accept one parameter", function () {
            const err = new PebkacError("foo");
            assert.strictEqual(err.name,    "PebkacError");
            assert.strictEqual(err.type,    "foo");
            assert.strictEqual(err.message, "notifications_foo_message");
            assert.strictEqual(err.title,   "notifications_foo_title");
        });

        it("should accept two parameters", function () {
            const err = new PebkacError("bar", "baz");
            assert.strictEqual(err.name,    "PebkacError");
            assert.strictEqual(err.type,    "bar");
            assert.strictEqual(err.message, "notifications_bar_message: baz");
            assert.strictEqual(err.title,   "notifications_bar_title");
        });
    });
});
