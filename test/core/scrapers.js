import assert       from "assert";
import { scrapers } from "../../src/core/scrapers.js";

describe("scrapers", function () {
    describe("#scrapers", function () {
        it("should not empty", function () {
            assert.notStrictEqual(0, scrapers.length);
        });

        it("should be an array of object", function () {
            for (const { pattern, action } of scrapers) {
                assert.ok(pattern instanceof RegExp);
                assert.ok(action instanceof Function);
            }
        });
    });
});
