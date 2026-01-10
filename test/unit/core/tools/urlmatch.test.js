/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import { matchURLPattern } from "../../../../src/core/tools/urlmatch.js";

describe("core/tools/urlmatch.js", function () {
    describe("matchURLPattern()", function () {
        it("should support string pattern", async function () {
            const func = mock.fn(() => Promise.resolve("foo"));

            const wrapped = matchURLPattern(func, "*://bar.fr/");
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(wrapped, "name"),
                Object.getOwnPropertyDescriptor(func, "name"),
            );

            let result = await wrapped(new URL("https://bar.fr/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://baz.org/"));
            assert.equal(result, undefined);

            assert.equal(func.mock.callCount(), 1);
            assert.deepEqual(func.mock.calls[0].arguments, [
                new URL("https://bar.fr/"),
            ]);
        });

        it("should support URLPattern", async function () {
            const func = mock.fn(() => Promise.resolve("foo"));

            const wrapped = matchURLPattern(
                func,
                new URLPattern("*://bar.fr/"),
            );
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(wrapped, "name"),
                Object.getOwnPropertyDescriptor(func, "name"),
            );

            let result = await wrapped(new URL("https://bar.fr/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://baz.org/"));
            assert.equal(result, undefined);

            assert.equal(func.mock.callCount(), 1);
            assert.deepEqual(func.mock.calls[0].arguments, [
                new URL("https://bar.fr/"),
            ]);
        });

        it("should support many patterns", async function () {
            const func = mock.fn(() => Promise.resolve("foo"));

            const wrapped = matchURLPattern(
                func,
                "*://bar.io/",
                "https://baz.com/",
            );
            let result = await wrapped(new URL("https://bar.io/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://baz.com/"));
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://qux.org/"));
            assert.equal(result, undefined);

            assert.equal(func.mock.callCount(), 2);
            assert.deepEqual(func.mock.calls[0].arguments, [
                new URL("https://bar.io/"),
            ]);
            assert.deepEqual(func.mock.calls[1].arguments, [
                new URL("https://baz.com/"),
            ]);
        });

        it("should support others parameters", async function () {
            const func = mock.fn(() => Promise.resolve("foo"));

            const wrapped = matchURLPattern(func, "*://bar.com/");
            let result = await wrapped(new URL("https://bar.com/"), "baz");
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://bar.com/"), "baz", "qux");
            assert.equal(result, "foo");
            result = await wrapped(new URL("https://quux.org/"), "corge");
            assert.equal(result, undefined);

            assert.equal(func.mock.callCount(), 2);
            assert.deepEqual(func.mock.calls[0].arguments, [
                new URL("https://bar.com/"),
                "baz",
            ]);
            assert.deepEqual(func.mock.calls[1].arguments, [
                new URL("https://bar.com/"),
                "baz",
                "qux",
            ]);
        });
    });
});
